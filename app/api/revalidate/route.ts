import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json();
    
    // 清除文章页缓存
    if (slug) {
      revalidatePath(`/post/${slug}`);
    }
    
    // 清除首页缓存（文章列表）
    revalidatePath('/');
    
    return NextResponse.json({ revalidated: true, slug });
  } catch (error) {
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 });
  }
}
