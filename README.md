# Beeblog - 个人博客系统

一个基于 Next.js 14 的现代化个人博客系统，支持 Markdown 渲染和完整的后台管理功能。

## 功能特性

### 前台展示
- **首页文章列表** - 展示所有文章卡片，支持按标签筛选
- **文章详情页** - 完整 Markdown 渲染，支持代码高亮
- **标签分类页** - 展示所有标签及其文章数量
- **关于页面** - 个人介绍和联系方式

### 后台管理
- **登录验证** - 简单的密码保护后台
- **文章管理** - 新建、编辑、删除文章
- **Markdown 编辑** - 支持 Markdown 格式文章编写

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 3. 访问后台管理

访问 http://localhost:3000/admin

默认密码：`admin123`

> 💡 修改密码：设置环境变量 `ADMIN_PASSWORD`

## 技术栈

- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **Markdown**: react-markdown + remark-gfm
- **代码高亮**: react-syntax-highlighter
- **日期处理**: date-fns

## 项目结构

```
beeblog/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 首页
│   ├── post/[slug]/       # 文章详情
│   ├── tags/              # 标签页
│   ├── about/             # 关于页
│   ├── admin/             # 后台管理
│   ├── login/             # 登录页
│   └── api/               # API 路由
├── components/            # React 组件
├── lib/                   # 工具函数
├── content/posts/         # Markdown 文章存储
└── public/                # 静态资源
```

## 文章格式

在 `content/posts/` 目录下创建 `.md` 文件：

```markdown
---
title: 文章标题
date: 2024-01-01
tags: [标签1, 标签2]
excerpt: 文章摘要
---

# Markdown 内容

这里是正文内容...
```

## 环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| ADMIN_PASSWORD | admin123 | 后台管理密码 |

## 部署

### Vercel 部署

```bash
npm run build
```

在 Vercel 上导入项目即可部署。

> ⚠️ 注意：Vercel 部署为只读环境，不支持文章写入操作。
> 如需动态发布文章，请使用支持文件写入的托管服务。

### 其他部署方式

- Docker 部署
- 传统服务器部署
- 支持 Node.js 的任何平台

## License

MIT
