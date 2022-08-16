import React from 'react';

import featuredPosts from '~/data/featuredPosts';
import BlogPostCard from '~/components/Cards/BlogPostCard';

export default function FeaturedPosts() {
  return (
    <div className="flex flex-col justify-center items-start max-w-4xl mx-auto w-full mb-8 text-dark-grey dark:text-beige">
      <div className="relative flex flex-col justify-between items-start content-center mb-6 md:mb-16 max-w-4xl w-full">
        <h2 className="mb-4 sm:mb-8">Featured Posts</h2>
        <div className="flex gap-6 flex-col md:flex-row">
          <BlogPostCard
            title={featuredPosts[0].title}
            url={featuredPosts[0].url}
            publishedAt={featuredPosts[0].publishedAt}
            gradient="from-[#fc00ff] via-[#3B82F6] to-[#00dbde]"
          />
          <BlogPostCard
            title={featuredPosts[1].title}
            url={featuredPosts[1].url}
            publishedAt={featuredPosts[1].publishedAt}
            gradient="from-[#0ba95b] via-[#12b5e5] to-[#004FF9]"
          />
          <BlogPostCard
            title={featuredPosts[2].title}
            url={featuredPosts[2].url}
            publishedAt={featuredPosts[2].publishedAt}
            gradient="from-[#ef489c] via-[#fcba28] to-[#fc7428]"
          />
        </div>
      </div>
    </div>
  );
}
