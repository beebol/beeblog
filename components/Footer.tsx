import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 mt-20">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-secondary text-sm">
            © {new Date().getFullYear()} Beeblog. 用 Next.js 构建
          </p>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-text-secondary text-sm hover:text-primary transition-colors">
              首页
            </Link>
            <Link href="/tags" className="text-text-secondary text-sm hover:text-primary transition-colors">
              标签
            </Link>
            <Link href="/about" className="text-text-secondary text-sm hover:text-primary transition-colors">
              关于
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
