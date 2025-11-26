# 首页功能说明

## 页面结构

### 1. 顶部 Banner 区域
- 用户头像
- 欢迎语
- 用户昵称
- 渐变色背景

### 2. 数据统计卡片
显示三个关键指标：
- **注册用户**：系统用户总数
- **配方数量**：已创建的配方总数
- **实验记录**：实验记录总数

### 3. 功能模块（快捷入口）
8个核心功能模块，采用网格布局：

| 模块 | 图标 | 功能说明 | 路由 |
|------|------|---------|------|
| 材料管理 | 📦 | 原材料管理、库存追踪 | /pages/material/index |
| 球磨制度 | ⚙️ | 球磨工艺参数管理 | /pages/ball-milling/index |
| 配方管理 | 🧪 | 釉料配方设计、计算 | /pages/formula/index |
| 烧成制度 | 🔥 | 烧成温度曲线管理 | /pages/firing/index |
| 实验记录 | 📊 | 实验数据记录分析 | /pages/experiment/index |
| 安全管理 | 🛡️ | SDS文档、安全指南 | /pages/safety/index |
| 用户指南 | 📖 | 使用帮助、教程 | /pages/guide/index |
| 实验设计 | 🔬 | 实验方案设计 | /pages/experiment-design/index |

### 4. 最新动态
展示系统更新、公告等信息

### 5. 底部信息
- 系统名称
- 合作伙伴信息

## 功能特性

### ✅ 登录检查
- 页面加载时自动检查登录状态
- 未登录自动跳转到登录页
- 登录后显示用户信息

### ✅ 数据统计
- 实时显示统计数据
- 页面显示时自动刷新
- 数据加载错误处理

### ✅ 快捷导航
- 点击功能模块跳转对应页面
- 按压反馈动画
- 模块分类清晰

### ✅ 下拉刷新
- 支持下拉刷新数据
- 刷新统计信息

## 设计特点

### 🎨 现代化 UI
- 渐变色设计
- 卡片化布局
- 柔和的阴影
- 圆角设计

### 📱 响应式布局
- 自动适配不同屏幕
- 网格布局自适应
- 适配刘海屏

### 🎯 色彩系统
每个模块使用不同的渐变色：
- 紫色：材料管理
- 蓝色：球磨制度
- 绿色：配方管理
- 橙色：烧成制度
- 红色：实验记录
- 黄色：安全管理
- 粉色：用户指南
- 青色：实验设计

## 使用示例

### 导航到功能模块

```typescript
// 点击任意功能模块
navigateTo = (url: string) => {
  Taro.navigateTo({ url })
}
```

### 刷新数据

```typescript
// 下拉刷新
onPullDownRefresh() {
  this.loadStats().then(() => {
    Taro.stopPullDownRefresh()
  })
}
```

## 数据接口（待实现）

### 获取统计数据

```typescript
// GET /api/stats
interface StatsResponse {
  userCount: number
  formulaCount: number
  experimentCount: number
}
```

### 获取最新动态

```typescript
// GET /api/news/latest
interface NewsItem {
  id: string
  title: string
  description: string
  time: string
  icon?: string
}
```

## 自定义配置

### 修改快捷入口

在 `index.tsx` 中修改 `grid-container` 部分：

```typescript
<View className='grid-item' onClick={() => this.navigateTo('/pages/your-page/index')}>
  <View className='icon-wrapper purple'>
    <Text className='icon'>🎨</Text>
  </View>
  <Text className='item-name'>自定义模块</Text>
  <Text className='item-desc'>功能描述</Text>
</View>
```

### 修改主题色

在 `index.scss` 中修改：

```scss
// 主色调
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

// 统计数值颜色
color: #667eea;
```

## 后续扩展

### 待实现功能
- [ ] 最近使用的配方列表
- [ ] 待处理的实验提醒
- [ ] 库存预警提示
- [ ] 个人工作台
- [ ] 数据可视化图表
- [ ] 搜索功能
- [ ] 消息通知

### 优化方向
- [ ] 添加骨架屏加载
- [ ] 数据缓存策略
- [ ] 图片懒加载
- [ ] 性能优化

## 注意事项

1. **登录检查**：首页需要登录才能访问
2. **数据刷新**：使用下拉刷新更新统计数据
3. **路由配置**：确保所有跳转目标页面已在 `app.config.ts` 中配置
4. **图片资源**：用户头像需要处理默认值

## 开发建议

1. 先实现核心功能模块（材料、配方、实验）
2. 再完善辅助功能（指南、安全、动态）
3. 最后优化 UI 和交互细节

