import {useMDXComponent} from 'next-contentlayer/hooks';
import {allBlogs} from 'contentlayer/generated';
import type {Blog} from 'contentlayer/generated';
import BlogLayout from '~/components/Blog';
import NavContainer from '~/components/Layout/NavContainer';
import BlogSeo from "~/components/SEO/BlogSeo";

type BlogProps = {
    blog: Blog;
};

export default function Blog({blog}: BlogProps) {
    const Component = useMDXComponent(blog.body.code);

    return (
        <NavContainer
            date={blog.publishedAt}
            title={`${blog.title} – Arnav Chauhan`}
            description={blog.description}
            openGraph={{
                type: 'article',
                title: `${blog.title} – Arnav Chauhan`,
                description: blog.description,
            }}
        >
            <BlogSeo blog={blog}/>
            <BlogLayout {...blog}>
                <Component/>
            </BlogLayout>
        </NavContainer>
    );
}

export async function getStaticPaths() {
    return {
        paths: allBlogs.map((blog) => ({params: {slug: blog.slug}})),
        fallback: false,
    };
}

export async function getStaticProps({params}) {
    const blog = allBlogs.find((blog) => blog.slug === params.slug);
    return {props: {blog}};
}
