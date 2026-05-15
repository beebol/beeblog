---
title: React 最佳实践与性能优化
date: 2024-01-25
tags: [前端, React, 性能优化]
excerpt: 总结 React 开发中的最佳实践，包括 Hooks 使用、性能优化技巧和常见问题解决方案。
---

# React 最佳实践与性能优化

React 是目前最流行的前端框架之一，但写出高质量的 React 代码需要遵循一些最佳实践。

## 1. Hooks 最佳实践

### useState 的正确使用

```tsx
// ❌ 不推荐：每次渲染都创建新对象
const [state, setState] = useState({ count: 0 });
setState({ count: state.count + 1 });

// ✅ 推荐：使用函数式更新
const [state, setState] = useState({ count: 0 });
setState(prev => ({ count: prev.count + 1 }));
```

### useEffect 依赖管理

```tsx
// ❌ 常见错误：遗漏依赖或包含不必要的依赖
useEffect(() => {
  fetchData(id);
}, []); // id 缺失！

// ✅ 正确做法
useEffect(() => {
  fetchData(id);
}, [id]);

// 或者使用 useCallback 包装
const fetchData = useCallback(async () => {
  const data = await api.getData(id);
  setData(data);
}, [id]);

useEffect(() => {
  fetchData();
}, [fetchData]);
```

## 2. 性能优化技巧

### React.memo 避免不必要的渲染

```tsx
const ExpensiveComponent = React.memo(function ExpensiveComponent({ data }) {
  // 仅当 data 变化时重新渲染
  return <div>{/* expensive rendering */}</div>;
});
```

### useMemo 和 useCallback

```tsx
function Component({ items, filter }) {
  // 缓存计算结果
  const filteredItems = useMemo(
    () => items.filter(item => item.type === filter),
    [items, filter]
  );

  // 缓存回调函数
  const handleClick = useCallback(
    (id) => console.log(id),
    []
  );

  return filteredItems.map(item => (
    <Item key={item.id} item={item} onClick={handleClick} />
  ));
}
```

### 虚拟列表

对于长列表渲染，使用虚拟化：

```tsx
import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
  return (
    <FixedSizeList
      height={400}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>{items[index].name}</div>
      )}
    </FixedSizeList>
  );
}
```

## 3. 代码组织结构

```
src/
├── components/      # 可复用组件
│   ├── ui/          # 基础 UI 组件
│   └── features/    # 功能组件
├── hooks/           # 自定义 Hooks
├── utils/           # 工具函数
├── pages/           # 页面组件
├── services/        # API 服务
└── types/           # TypeScript 类型
```

## 4. TypeScript 配合 React

定义组件 Props 类型：

```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({ 
  variant, 
  size, 
  children, 
  onClick,
  disabled 
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

## 5. 状态管理建议

| 场景 | 推荐方案 |
|------|----------|
| 组件本地状态 | useState |
| 跨组件共享 | Context |
| 表单状态 | React Hook Form |
| 服务端状态 | TanStack Query |
| 全局状态 | Zustand / Redux Toolkit |

## 6. 常见错误避免

1. **不要在渲染期间调用 setState** - 这会导致无限循环
2. **使用 key 而不是索引** - 列表渲染时 key 应稳定唯一
3. **组件名大写开头** - JSX 中组件必须大写
4. **使用 Fragment 避免多余 DOM** - `<>...</>` 或 `<Fragment>`

## 结语

掌握这些最佳实践，写出高质量的 React 代码就不再困难。记住：

> Write less, think more, render efficiently.

Happy coding! 🚀
