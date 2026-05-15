import Link from 'next/link';
import { getAllTags } from '@/lib/posts';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: '标签 - Beeblog',
  description: '浏览所有文章标签',
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div className="animate-fadeIn">
      <h1 className="text-3xl font-bold text-text-primary mb-8">标签分类</h1>

      {tags.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tags.map(({ tag, count }, index) => (
            <Link
              key={tag}
              href={`/?tag=${encodeURIComponent(tag)}`}
              className={`bg-card rounded-xl p-6 hover:bg-card-hover transition-all hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 border border-slate-800 animate-fadeIn stagger-${(index % 4) + 1}`}
            >
              <span className="text-xl font-semibold text-primary block mb-2">
                {tag}
              </span>
              <span className="text-text-secondary text-sm">
                {count} 篇文章
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-text-secondary">暂无标签</p>
          <Link href="/admin" className="text-primary hover:text-primary/80 mt-4 inline-block">
            去后台发表文章并添加标签 →
          </Link>
        </div>
      )}
    </div>
  );
}
