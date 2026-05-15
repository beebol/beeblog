'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import PostCard from '@/components/PostCard';

interface SearchResult {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  matchedIn: string[];
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams?.get('q') || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const q = searchParams?.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setResults(data.results);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="animate-fadeIn">
      <h1 className="text-3xl font-bold text-text-primary mb-8">搜索</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索文章标题、内容..."
            className="flex-1 px-4 py-3 bg-card border border-slate-700 rounded-lg text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary transition-colors"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-primary text-background font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            搜索
          </button>
        </div>
      </form>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {!loading && searched && (
        <div className="mb-6">
          <p className="text-text-secondary">
            找到 <span className="text-primary font-semibold">{results.length}</span> 篇相关文章
            {query && <span>（搜索："{query}"）</span>}
          </p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {results.map((post, index) => (
            <div key={post.slug} className={`animate-fadeIn stagger-${(index % 4) + 1}`}>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="text-center py-12 bg-card rounded-xl border border-slate-800">
          <p className="text-text-secondary mb-4">未找到相关文章</p>
          <p className="text-text-secondary/50 text-sm">
            尝试其他关键词，或浏览全部文章
          </p>
          <Link href="/" className="text-primary hover:text-primary/80 mt-4 inline-block">
            ← 返回首页
          </Link>
        </div>
      )}

      {!loading && !searched && (
        <div className="text-center py-12 text-text-secondary/50">
          <p>输入关键词搜索文章</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="animate-fadeIn">
        <h1 className="text-3xl font-bold text-text-primary mb-8">搜索</h1>
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
