import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, getPostBySlug } from '@/lib/posts';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim();

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const posts = getAllPosts();
  const results: Array<{
    slug: string;
    title: string;
    date: string;
    tags: string[];
    excerpt: string;
    matchedIn: string[];
  }> = [];

  const lowerQuery = query.toLowerCase();

  for (const post of posts) {
    const matchedIn: string[] = [];

    if (post.title.toLowerCase().includes(lowerQuery)) {
      matchedIn.push('标题');
    }
    if (post.excerpt.toLowerCase().includes(lowerQuery)) {
      matchedIn.push('摘要');
    }

    if (matchedIn.length === 0) {
      try {
        const fullPost = getPostBySlug(post.slug);
        if (fullPost.content.toLowerCase().includes(lowerQuery)) {
          matchedIn.push('内容');
        }
      } catch {
        continue;
      }
    }

    if (matchedIn.length > 0) {
      results.push({
        slug: post.slug,
        title: post.title,
        date: post.date,
        tags: post.tags,
        excerpt: post.excerpt,
        matchedIn,
      });
    }
  }

  return NextResponse.json({ results, query });
}
