import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { getAllPosts, getPostBySlug } from '@/lib/posts';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  try {
    const post = getPostBySlug(slug);
    return {
      title: `${post.title} - Beeblog`,
      description: post.excerpt,
    };
  } catch {
    return {
      title: '文章未找到 - Beeblog',
    };
  }
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  
  let post;
  try {
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }

  const formattedDate = post.date
    ? format(new Date(post.date), 'yyyy年MM月dd日', { locale: zhCN })
    : '';

  return (
    <article className="animate-fadeIn">
      <Link
        href="/"
        className="inline-flex items-center text-text-secondary hover:text-primary transition-colors mb-8"
      >
        ← 返回首页
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-text-secondary text-sm">
          <time>{formattedDate}</time>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/?tag=${encodeURIComponent(tag)}`}
                  className="px-2 py-1 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="border-t border-b border-slate-800 py-8 my-8">
        <MarkdownRenderer content={post.content} />
      </div>

      <div className="flex justify-between items-center pt-8">
        <Link
          href="/"
          className="px-6 py-3 bg-card text-text-primary rounded-lg hover:bg-card-hover transition-colors"
        >
          ← 返回文章列表
        </Link>
      </div>
    </article>
  );
}
