import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostHero from "@/components/blog/PostHero";
import PostBody from "@/components/blog/PostBody";
import PostFooter from "@/components/blog/PostFooter";
import FreeKitCta from "@/components/designs-colours/FreeKitCta";
import {
  BLOG_POSTS,
  getPost,
  postBody,
  readMinutes,
  relatedPosts,
} from "@/lib/blog";

/** Nine posts, all known at build time */
export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) return { title: "Post not found | OnDek Vinyl Decking" };

  return {
    title: `${post.title} | OnDek Vinyl Decking`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  const blocks = postBody(slug);

  if (!post || blocks.length === 0) notFound();

  return (
    <>
      <PostHero post={post} minutes={readMinutes(slug)} />
      <PostBody blocks={blocks} source={post.href} />
      <PostFooter posts={relatedPosts(slug)} />
      <FreeKitCta />
    </>
  );
}
