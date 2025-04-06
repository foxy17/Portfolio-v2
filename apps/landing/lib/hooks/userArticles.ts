import { Article } from '~/lib/types';
import callServerSideAPI from '~/data/api/base';

interface DataResponse<T> {
  articles: Article[];
  error: boolean;
}

async function getArticles<T>(): Promise<DataResponse<T>> {
  const response = await callServerSideAPI(
    'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@arnav40',
  );
  const data = response ?? undefined;

  let articles: Article[] = [];
  let error = false;

  if (data) {
    const items = data.items;

    const posts = items.filter((item: any) => item.categories.length > 0);

    posts?.forEach((data: any) => {
      const { title, pubDate, link, categories } = data;

      const article: Article = {
        title,
        url: link,
        categories,
        publishedAt: pubDate,
      };
      articles.push(article);
    });
  } else {
    error = true;
  }

  return {
    articles,
    error: error,
  };
}

export default getArticles;
