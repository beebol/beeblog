import Link from 'next/link';
import { getAboutData } from '@/lib/about';
import MarkdownRenderer from '@/components/MarkdownRenderer';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: '关于 - Beeblog',
  description: '了解博主和博客的故事',
};

export default function AboutPage() {
  const about = getAboutData();

  const techStack = about.content
    .split('\n')
    .find((line) => line.includes('技术栈'))?.split('：')[1]?.split(',').map((t) => t.trim()) || [];

  return (
    <div className="animate-fadeIn max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-text-primary mb-8">{about.title}</h1>

      <div className="space-y-6">
        <section className="bg-card rounded-xl p-8 border border-slate-800">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl">
              {about.emoji}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary">{about.name}</h2>
              <p className="text-text-secondary">{about.subtitle}</p>
            </div>
          </div>

          <div className="markdown-content">
            <MarkdownRenderer content={about.content} />
          </div>
        </section>

        {techStack.length > 0 && (
          <section className="bg-card rounded-xl p-8 border border-slate-800">
            <h3 className="text-xl font-semibold text-text-primary mb-4">技术栈</h3>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="bg-card rounded-xl p-8 border border-slate-800">
          <h3 className="text-xl font-semibold text-text-primary mb-4">联系方式</h3>
          <div className="space-y-3">
            {about.email && (
              <p className="text-text-secondary">
                📧 Email: {about.email}
              </p>
            )}
            {about.github && (
              <p className="text-text-secondary">
                🐙 GitHub: {about.github}
              </p>
            )}
            {about.twitter && (
              <p className="text-text-secondary">
                🐦 Twitter: {about.twitter}
              </p>
            )}
          </div>
        </section>

        <section className="text-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            ← 返回首页，开始阅读
          </Link>
        </section>
      </div>
    </div>
  );
}
