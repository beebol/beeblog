import { NextResponse } from 'next/server';
import { getAllTags } from '@/lib/posts';

export async function GET() {
  const tags = getAllTags();
  return NextResponse.json(tags);
}
