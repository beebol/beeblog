'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      className="prose prose-invert max-w-none"
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const isInline = !match && !className;

          return !isInline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
              className="rounded-lg !bg-slate-900"
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        a({ href, children }) {
          return (
            <a
              href={href}
              className="text-primary hover:text-primary/80 transition-colors underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          );
        },
        h1: ({ children }) => (
          <h1 className="text-3xl font-bold text-text-primary mt-8 mb-4">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl font-semibold text-text-primary mt-8 mb-4">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="text-text-secondary leading-relaxed mb-4">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside text-text-secondary mb-4 space-y-2">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside text-text-secondary mb-4 space-y-2">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="text-text-secondary">{children}</li>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary pl-4 italic text-text-secondary my-4">
            {children}
          </blockquote>
        ),
        hr: () => <hr className="border-slate-700 my-8" />,
        table: ({ children }) => (
          <div className="overflow-x-auto my-4">
            <table className="min-w-full border border-slate-700 rounded-lg">{children}</table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border border-slate-700 px-4 py-2 bg-slate-800 text-text-primary">{children}</th>
        ),
        td: ({ children }) => (
          <td className="border border-slate-700 px-4 py-2 text-text-secondary">{children}</td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
