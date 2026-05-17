'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import PostCard from '@/components/PostCard';

interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
}

interface Tag {
  tag: string;
  count: number;
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(8);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const tag = searchParams?.get('tag');
    if (tag) {
      setSelectedTag(tag);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchPosts();
    fetchTags();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const res = await fetch('/api/tags');
      const data = await res.json();
      setTags(data);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  };

  const filteredPosts = selectedTag
    ? posts.filter((post) => post.tags.includes(selectedTag))
    : posts;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 8);
  };

  // 监听滚动加载更多
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
        displayCount < filteredPosts.length &&
        !loadingMore
      ) {
        setLoadingMore(true);
        setTimeout(() => {
          setDisplayCount((prev) => prev + 8);
          setLoadingMore(false);
        }, 300);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [displayCount, filteredPosts.length, loadingMore]);

  return (
    <div className="space-y-8 animate-fadeIn">
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
          欢迎来到 <span className="text-primary">Beeblog</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-6">
          分享技术心得，记录生活点滴。在这里，每一个想法都值得被记录。
        </p>
        <form onSubmit={handleSearch} className="max-w-md mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索文章..."
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
      </section>

      {tags.length > 0 && (
        <section className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              !selectedTag
                ? 'bg-primary text-background'
                : 'bg-card text-text-secondary hover:bg-card-hover'
            }`}
          >
            全部
          </button>
          {tags.map(({ tag }) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                tag === selectedTag
                  ? 'bg-primary text-background'
                  : 'bg-card text-text-secondary hover:bg-card-hover'
              }`}
            >
              {tag}
            </button>
          ))}
        </section>
      )}

      <section className="grid gap-6 md:grid-cols-2">
        {loading ? (
          <div className="col-span-2 text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredPosts.length > 0 ? (
          <>
            {filteredPosts.slice(0, displayCount).map((post, index) => (
              <div key={post.slug} className={`animate-fadeIn stagger-${(index % 4) + 1}`}>
                <PostCard post={post} />
              </div>
            ))}
            {displayCount < filteredPosts.length && (
              <div className="col-span-2 text-center py-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-card text-text-primary font-medium rounded-lg hover:bg-card-hover transition-colors disabled:opacity-50"
                >
                  {loadingMore ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                      加载中...
                    </span>
                  ) : (
                    `加载更多 (还有 ${filteredPosts.length - displayCount} 篇)`
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="col-span-2 text-center py-12">
            <p className="text-text-secondary">暂无文章</p>
            <Link href="/admin" className="text-primary hover:text-primary/80 mt-4 inline-block">
              去后台发表第一篇文章 →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
