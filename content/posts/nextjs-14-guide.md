---
title: Next.js 14 App Router 完全指南
date: 2024-01-20
tags: [前端, Next.js, React]
excerpt: 深入了解 Next.js 14 的 App Router 架构，包括服务端组件、流式渲染等新特性。
---

# Next.js 14 App Router 完全指南

Next.js 14 带来了全新的 App Router 架构，让 React 全栈开发更加自然和强大。

## 核心概念

### 1. 服务端组件 (Server Components)

默认情况下，`app` 目录中的所有组件都是服务端组件：

```tsx
// app/page.tsx - 服务端组件
export default async function Page() {
  const posts = await getPosts();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

### 2. 客户端组件 (Client Components)

使用 `'use client'` 指令声明客户端组件：

```tsx
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}
```

### 3. 布局与页面

```
app/
├── layout.tsx      # 根布局
├── page.tsx        # 首页 (/)
├── about/
│   └── page.tsx    # 关于页 (/about)
└── blog/
    ├── page.tsx    # 博客列表 (/blog)
    └── [slug]/
        └── page.tsx  # 博客详情 (/blog/:slug)
```

## 数据获取

### 服务端数据获取

```tsx
export default async function Page() {
  // 直接在组件中获取数据
  const data = await fetch('https://api.example.com/data');
  const json = await data.json();
  
  return <main>{/* render data */}</main>;
}
```

### 使用 async/await

```tsx
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 } // 每小时重新验证
  });
  return res.json();
}
```

## 流式渲染

利用 React 的 Suspense 实现流式渲染：

```tsx
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<Loading />}>
        <AsyncComponent />
      </Suspense>
    </div>
  );
}
```

## 元数据管理

使用 `generateMetadata` 动态生成 meta 标签：

```tsx
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  return {
    title: post.title,
    description: post.excerpt,
  };
}
```

## 样式方案

Next.js 14 支持多种样式方案：

| 方案 | 特点 |
|------|------|
| CSS Modules | 组件级作用域 |
| Tailwind CSS | 原子化 CSS，快速开发 |
| CSS-in-JS | 运行时样式 |
| CSS Variables | 主题切换 |

## 总结

Next.js 14 的 App Router 代表了 React 全栈开发的未来方向：

- ✅ 更简单的数据获取
- ✅ 默认服务端渲染
- ✅ 优秀的性能
- ✅ 优雅的布局系统

希望这篇指南对你有帮助！ 🎉
