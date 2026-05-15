import Link from 'next/link';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface PostCardProps {
  post: {
    slug: string;
    title: string;
    date: string;
    tags: string[];
    excerpt: string;
  };
}

export default function PostCard({ post }: PostCardProps) {
  const formattedDate = post.date
    ? format(new Date(post.date), 'yyyy年MM月dd日', { locale: zhCN })
    : '';

  return (
    <Link href={`/post/${post.slug}`}>
      <article className="bg-card rounded-xl p-6 hover:bg-card-hover transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 border border-slate-800">
        <h2 className="text-xl font-semibold text-text-primary mb-3 hover:text-primary transition-colors">
          {post.title}
        </h2>
        <p className="text-text-secondary text-sm mb-4 line-clamp-2">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
          <time className="text-text-secondary text-xs">
            {formattedDate}
          </time>
        </div>
      </article>
    </Link>
  );
}
