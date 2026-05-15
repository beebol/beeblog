import { NextResponse } from 'next/server';
import { getAboutData, saveAboutData } from '@/lib/about';

export async function GET() {
  try {
    const data = getAboutData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get about data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    saveAboutData(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save about data' }, { status: 500 });
  }
}
