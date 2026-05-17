import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, getPostsByTag, getPostBySlug, savePost, deletePost, generateSlug } from '@/lib/posts';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get('tag');
  const slug = searchParams.get('slug');

  if (slug) {
    try {
      const post = getPostBySlug(slug);
      return NextResponse.json(post);
    } catch {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
  }

  if (tag) {
    const posts = getPostsByTag(tag);
    return NextResponse.json(posts);
  }

  const posts = getAllPosts();
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, date, tags, excerpt, content, slug: existingSlug } = body;

    const slug = existingSlug || generateSlug(title);

    savePost(slug, {
      title,
      date: date || new Date().toISOString().split('T')[0],
      tags: tags || [],
      excerpt: excerpt || '',
      content: content || '',
    });

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('Save post error:', error);
    return NextResponse.json({ error: 'Failed to save post', details: String(error) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    deletePost(slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
