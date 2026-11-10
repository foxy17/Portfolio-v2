---
title: Why Your Agent Retrieves the Wrong Thing
description: >-
  Top-k vector search misses exact tokens like error codes. Fix retrieval in
  plain Postgres: full-text search beside pgvector, RRF merging, a reranker on
  the shortlist, and an eval to prove it.
pubDate: 2026-06-10
tags:
  - ai
  - agents
  - rag
  - retrieval
  - hybrid-search
  - pgvector
  - postgres
  - full-text-search
  - reranking
  - context-engineering
category: engineering
draft: true
---
Ask your agent about that `ECONNRESET` bug from last week and watch it flail. The memory exists — a row saying the staging deploy died with `ECONNRESET` until someone bumped the connection pool. Vector search returns five rows about flaky networks and retry policies. None of them contain the string `ECONNRESET`. The agent answers from the neighborhood of the fact instead of the fact, and the user, who can still see last week's conversation in their scrollback, stops trusting it.

[Last post](/how-ai-agents-remember) I claimed that almost every "my agent forgot" bug is a broken Read, then toured the rest of memory anyway. This post stays on the one verb. By the end you can say why top-k similarity misses queries like the one above, fix it with two SQL statements and one query in the Postgres you already run, and measure whether the fix earned its keep. Chunking, embedding model choice, and graphs are out of scope on purpose.

## What cosine actually ranks

Top-k retrieval embeds the query, embeds every stored chunk, and ranks by cosine distance. The embedding model was trained to pull paraphrases together, which is the whole appeal: "cancel my booking" lands near "I want a refund" with no shared words.

That training objective has a blind spot: tokens that carry meaning by being exact. `ECONNRESET` is not a word the model knows. The tokenizer shreds it into fragments, the training data contains few of them, and the embedding for "deploy failed with ECONNRESET" lands in the same region as every other failed-deploy sentence. The one detail that made the memory worth storing contributes almost nothing to where the vector sits.

The same failure shape covers more than error codes:

- **Identifiers:** order numbers, SKUs, commit hashes, `v16.4.1` versus `v16.4.2`.
- **Names:** "what did Priya say about auth" retrieves auth talk from anyone.
- **Negation:** "does not use TypeScript" embeds a short hop from "uses TypeScript". The vectors agree; the facts are opposites.

