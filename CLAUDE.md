# CLAUDE.md

Guidance for Claude Code (claude.ai/code) working in this repository.
Core working principles are below. Project-specific commands, architecture, and
conventions live in @docs/project-details.md (auto-imported with this file).

## Core Principles

### 1. Think Before Coding
**Don't assume. Don't hide confusion. Surface tradeoffs.**

- State your assumptions explicitly. If uncertain, ask.
- Present multiple interpretations rather than choosing silently.
- Advocate for simpler approaches when they exist.
- Stop and name confusion instead of proceeding.

### 2. Simplicity First
**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- Avoid unrequested flexibility or error handling.
- If you write 200 lines and it could be 50, rewrite it.

### 3. Surgical Changes
**Touch only what you must. Clean up only your own mess.**

- Don't "improve" adjacent code, comments, or formatting.
- Maintain current style consistency.
- Remove only imports/functions your edits orphaned.
- Flag pre-existing dead code without deleting it.

### 4. Goal-Driven Execution
**Define success criteria. Loop until verified.**

- Frame tasks as reproducible checks before implementation.
- State a brief plan with steps and verification points.
- Strong criteria enable independent iteration; weak criteria require constant clarification.

> Source: Andrej Karpathy's CLAUDE.md — https://github.com/multica-ai/andrej-karpathy-skills

## Project Details

See @docs/project-details.md for commands, monorepo architecture, cross-app theme
sync, deployment, and conventions.
