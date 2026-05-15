'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        document.cookie = 'admin_auth=true; path=/';
        router.push('/admin');
      } else {
        setError('密码错误');
      }
    } catch {
      setError('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fadeIn">
      <div className="bg-card rounded-2xl p-8 w-full max-w-md border border-slate-800">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary mb-2">管理后台登录</h1>
          <p className="text-text-secondary text-sm">输入密码以访问后台管理</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-text-secondary text-sm mb-2">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入管理密码"
              className="w-full px-4 py-3 bg-background border border-slate-700 rounded-lg text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          {error && (
            <p className="text-accent text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-background font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        <p className="text-center mt-6 text-text-secondary text-sm">
          <Link href="/" className="text-primary hover:text-primary/80">
            ← 返回首页
          </Link>
        </p>
      </div>
    </div>
  );
}
