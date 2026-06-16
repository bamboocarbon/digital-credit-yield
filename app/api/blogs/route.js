import { NextResponse } from 'next/server';
import { articles } from '@/lib/articles';

export const revalidate = 0;

export async function GET() {
  const list = articles.map(a => ({
    slug: a.slug,
    title: a.title,
    date: a.date,
    excerpt: a.excerpt,
    category: a.category,
  }));
  return NextResponse.json(list);
}
