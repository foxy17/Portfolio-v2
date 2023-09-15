import Head from 'next/head';
import BlogListCard from 'components/Cards/BlogListCard';
import { allBlogs } from 'contentlayer/generated';
import { select } from 'lib/select';

export default function Home({ articles }) {
  console.log(articles);
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {articles.map(
          ({
            title,
            description,
            slug,
            cover,
            category,
            publishedAt,
            readingTime,
            author,
          }) => (
            <BlogListCard
              key={slug}
              title={title}
              description={description}
              slug={slug}
              image={cover}
              category={category}
              dateTime={publishedAt}
              readingTime={readingTime.text}
            />
          ),
        )}
      </main>
    </div>
  );
}

export function getStaticProps() {
  const articles = allBlogs
    .map((article) =>
      select(article, [
        'slug',
        'title',
        'description',
        'publishedAt',
        'readingTime',
        'author',
        'category',
        'cover',
      ]),
    )
    .sort(
      (a, b) =>
        Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt)),
    );

  return { props: { articles } };
}
