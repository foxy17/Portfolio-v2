import { ArticleJsonLd } from 'next-seo';
import { Blog } from 'contentlayer/generated';
import { baseUrl } from '~/config/constants';
import { useRouter } from 'next/router';

type BlogSeoProps = {
  blog: Blog;
};

const BlogSeo = ({ blog }: BlogSeoProps) => {
  const router = useRouter();

  return (
    <ArticleJsonLd
      type="Blog"
      url={`${baseUrl}${router.asPath}`}
      title="Blog headline"
      images={[
          blog.cover
      ]}
      datePublished={blog.publishedAt}
      authorName="Arnav Chauhan"
      description={blog.description}
      publisherLogo="/public/images/potrait-sm.webp"
    />
  );
};

export default BlogSeo;
