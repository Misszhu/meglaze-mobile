import Taro from '@tarojs/taro'
import { wxLoginApi, emailLoginApi, getUserInfoApi, logoutApi } from '../services/api/auth'
import storage from './storage'
import platform from './platform'
import type { LoginResponse, User } from '../../types/user'

/**
 * 检查登录状态
 * @returns 是否已登录
 */
export const checkLogin = async (): Promise<boolean> => {
  const token = storage.getToken()
  if (!token) {
    return false
  }

  try {
    // 验证 token 是否有效
    const user = await getUserInfoApi()
    if (user) {
      storage.setUserInfo(user)
      return true
    }
    return false
  } catch (error) {
    // token 无效，清除登录信息
    storage.clearAuth()
    return false
  }
}

/**
 * 微信登录
 * @returns 登录响应数据
 */
export const wxLogin = async (): Promise<LoginResponse> => {
  try {
    // 1. 获取微信登录 code
    const loginRes = await Taro.login()
    const { code } = loginRes

    if (!code) {
      throw new Error('获取微信登录凭证失败')
    }

    // 2. 可选：获取用户信息（需要用户授权）
    let userInfo: any = null
    try {
      const profileRes = await Taro.getUserProfile({
        desc: '用于完善用户资料'
      })
      userInfo = profileRes.userInfo
    } catch (error) {
      // 用户拒绝授权，继续使用 code 登录
      console.log('用户未授权获取用户信息')
    }

    // 3. 调用后端登录接口
    const response = await wxLoginApi(code, userInfo)

    // 4. 保存登录信息
    storage.setToken(response.token)
    storage.setUserInfo(response.user)
    storage.setLoginTime()

    if (response.refreshToken) {
      storage.setRefreshToken(response.refreshToken)
    }

    // 5. 如果需要绑定邮箱，提示用户
    if (response.needBind && response.bindType === 'email') {
      setTimeout(() => {
        Taro.showModal({
          title: '账号关联',
          content: '检测到您可能已有邮箱账号，是否绑定？绑定后可在 PC 端使用邮箱登录，数据将同步。',
          confirmText: '绑定',
          cancelText: '稍后',
          success: (res) => {
            if (res.confirm) {
              Taro.navigateTo({
                url: '/pages/bind-account/index?type=email'
              })
            }
          }
        })
      }, 1000)
    }

    return response
  } catch (error: any) {
    console.error('微信登录失败', error)
    Taro.showToast({
      title: error.message || '登录失败',
      icon: 'none'
    })
    throw error
  }
}

/**
 * 邮箱登录
 * @param email 邮箱
 * @param password 密码
 * @returns 登录响应数据
 */
export const emailLogin = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    // 1. 调用后端登录接口
    const response = await emailLoginApi(email, password)

    // 2. 保存登录信息
    storage.setToken(response.token)
    storage.setUserInfo(response.user)
    storage.setLoginTime()

    if (response.refreshToken) {
      storage.setRefreshToken(response.refreshToken)
    }

    // 3. 如果未绑定微信，且在小程序环境，提示绑定
    if (!response.user.hasWxBind && platform.canUseWxLogin()) {
      setTimeout(() => {
        Taro.showModal({
          title: '绑定微信',
          content: '绑定微信后可快速登录，是否现在绑定？',
          confirmText: '绑定',
          cancelText: '稍后',
          success: (res) => {
            if (res.confirm) {
              Taro.navigateTo({
                url: '/pages/bind-account/index?type=wx'
              })
            }
          }
        })
      }, 1000)
    }

    return response
  } catch (error: any) {
    console.error('邮箱登录失败', error)
    Taro.showToast({
      title: error.message || '登录失败',
      icon: 'none'
    })
    throw error
  }
}

/**
 * 退出登录
 */
export const logout = async (): Promise<void> => {
  try {
    // 调用后端退出接口（可选）
    await logoutApi()
  } catch (error) {
    console.error('退出登录失败', error)
  } finally {
    // 清除本地登录信息
    storage.clearAuth()
    
    // 跳转到登录页
    Taro.reLaunch({
      url: '/pages/login/index'
    })
  }
}

/**
 * 需要登录时调用
 * 检查登录状态，未登录则跳转到登录页
 * @returns 是否已登录
 */
export const requireLogin = async (): Promise<boolean> => {
  const isLoggedIn = await checkLogin()
  if (!isLoggedIn) {
    Taro.navigateTo({
      url: '/pages/login/index'
    })
    return false
  }
  return true
}

/**
 * 获取当前用户信息
 * @returns 用户信息，未登录返回 null
 */
export const getCurrentUser = (): User | null => {
  return storage.getUserInfo<User>()
}

/**
 * 更新本地用户信息
 * @param userInfo 用户信息
 */
export const updateLocalUserInfo = (userInfo: Partial<User>): void => {
  const currentUser = storage.getUserInfo<User>()
  if (currentUser) {
    storage.setUserInfo({
      ...currentUser,
      ...userInfo
    })
  }
}

/**
 * 检查 Token 是否过期
 * @returns 是否过期
 */
export const isTokenExpired = (): boolean => {
  return storage.isLoginExpired()
}

/**
 * 自动刷新 Token（如果需要）
 */
export const autoRefreshToken = async (): Promise<void> => {
  // 可以在这里实现 token 刷新逻辑
  // 例如：检查 token 过期时间，提前刷新等
  console.log('自动刷新 Token 功能待实现')
}

