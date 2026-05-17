'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';

interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
}

interface AboutData {
  name: string;
  title: string;
  subtitle: string;
  emoji: string;
  email: string;
  github: string;
  wechat: string;
  content: string;
}

type EditMode = 'list' | 'post' | 'about';

export default function AdminPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState<EditMode>('list');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [filterTag, setFilterTag] = useState<string>('');
  const [allTags, setAllTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // About editing states
  const [aboutName, setAboutName] = useState('');
  const [aboutTitle, setAboutTitle] = useState('');
  const [aboutSubtitle, setAboutSubtitle] = useState('');
  const [aboutEmoji, setAboutEmoji] = useState('');
  const [aboutEmail, setAboutEmail] = useState('');
  const [aboutGithub, setAboutGithub] = useState('');
  const [aboutWechat, setAboutWechat] = useState('');
  const [aboutContent, setAboutContent] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkAuth();
    fetchPosts();
  }, []);

  const checkAuth = async () => {
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    if (!cookies['admin_auth']) {
      router.push('/login');
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data);
      // 提取所有唯一标签
      const tags = [...new Set(data.flatMap((post: Post) => post.tags))].sort() as string[];
      setAllTags(tags);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAbout = async () => {
    try {
      const res = await fetch('/api/about');
      const data = await res.json();
      setAboutName(data.name || '');
      setAboutTitle(data.title || '');
      setAboutSubtitle(data.subtitle || '');
      setAboutEmoji(data.emoji || '');
      setAboutEmail(data.email || '');
      setAboutGithub(data.github || '');
      setAboutWechat(data.wechat || '');
      setAboutContent(data.content || '');
    } catch (error) {
      console.error('Failed to fetch about:', error);
    }
  };

  const handleLogout = () => {
    document.cookie = 'admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/');
  };

  const openEditor = (post?: Post) => {
    if (post) {
      setEditingPost(post);
      setTitle(post.title);
      setTags(post.tags.join(', '));
      setExcerpt(post.excerpt);
      setContent('');
      fetchPostContent(post.slug);
    } else {
      setEditingPost(null);
      setTitle('');
      setContent('');
      setTags('');
      setExcerpt('');
    }
    setEditMode('post');
  };

  const openAboutEditor = () => {
    fetchAbout();
    setEditMode('about');
  };

  const fetchPostContent = async (slug: string) => {
    try {
      const res = await fetch(`/api/posts?slug=${slug}`);
      const data = await res.json();
      if (data.content) {
        setContent(data.content);
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
    }
  };

  const handleSavePost = async () => {
    setSaving(true);
    try {
      const postData = {
        title,
        date: editingPost?.date || new Date().toISOString().slice(0, 19),
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        excerpt,
        content,
        slug: editingPost?.slug,
      };

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (res.ok) {
        // 立即清除缓存
        try {
          await fetch('/api/revalidate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug: editingPost?.slug }),
          });
        } catch (e) {
          console.error('Cache revalidation failed:', e);
        }
        
        setEditMode('list');
        fetchPosts();
      } else {
        alert('保存失败');
      }
    } catch (error) {
      console.error('Failed to save:', error);
      alert('保存失败');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAbout = async () => {
    setSaving(true);
    try {
      const aboutData = {
        name: aboutName,
        title: aboutTitle,
        subtitle: aboutSubtitle,
        emoji: aboutEmoji,
        email: aboutEmail,
        github: aboutGithub,
        wechat: aboutWechat,
        content: aboutContent,
      };

      const res = await fetch('/api/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aboutData),
      });

      if (res.ok) {
        alert('保存成功！');
        setEditMode('list');
      } else {
        alert('保存失败');
      }
    } catch (error) {
      console.error('Failed to save about:', error);
      alert('保存失败');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return;

    setDeletingSlug(slug);
    try {
      const res = await fetch(`/api/posts?slug=${slug}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchPosts();
      } else {
        alert('删除失败');
      }
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('删除失败');
    } finally {
      setDeletingSlug(null);
    }
  };

  const uploadImage = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const { url } = await res.json();
        const imageMarkdown = `![${file.name}](${url})`;
        const currentContent = editMode === 'about' ? aboutContent : content;

        if (textareaRef.current) {
          const textarea = textareaRef.current;
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const newContent = currentContent.slice(0, start) + imageMarkdown + currentContent.slice(end);
          
          if (editMode === 'about') {
            setAboutContent(newContent);
          } else {
            setContent(newContent);
          }

          setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + imageMarkdown.length, start + imageMarkdown.length);
          }, 0);
        } else {
          if (editMode === 'about') {
            setAboutContent(prev => prev + '\n' + imageMarkdown);
          } else {
            setContent(prev => prev + '\n' + imageMarkdown);
          }
        }
      } else {
        alert('图片上传失败');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('图片上传失败');
    } finally {
      setUploading(false);
    }
  }, [content, aboutContent, editMode]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          uploadImage(file);
        }
        break;
      }
    }
  }, [uploadImage]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        e.preventDefault();
        uploadImage(file);
        break;
      }
    }
  }, [uploadImage]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      for (const file of files) {
        uploadImage(file);
      }
    }
    e.target.value = '';
  };

  const insertImage = () => {
    fileInputRef.current?.click();
  };

  // List view
  if (editMode === 'list') {
    return (
      <div className="animate-fadeIn">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-text-primary">后台管理</h1>
          <div className="flex gap-4">
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-card text-text-secondary rounded-lg hover:bg-card-hover transition-colors"
            >
              退出登录
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <div className="bg-card rounded-xl p-6 border border-slate-800">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl">📝</span>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">文章管理</h2>
                <p className="text-text-secondary text-sm">{posts.length} 篇文章</p>
              </div>
            </div>
            <button
              onClick={() => openEditor()}
              className="w-full py-3 bg-primary text-background font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              新建文章
            </button>
          </div>

          <div className="bg-card rounded-xl p-6 border border-slate-800">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl">👤</span>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">关于页面</h2>
                <p className="text-text-secondary text-sm">编辑个人信息</p>
              </div>
            </div>
            <button
              onClick={openAboutEditor}
              className="w-full py-3 bg-primary text-background font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              编辑关于
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-text-primary">文章列表</h2>
          <div className="flex items-center gap-2">
            <label className="text-text-secondary text-sm">标签筛选：</label>
            <select
              value={filterTag}
              onChange={(e) => { setFilterTag(e.target.value); setCurrentPage(1); }}
              className="px-3 py-1.5 bg-background border border-slate-700 rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary transition-colors"
            >
              <option value="">全部</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
            {filterTag && (
              <button
                onClick={() => { setFilterTag(''); setCurrentPage(1); }}
                className="px-2 py-1 text-xs text-accent hover:bg-accent/10 rounded transition-colors"
              >
                清除
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl border border-slate-800">
            <p className="text-text-secondary mb-4">暂无文章</p>
            <button
              onClick={() => openEditor()}
              className="px-6 py-3 bg-primary text-background font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              创建第一篇文章
            </button>
          </div>
        ) : (
          <PostList posts={posts} filterTag={filterTag} deletingSlug={deletingSlug} onEdit={openEditor} onDelete={handleDelete} onClearFilter={() => { setFilterTag(''); setCurrentPage(1); }} currentPage={currentPage} pageSize={pageSize} onPageChange={setCurrentPage} />
        )}
      </div>
    );
  }

  // Post editor view
  if (editMode === 'post') {
    return (
      <div className="animate-fadeIn">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-text-primary">
            {editingPost ? '编辑文章' : '新建文章'}
          </h1>
          <button
            onClick={() => setEditMode('list')}
            className="px-6 py-3 bg-card text-text-secondary rounded-lg hover:bg-card-hover transition-colors"
          >
            返回
          </button>
        </div>

        <div className="bg-card rounded-xl p-6 border border-slate-800 space-y-6">
          <div>
            <label className="block text-text-secondary text-sm mb-2">标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入文章标题"
              className="w-full px-4 py-3 bg-background border border-slate-700 rounded-lg text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-text-secondary text-sm mb-2">标签（用逗号分隔）</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="前端, React, TypeScript"
              className="w-full px-4 py-3 bg-background border border-slate-700 rounded-lg text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-text-secondary text-sm mb-2">摘要</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="输入文章摘要"
              rows={2}
              className="w-full px-4 py-3 bg-background border border-slate-700 rounded-lg text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-text-secondary text-sm">内容（Markdown）</label>
              <button
                type="button"
                onClick={insertImage}
                disabled={uploading}
                className="px-3 py-1.5 text-xs bg-card border border-slate-700 text-text-secondary rounded hover:bg-card-hover hover:text-primary transition-colors flex items-center gap-1"
              >
                {uploading ? (
                  <>
                    <span className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                    上传中...
                  </>
                ) : (
                  <>
                    <span>📷</span>
                    添加图片
                  </>
                )}
              </button>
            </div>
            <div onPaste={handlePaste} onDrop={handleDrop} onDragOver={handleDragOver}>
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onPaste={handlePaste}
                placeholder="使用 Markdown 编写文章内容，支持粘贴截图或拖拽图片..."
                rows={20}
                className="w-full px-4 py-3 bg-background border border-slate-700 rounded-lg text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary transition-colors font-mono text-sm resize-none"
              />
            </div>
            <p className="text-text-secondary/50 text-xs mt-1">
              💡 提示：直接粘贴截图、或拖拽图片到编辑器即可上传
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          <button
            onClick={handleSavePost}
            disabled={saving || !title || !content}
            className="w-full py-3 bg-primary text-background font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存文章'}
          </button>
        </div>
      </div>
    );
  }

  // About editor view
  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-text-primary">编辑关于页面</h1>
        <button
          onClick={() => setEditMode('list')}
          className="px-6 py-3 bg-card text-text-secondary rounded-lg hover:bg-card-hover transition-colors"
        >
          返回
        </button>
      </div>

      <div className="bg-card rounded-xl p-6 border border-slate-800 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-text-secondary text-sm mb-2">名称</label>
            <input
              type="text"
              value={aboutName}
              onChange={(e) => setAboutName(e.target.value)}
              placeholder="博主名称"
              className="w-full px-4 py-3 bg-background border border-slate-700 rounded-lg text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-text-secondary text-sm mb-2">页面标题</label>
            <input
              type="text"
              value={aboutTitle}
              onChange={(e) => setAboutTitle(e.target.value)}
              placeholder="关于我"
              className="w-full px-4 py-3 bg-background border border-slate-700 rounded-lg text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-text-secondary text-sm mb-2">副标题</label>
            <input
              type="text"
              value={aboutSubtitle}
              onChange={(e) => setAboutSubtitle(e.target.value)}
              placeholder="全栈开发者 / 技术写作者"
              className="w-full px-4 py-3 bg-background border border-slate-700 rounded-lg text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-text-secondary text-sm mb-2">头像 Emoji</label>
            <input
              type="text"
              value={aboutEmoji}
              onChange={(e) => setAboutEmoji(e.target.value)}
              placeholder="🐝"
              className="w-full px-4 py-3 bg-background border border-slate-700 rounded-lg text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <label className="block text-text-secondary text-sm mb-2">邮箱</label>
            <input
              type="email"
              value={aboutEmail}
              onChange={(e) => setAboutEmail(e.target.value)}
              placeholder="hello@example.com"
              className="w-full px-4 py-3 bg-background border border-slate-700 rounded-lg text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-text-secondary text-sm mb-2">GitHub</label>
            <input
              type="text"
              value={aboutGithub}
              onChange={(e) => setAboutGithub(e.target.value)}
              placeholder="github.com/username"
              className="w-full px-4 py-3 bg-background border border-slate-700 rounded-lg text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-text-secondary text-sm mb-2">微信号</label>
            <input
              type="text"
              value={aboutWechat}
              onChange={(e) => setAboutWechat(e.target.value)}
              placeholder="请输入微信号"
              className="w-full px-4 py-3 bg-background border border-slate-700 rounded-lg text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-text-secondary text-sm">正文内容（Markdown）</label>
            <button
              type="button"
              onClick={insertImage}
              disabled={uploading}
              className="px-3 py-1.5 text-xs bg-card border border-slate-700 text-text-secondary rounded hover:bg-card-hover hover:text-primary transition-colors flex items-center gap-1"
            >
              {uploading ? (
                <>
                  <span className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                  上传中...
                </>
              ) : (
                <>
                  <span>📷</span>
                  添加图片
                </>
              )}
            </button>
          </div>
          <div onPaste={handlePaste} onDrop={handleDrop} onDragOver={handleDragOver}>
            <textarea
              ref={textareaRef}
              value={aboutContent}
              onChange={(e) => setAboutContent(e.target.value)}
              onPaste={handlePaste}
              placeholder="关于页面的正文内容..."
              rows={15}
              className="w-full px-4 py-3 bg-background border border-slate-700 rounded-lg text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary transition-colors font-mono text-sm resize-none"
            />
          </div>
          <p className="text-text-secondary/50 text-xs mt-1">
            💡 提示：直接粘贴截图、或拖拽图片到编辑器即可上传
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <button
          onClick={handleSaveAbout}
          disabled={saving}
          className="w-full py-3 bg-primary text-background font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {saving ? '保存中...' : '保存关于页面'}
        </button>
      </div>
    </div>
  );
}

// 文章列表组件
function PostList({ posts, filterTag, deletingSlug, onEdit, onDelete, onClearFilter, currentPage, pageSize, onPageChange }: {
  posts: Post[];
  filterTag: string;
  deletingSlug: string | null;
  onEdit: (post: Post) => void;
  onDelete: (slug: string) => void;
  onClearFilter: () => void;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  const filteredPosts = filterTag ? posts.filter((post) => post.tags.includes(filterTag)) : posts;
  const totalPages = Math.ceil(filteredPosts.length / pageSize);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (filteredPosts.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-xl border border-slate-800">
        <p className="text-text-secondary mb-4">暂无符合条件的文章</p>
        <button
          onClick={onClearFilter}
          className="px-6 py-3 bg-primary text-background font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          清除筛选
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-slate-800 overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-800/50">
          <tr>
            <th className="text-left px-6 py-4 text-text-secondary text-sm font-medium">标题</th>
            <th className="text-left px-6 py-4 text-text-secondary text-sm font-medium">标签</th>
            <th className="text-left px-6 py-4 text-text-secondary text-sm font-medium">日期</th>
            <th className="text-right px-6 py-4 text-text-secondary text-sm font-medium">操作</th>
          </tr>
        </thead>
        <tbody>
          {paginatedPosts.map((post) => (
            <tr key={post.slug} className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors">
              <td className="px-6 py-4">
                <Link href={`/post/${post.slug}`} target="_blank" className="text-text-primary hover:text-primary transition-colors">
                  {post.title}
                </Link>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {post.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 text-text-secondary text-sm">
                {post.date ? format(new Date(post.date), 'yyyy-MM-dd') : '-'}
              </td>
              <td className="px-6 py-4 text-right">
                <a
                  href={`/post/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 text-sm text-green-400 hover:bg-green-400/10 rounded transition-colors mr-2"
                >
                  浏览
                </a>
                <button
                  onClick={() => onEdit(post)}
                  className="px-3 py-1 text-sm text-primary hover:bg-primary/10 rounded transition-colors mr-2"
                >
                  编辑
                </button>
                <button
                  onClick={() => onDelete(post.slug)}
                  disabled={deletingSlug === post.slug}
                  className="px-3 py-1 text-sm text-accent hover:bg-accent/10 rounded transition-colors disabled:opacity-50"
                >
                  {deletingSlug === post.slug ? '删除中...' : '删除'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filterTag && (
        <div className="px-6 py-3 bg-slate-800/30 border-t border-slate-800 text-text-secondary text-sm">
          共 {filteredPosts.length} 篇含「{filterTag}」标签的文章
        </div>
      )}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-text-secondary text-sm">
            第 {currentPage} / {totalPages} 页，共 {filteredPosts.length} 篇文章
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm bg-slate-800 text-text-secondary rounded hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              上一页
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm bg-slate-800 text-text-secondary rounded hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
