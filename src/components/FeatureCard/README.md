# FeatureCard 组件

功能模块卡片组件，用于首页快捷入口展示。

## 使用示例

```tsx
import FeatureCard from '../../components/FeatureCard'

<FeatureCard
  icon="📦"
  name="材料管理"
  desc="原材料管理"
  color="purple"
  onClick={() => navigateTo('/pages/material/index')}
/>
```

## Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| icon | string | ✅ | 图标（emoji 或文本） |
| name | string | ✅ | 模块名称 |
| desc | string | ✅ | 模块描述 |
| color | 'purple' \| 'blue' \| 'green' \| 'orange' \| 'red' \| 'yellow' \| 'pink' \| 'teal' | ✅ | 图标颜色主题 |
| onClick | () => void | ❌ | 点击事件回调 |

## 颜色主题

- `purple`: 紫色渐变 (#667eea → #764ba2)
- `blue`: 蓝色渐变 (#4facfe → #00f2fe)
- `green`: 绿色渐变 (#43e97b → #38f9d7)
- `orange`: 橙色渐变 (#fa709a → #fee140)
- `red`: 红色渐变 (#f093fb → #f5576c)
- `yellow`: 黄色渐变 (#ffecd2 → #fcb69f)
- `pink`: 粉色渐变 (#ff9a9e → #fecfef)
- `teal`: 青色渐变 (#a1c4fd → #c2e9fb)

## 样式特性

- 卡片式设计，带阴影效果
- 点击按压反馈动画
- 响应式布局（小屏幕自动适配）
- 渐变色图标背景

## 文件结构

```
src/components/FeatureCard/
├── index.tsx      # 组件实现
├── index.scss     # 样式文件
└── README.md      # 使用文档
```

