# 用户状态管理使用指南

## 文件结构

```
src/
├── constants/user.ts      # 用户相关的 action 类型常量
├── actions/user.ts        # 用户相关的 action creators
├── reducers/user.ts       # 用户状态的 reducer
└── store/types.ts         # Redux 状态类型定义
```

## 状态结构

```typescript
interface UserState {
  loginStatus: LoginStatus  // 登录状态
  userInfo: User | null     // 用户信息
  token: string | null      // 访问令牌
  refreshToken: string | null  // 刷新令牌
  loading: boolean          // 是否正在加载
  error: string | null      // 错误信息
}
```

## 使用方法

### 1. 在组件中获取用户状态

```typescript
import { connect } from 'react-redux'
import type { RootState } from '@/store/types'

// 函数组件
const MyComponent = ({ userInfo, loginStatus }) => {
  return (
    <View>
      {loginStatus === 'LOGGED_IN' ? (
        <Text>欢迎，{userInfo?.nickname}</Text>
      ) : (
        <Text>请登录</Text>
      )}
    </View>
  )
}

export default connect((state: RootState) => ({
  userInfo: state.user.userInfo,
  loginStatus: state.user.loginStatus,
  loading: state.user.loading,
}))(MyComponent)
```

### 2. 微信登录

```typescript
import { connect } from 'react-redux'
import { wxLoginAsync } from '@/actions/user'

const LoginPage = ({ wxLogin, loading }) => {
  const handleWxLogin = async () => {
    try {
      await wxLogin()
      Taro.showToast({ title: '登录成功', icon: 'success' })
      Taro.switchTab({ url: '/pages/home/index' })
    } catch (error) {
      // 错误已在 action 中处理
    }
  }

  return (
    <Button loading={loading} onClick={handleWxLogin}>
      微信登录
    </Button>
  )
}

export default connect(
  (state: RootState) => ({
    loading: state.user.loading,
  }),
  (dispatch) => ({
    wxLogin: () => dispatch(wxLoginAsync()),
  })
)(LoginPage)
```

### 3. 邮箱登录

```typescript
import { connect } from 'react-redux'
import { emailLoginAsync } from '@/actions/user'

const LoginPage = ({ emailLogin, loading }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleEmailLogin = async () => {
    try {
      await emailLogin(email, password)
      Taro.showToast({ title: '登录成功', icon: 'success' })
      Taro.switchTab({ url: '/pages/home/index' })
    } catch (error) {
      // 错误已在 action 中处理
    }
  }

  return (
    <View>
      <Input value={email} onInput={(e) => setEmail(e.detail.value)} />
      <Input value={password} onInput={(e) => setPassword(e.detail.value)} />
      <Button loading={loading} onClick={handleEmailLogin}>
        登录
      </Button>
    </View>
  )
}

export default connect(
  (state: RootState) => ({
    loading: state.user.loading,
  }),
  (dispatch) => ({
    emailLogin: (email, password) => dispatch(emailLoginAsync(email, password)),
  })
)(LoginPage)
```

### 4. 退出登录

```typescript
import { connect } from 'react-redux'
import { logoutAsync } from '@/actions/user'

const ProfilePage = ({ logout }) => {
  const handleLogout = async () => {
    const res = await Taro.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
    })
    
    if (res.confirm) {
      await logout()
    }
  }

  return (
    <Button onClick={handleLogout}>退出登录</Button>
  )
}

export default connect(
  null,
  (dispatch) => ({
    logout: () => dispatch(logoutAsync()),
  })
)(ProfilePage)
```

### 5. 初始化用户状态（从本地存储恢复）

在 `app.tsx` 中初始化：

```typescript
import { Component } from 'react'
import { Provider } from 'react-redux'
import configStore from './store'
import { initUserState } from './actions/user'

const store = configStore()

class App extends Component {
  componentDidMount() {
    // 从本地存储恢复用户登录状态
    store.dispatch(initUserState())
  }

  render() {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    )
  }
}

export default App
```

### 6. 更新用户信息

```typescript
import { connect } from 'react-redux'
import { updateUserInfo } from '@/actions/user'

const EditProfilePage = ({ userInfo, updateUser }) => {
  const handleUpdate = async () => {
    const newInfo = {
      nickname: '新昵称',
      avatar: 'https://...',
    }
    
    // 调用后端 API 更新
    await updateUserInfoApi(newInfo)
    
    // 更新本地状态
    updateUser(newInfo)
  }

  return (
    <Button onClick={handleUpdate}>保存</Button>
  )
}

export default connect(
  (state: RootState) => ({
    userInfo: state.user.userInfo,
  }),
  (dispatch) => ({
    updateUser: (info) => dispatch(updateUserInfo(info)),
  })
)(EditProfilePage)
```

## Action 列表

### 同步 Actions
- `setLoginStatus(status)` - 设置登录状态
- `setUserInfo(userInfo)` - 设置用户信息
- `setToken(token)` - 设置 Token
- `clearUserInfo()` - 清除用户信息
- `updateUserInfo(userInfo)` - 更新用户信息
- `logoutAction()` - 退出登录

### 异步 Actions
- `wxLoginAsync()` - 微信登录
- `emailLoginAsync(email, password)` - 邮箱登录
- `logoutAsync()` - 退出登录（调用后端）
- `initUserState()` - 初始化用户状态

## 状态流转

```
初始状态 (NOT_LOGGED_IN)
    ↓
登录中 (loading: true)
    ↓
登录成功 (LOGGED_IN) / 登录失败 (NOT_LOGGED_IN)
    ↓
Token 过期 (TOKEN_EXPIRED)
    ↓
需要重新登录 (NEED_RELOGIN)
    ↓
退出登录 (NOT_LOGGED_IN)
```

## 注意事项

1. **登录状态持久化**：用户状态存储在 Redux 中，页面刷新后会丢失，需要在 `app.tsx` 中调用 `initUserState()` 恢复。

2. **Token 管理**：Token 同时存储在 Redux 和本地存储中，本地存储作为持久化方案。

3. **错误处理**：登录失败时，错误信息会存储在 `state.user.error` 中，并通过 Toast 提示用户。

4. **加载状态**：登录过程中 `state.user.loading` 为 `true`，可以用来显示加载动画。

5. **类型安全**：使用 `RootState` 类型确保状态访问的类型安全。

