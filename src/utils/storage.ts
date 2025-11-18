import Taro from '@tarojs/taro'

/**
 * 存储键名常量
 */
const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_INFO: 'userInfo',
  REFRESH_TOKEN: 'refreshToken',
  LOGIN_TIME: 'loginTime',
} as const

/**
 * 存储工具类
 * 封装 Taro 的存储 API，提供类型安全和错误处理
 */
class Storage {
  /**
   * 设置存储
   * @param key 存储键
   * @param value 存储值（会自动序列化）
   */
  setItem<T = any>(key: string, value: T): boolean {
    try {
      const serializedValue = JSON.stringify(value)
      Taro.setStorageSync(key, serializedValue)
      return true
    } catch (error) {
      console.error(`Storage setItem error [${key}]:`, error)
      return false
    }
  }

  /**
   * 获取存储
   * @param key 存储键
   * @param defaultValue 默认值（如果不存在）
   */
  getItem<T = any>(key: string, defaultValue: T | null = null): T | null {
    try {
      const value = Taro.getStorageSync(key)
      if (!value) {
        return defaultValue
      }
      return JSON.parse(value) as T
    } catch (error) {
      console.error(`Storage getItem error [${key}]:`, error)
      return defaultValue
    }
  }

  /**
   * 删除存储
   * @param key 存储键
   */
  removeItem(key: string): boolean {
    try {
      Taro.removeStorageSync(key)
      return true
    } catch (error) {
      console.error(`Storage removeItem error [${key}]:`, error)
      return false
    }
  }

  /**
   * 清空所有存储
   */
  clear(): boolean {
    try {
      Taro.clearStorageSync()
      return true
    } catch (error) {
      console.error('Storage clear error:', error)
      return false
    }
  }

  /**
   * 检查键是否存在
   * @param key 存储键
   */
  hasItem(key: string): boolean {
    try {
      const value = Taro.getStorageSync(key)
      return value !== ''
    } catch (error) {
      return false
    }
  }

  /**
   * 获取所有键名
   */
  getAllKeys(): string[] {
    try {
      return Taro.getStorageInfoSync().keys
    } catch (error) {
      console.error('Storage getAllKeys error:', error)
      return []
    }
  }

  // ==================== Token 相关 ====================

  /**
   * 设置 Token
   */
  setToken(token: string): boolean {
    return this.setItem(STORAGE_KEYS.TOKEN, token)
  }

  /**
   * 获取 Token
   */
  getToken(): string | null {
    return this.getItem<string>(STORAGE_KEYS.TOKEN)
  }

  /**
   * 删除 Token
   */
  removeToken(): boolean {
    return this.removeItem(STORAGE_KEYS.TOKEN)
  }

  /**
   * 检查是否有 Token
   */
  hasToken(): boolean {
    return this.hasItem(STORAGE_KEYS.TOKEN)
  }

  // ==================== Refresh Token 相关 ====================

  /**
   * 设置 Refresh Token
   */
  setRefreshToken(refreshToken: string): boolean {
    return this.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
  }

  /**
   * 获取 Refresh Token
   */
  getRefreshToken(): string | null {
    return this.getItem<string>(STORAGE_KEYS.REFRESH_TOKEN)
  }

  /**
   * 删除 Refresh Token
   */
  removeRefreshToken(): boolean {
    return this.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
  }

  // ==================== 用户信息相关 ====================

  /**
   * 设置用户信息
   */
  setUserInfo<T = any>(userInfo: T): boolean {
    return this.setItem(STORAGE_KEYS.USER_INFO, userInfo)
  }

  /**
   * 获取用户信息
   */
  getUserInfo<T = any>(): T | null {
    return this.getItem<T>(STORAGE_KEYS.USER_INFO)
  }

  /**
   * 删除用户信息
   */
  removeUserInfo(): boolean {
    return this.removeItem(STORAGE_KEYS.USER_INFO)
  }

  /**
   * 检查是否有用户信息
   */
  hasUserInfo(): boolean {
    return this.hasItem(STORAGE_KEYS.USER_INFO)
  }

  // ==================== 登录时间相关 ====================

  /**
   * 设置登录时间
   */
  setLoginTime(): boolean {
    return this.setItem(STORAGE_KEYS.LOGIN_TIME, Date.now())
  }

  /**
   * 获取登录时间
   */
  getLoginTime(): number | null {
    return this.getItem<number>(STORAGE_KEYS.LOGIN_TIME)
  }

  /**
   * 检查登录是否过期（基于时间）
   * @param maxAge 最大有效期（毫秒），默认 7 天
   */
  isLoginExpired(maxAge: number = 7 * 24 * 60 * 60 * 1000): boolean {
    const loginTime = this.getLoginTime()
    if (!loginTime) {
      return true
    }
    return Date.now() - loginTime > maxAge
  }

  // ==================== 认证相关（组合方法） ====================

  /**
   * 保存登录信息（Token + 用户信息 + 登录时间）
   */
  saveAuth<T = any>(token: string, userInfo: T, refreshToken?: string): boolean {
    const results = [
      this.setToken(token),
      this.setUserInfo(userInfo),
      this.setLoginTime(),
    ]
    
    if (refreshToken) {
      results.push(this.setRefreshToken(refreshToken))
    }
    
    return results.every(result => result)
  }

  /**
   * 清除所有认证信息（Token + 用户信息 + Refresh Token + 登录时间）
   */
  clearAuth(): boolean {
    const results = [
      this.removeToken(),
      this.removeUserInfo(),
      this.removeRefreshToken(),
      this.removeItem(STORAGE_KEYS.LOGIN_TIME),
    ]
    return results.every(result => result)
  }

  /**
   * 检查是否已登录
   */
  isLoggedIn(): boolean {
    return this.hasToken() && this.hasUserInfo()
  }

  /**
   * 获取存储信息（用于调试）
   */
  getStorageInfo() {
    try {
      return Taro.getStorageInfoSync()
    } catch (error) {
      console.error('Storage getStorageInfo error:', error)
      return null
    }
  }
}

// 导出单例
const storage = new Storage()

export default storage

// 导出便捷方法（向后兼容）
export const {
  setItem,
  getItem,
  removeItem,
  clear,
  hasItem,
  getAllKeys,
  setToken,
  getToken,
  removeToken,
  hasToken,
  setRefreshToken,
  getRefreshToken,
  removeRefreshToken,
  setUserInfo,
  getUserInfo,
  removeUserInfo,
  hasUserInfo,
  setLoginTime,
  getLoginTime,
  isLoginExpired,
  saveAuth,
  clearAuth,
  isLoggedIn,
  getStorageInfo,
} = storage

// 导出存储键名常量
export { STORAGE_KEYS }