This is measured. [BEIR](https://arxiv.org/abs/2104.08663) benchmarked retrieval zero-shot across 18 datasets and found BM25 — keyword scoring from the 1990s — beating most dense retrievers once queries left the training domain. Dense retrieval wins on paraphrase. Lexical wins on exact match. Your agent's memory queries arrive in both shapes, so picking one engine means picking which half of your users to fail.

## The keyword engine you already run

The memory post argued for [grounding memory in the database you already have](/how-ai-agents-remember). That argument pays off again here, because Postgres ships a full-text engine and most teams reach past it for a search service. Two statements bolt it onto the `agent_memory` table from last time:

```sql
ALTER TABLE agent_memory
  ADD COLUMN fact_tsv tsvector
  GENERATED ALWAYS AS (to_tsvector('english', fact)) STORED;

CREATE INDEX agent_memory_fact_tsv_idx
  ON agent_memory USING gin (fact_tsv);
```

The generated column stays in sync on every write with no trigger to maintain. Query it with `websearch_to_tsquery`, which accepts what a person actually types — quoted phrases, `-exclusions` — without you parsing anything:

```sql
SELECT fact
FROM agent_memory
WHERE user_id = $1
  AND valid_until IS NULL
  AND fact_tsv @@ websearch_to_tsquery('english', $query)
ORDER BY ts_rank(fact_tsv, websearch_to_tsquery('english', $query)) DESC
LIMIT 25;
```

Run this beside the pgvector query from last post and `ECONNRESET` is a top hit again — for keyword queries. Paraphrases now miss. You have two engines that fail on opposite halves of the problem, which is progress, but only if you can merge them.

## Merging two lists without comparing scores

Here is the trap: cosine distances and `ts_rank` scores live on different scales with different distributions, and normalizing one against the other is a tuning pit you never climb out of. Reciprocal Rank Fusion skips the problem by throwing both scores away and keeping only the ranks. A document at rank *r* in a list contributes `1 / (60 + r)`, summed across lists. [Cormack, Clarke, and Büttcher](https://dl.acm.org/doi/10.1145/1571941.1572114) published it in 2009 as a one-paragraph method that beat learned fusion approaches on TREC runs, and it has aged embarrassingly well. The constant 60 keeps the top rank from dominating; nobody tunes it much.

The whole hybrid read is one query:

```sql
WITH vector_hits AS (
  SELECT id,
         row_number() OVER (ORDER BY embedding <=> $query_embedding) AS rank
  FROM agent_memory
  WHERE user_id = $1 AND valid_until IS NULL
  ORDER BY embedding <=> $query_embedding
  LIMIT 25
),
keyword_hits AS (
  SELECT id,
         row_number() OVER (
           ORDER BY ts_rank(fact_tsv, websearch_to_tsquery('english', $query)) DESC
         ) AS rank
  FROM agent_memory
  WHERE user_id = $1 AND valid_until IS NULL
    AND fact_tsv @@ websearch_to_tsquery('english', $query)
  LIMIT 25
)
SELECT m.fact,
       coalesce(1.0 / (60 + v.rank), 0)
     + coalesce(1.0 / (60 + k.rank), 0) AS rrf_score
FROM vector_hits v
FULL OUTER JOIN keyword_hits k USING (id)
JOIN agent_memory m USING (id)
ORDER BY rrf_score DESC
LIMIT 5;
```

<!-- diagram: two ranked lists (vector, keyword) flowing into an RRF merge; the ECONNRESET row sits near the bottom of the vector list and at the top of the keyword list, and lands top-3 after fusion -->

Walk the `ECONNRESET` query through it. The row ranks first in the keyword list and somewhere around twentieth in the vector list, so it collects `1/61 + 1/80` and beats every chunk that appeared in only one list. A paraphrase query takes the mirrored path: strong vector rank, absent from keywords, still surfaces. Each engine covers the other's blind spot, and no memory got smarter — only the Read did.

## The reranker, and the thing it cannot do

The hybrid query optimizes for recall: get the right row into the candidate set. Top-5 precision is a different job, and the tool for it is a cross-encoder reranker. Where the embedding model encoded query and chunk separately, a cross-encoder reads them together, attention flowing across both, and outputs one relevance score. Too slow to run over a corpus; fine over fifty rows. So you widen the hybrid query's `LIMIT` to 50, rerank, and keep five.

<!-- diagram: funnel from corpus to ~50 hybrid candidates to 5 reranked rows in the prompt, with "recall happens here" labeling the first narrowing and "precision happens here" labeling the second -->

Be clear about what you bought. A reranker reorders the candidate set. It cannot recover a row the retrieval stage never fetched — recall is settled before it runs. [One recent benchmark](https://arxiv.org/abs/2604.01733) measured the stages separately on its corpus: dense retrieval alone hit Recall@5 of 0.587, hybrid with RRF reached 0.695, and hybrid plus a cross-encoder reached 0.816. Treat the digits as local to that dataset, but the ordering repeats across the literature: hybrid buys recall, reranking buys precision, and stacking them beats either alone.

> **Going deeper.** Rerankers come hosted ([Cohere Rerank](https://docs.cohere.com/docs/rerank-overview), [Voyage](https://docs.voyageai.com/docs/reranker)) or open-weight (the bge-reranker family) — budget roughly 50–200 ms per call on fifty candidates, plus the bill. Skip the stage when your top-5 already matches your top-50 on the eval below, and revisit when memory grows. The widen-then-rerank pattern also caps a subtle cost: every retrieved row you put in the prompt spends tokens and attention, and last post's [context rot](https://www.trychroma.com/research/context-rot) citation applies to retrieval results too. Five good rows beat twenty plausible ones.

## Prove each stage before you pay for it

Every stage adds latency and cost on every single turn: the second index, the wider fetch, the rerank call. The memory post put recall@k first on the eval checklist; here is the whole method. Collect twenty real queries from your logs. For each, record which memory row a correct answer needs. Run three configurations — dense only, hybrid, hybrid plus reranker — and score Recall@5 for each. An afternoon of work, and now the architecture argument is over numbers instead of blog posts, including this one.

Keep a stage only if it moved your number. If hybrid gains nothing, your real queries may carry no exact tokens — plausible for a pure chitchat assistant, and now you know instead of guess. If the reranker gains nothing, your candidate sets were already clean. The failure worth fearing is shipping all three stages because a benchmark elsewhere said so, then eating the latency on every turn of every conversation.

## A short decision guide

Same format as last time: read top to bottom, stop at the first row that fits.

| Your queries look like | Do | Why |
| --- | --- | --- |
| paraphrases of stored text | vectors alone are fine | meaning beats exact words |
| error codes, names, versions, IDs | add FTS and merge with RRF | exact tokens need exact match |
| right row fetched, wrong rows ranked above it | add a cross-encoder on the top 50 | precision is the reranker's job |
| millions of rows or strict latency | consider a dedicated engine | Postgres stops being the easy answer |

## Wrapping up

Hybrid retrieval sounds like an architecture decision and turns out to be a generated column, a GIN index, and a `FULL OUTER JOIN`. The reranker is optional, and twenty labeled queries tell you whether to keep it.

The line to hold from this one: recall is decided before the reranker ever runs. If the right row never made the candidate set, nothing downstream can put it back.
