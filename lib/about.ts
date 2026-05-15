import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const aboutFilePath = path.join(process.cwd(), 'content', 'about.md');

export interface AboutData {
  name: string;
  title: string;
  subtitle: string;
  emoji: string;
  email: string;
  github: string;
  wechat: string;
  content: string;
}

export function getAboutData(): AboutData {
  if (!fs.existsSync(aboutFilePath)) {
    return {
      name: 'Beeblog',
      title: '关于我',
      subtitle: '全栈开发者 / 技术写作者',
      emoji: '🐝',
      email: 'hello@example.com',
      github: 'github.com/beeblog',
      wechat: '',
      content: '这里是关于页面的内容...',
    };
  }

  const fileContents = fs.readFileSync(aboutFilePath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    name: data.name || 'Beeblog',
    title: data.title || '关于我',
    subtitle: data.subtitle || '',
    emoji: data.emoji || '🐝',
    email: data.email || '',
    github: data.github || '',
    wechat: data.wechat || '',
    content,
  };
}

export function saveAboutData(data: AboutData): void {
  const fileContent = matter.stringify(data.content, {
    name: data.name,
    title: data.title,
    subtitle: data.subtitle,
    emoji: data.emoji,
    email: data.email,
    github: data.github,
    wechat: data.wechat,
  });
  fs.writeFileSync(aboutFilePath, fileContent);
}
