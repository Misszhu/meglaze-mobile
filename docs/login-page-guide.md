# 登录页面使用指南

## 功能特性

### ✅ 支持的登录方式

1. **微信登录**（小程序环境 / H5 微信浏览器中）
   - 一键快速登录
   - 自动获取用户信息（需授权）
   - 无需输入账号密码

2. **邮箱登录**（所有环境）
   - 支持邮箱密码登录
   - 实时表单验证
   - 密码显示/隐藏切换

### ✅ 智能平台适配

- **小程序环境**：优先显示微信登录
- **H5 微信浏览器**：显示微信登录 + 邮箱登录
- **H5 普通浏览器**：只显示邮箱登录

### ✅ 用户体验

- 现代化 UI 设计
- 渐变色背景
- 流畅的动画效果
- 加载状态提示
- 错误提示
- 响应式布局

## 文件结构

```
src/pages/login/
├── index.tsx         # 登录页面组件
├── index.scss        # 登录页面样式
└── index.config.ts   # 页面配置
```

## 使用说明

### 1. 访问登录页

```typescript
// 跳转到登录页
Taro.navigateTo({
  url: '/pages/login/index'
})

// 或者重定向（清空历史栈）
Taro.redirectTo({
  url: '/pages/login/index'
})
```

### 2. 登录成功后

登录成功后会自动：
1. 保存 token 到本地存储
2. 保存用户信息到 Redux
3. 显示成功提示
4. 跳转到首页

```typescript
// 登录成功后跳转
setTimeout(() => {
  Taro.switchTab({ url: '/pages/index/index' })
}, 1500)
```

### 3. 检查登录状态

在需要登录的页面，使用 `requireLogin` 检查：

```typescript
import { requireLogin } from '@/utils/auth'

componentDidMount() {
  // 检查登录状态
  requireLogin().then(isLoggedIn => {
    if (!isLoggedIn) {
      // 未登录，已自动跳转到登录页
      return
    }
    // 已登录，继续执行
    this.fetchData()
  })
}
```

## 组件说明

### Props

```typescript
interface LoginPageProps {
  loading: boolean              // 登录加载状态（来自 Redux）
  error: string | null          // 错误信息（来自 Redux）
  wxLogin: () => Promise<any>   // 微信登录方法
  emailLogin: (email: string, password: string) => Promise<any>  // 邮箱登录方法
}
```

### State

```typescript
interface LoginPageState {
  loginType: 'wx' | 'email'  // 当前登录方式
  email: string              // 邮箱
  password: string           // 密码
  showPassword: boolean      // 是否显示密码
}
```

## 表单验证

### 邮箱验证

- 不能为空
- 必须符合邮箱格式 `xxx@xxx.xxx`

```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
```

### 密码验证

- 不能为空
- 至少 6 位

## 样式定制

### 主题颜色

在 `index.scss` 中修改：

```scss
// 主色调（渐变背景）
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

// 微信登录按钮
background: linear-gradient(135deg, #07c160 0%, #05b152 100%);

// 邮箱登录按钮
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### 圆角大小

```scss
// 卡片圆角
border-radius: 32rpx;

// 按钮圆角
border-radius: 16rpx;

// 输入框圆角
border-radius: 16rpx;
```

## 平台差异处理

### 微信登录显示逻辑

```typescript
const showWxLogin = platform.canUseWxLogin()

// 小程序环境：true
// H5 微信浏览器：true
// H5 普通浏览器：false
```

### 默认登录方式

```typescript
componentDidMount() {
  if (platform.canUseWxLogin()) {
    this.setState({ loginType: 'wx' })  // 微信登录
  } else {
    this.setState({ loginType: 'email' })  // 邮箱登录
  }
}
```

## 错误处理

### 登录失败

登录失败时会：
1. 在控制台输出错误信息
2. 通过 Toast 提示用户
3. 保持在登录页

```typescript
catch (error) {
  // 错误已在 action 中处理
  console.error('登录失败', error)
}
```

### 网络错误

网络错误时 `request.ts` 会自动：
1. 显示 Toast 提示
2. 在控制台输出错误

## 安全性

### Token 存储

- Token 存储在本地 Storage
- 使用 `storage.setToken()` 加密存储
- 每次请求自动携带 token

### 密码安全

- 密码使用 `password` 类型输入框
- 支持显示/隐藏切换
- 传输时需要 HTTPS

## 与 Redux 集成

### 连接 Redux

```typescript
export default connect(
  // mapStateToProps：从 Redux 获取数据
  (state: RootState) => ({
    loading: state.user.loading,
    error: state.user.error,
  }),
  // mapDispatchToProps：dispatch actions
  (dispatch) => ({
    wxLogin: () => dispatch(wxLoginAsync()),
    emailLogin: (email, password) => dispatch(emailLoginAsync(email, password)),
  })
)(LoginPage)
```

### 登录流程

```
用户点击登录
    ↓
dispatch(wxLoginAsync/emailLoginAsync)
    ↓
action: LOGIN_REQUEST (loading: true)
    ↓
调用 API (utils/auth.ts)
    ↓
成功：action: LOGIN_SUCCESS
失败：action: LOGIN_FAILURE
    ↓
更新 Redux state
    ↓
组件重新渲染
```

## 自定义扩展

### 添加第三方登录

1. 在 `utils/platform.ts` 添加平台判断
2. 在 `utils/auth.ts` 添加登录方法
3. 在 `actions/user.ts` 添加 action
4. 在登录页面添加按钮

### 添加注册功能

```typescript
// 添加注册按钮
<View className='form-footer'>
  <Text className='link-text' onClick={this.goToRegister}>
    还没有账号？立即注册
  </Text>
</View>

// 跳转到注册页
goToRegister = () => {
  Taro.navigateTo({ url: '/pages/register/index' })
}
```

### 添加找回密码

```typescript
<View className='form-footer'>
  <Text className='link-text' onClick={this.goToForgotPassword}>
    忘记密码？
  </Text>
</View>
```

## 测试账号

开发环境测试账号（示例）：

```
邮箱：test@example.com
密码：123456
```

## 常见问题

### 1. 微信登录按钮不显示？

检查：
- 是否在小程序环境或微信浏览器中
- `platform.canUseWxLogin()` 返回值

### 2. 登录后跳转失败？

检查：
- 目标页面是否在 `app.config.ts` 中配置
- 是否使用 `switchTab`（跳转到 tabBar 页面）

### 3. Token 过期处理？

在 `src/services/request.ts` 中：
```typescript
if (code === '401') {
  storage.clearAuth()
  Taro.reLaunch({ url: '/pages/login/index' })
}
```

## 注意事项

1. **小程序审核**：微信登录需要申请权限
2. **HTTPS**：生产环境必须使用 HTTPS
3. **Token 刷新**：建议实现 token 自动刷新机制
4. **安全区域**：适配 iPhone X 等刘海屏

## 下一步

- [ ] 实现注册页面
- [ ] 实现找回密码
- [ ] 添加第三方登录（支付宝等）
- [ ] 实现手机号登录
- [ ] 添加验证码功能

