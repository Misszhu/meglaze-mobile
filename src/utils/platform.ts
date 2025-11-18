import Taro from '@tarojs/taro'

/**
 * 平台判断工具类
 * 仅支持微信小程序和 H5
 */
class Platform {
  /**
   * 获取当前运行环境
   * @returns 'weapp' | 'h5'
   */
  getPlatform(): 'weapp' | 'h5' {
    // @ts-ignore
    const env = Taro.getEnv()
    return env === 'WEAPP' ? 'weapp' : 'h5'
  }

  /**
   * 是否是小程序环境
   */
  isWeapp(): boolean {
    return this.getPlatform() === 'weapp'
  }

  /**
   * 是否是 H5 环境
   */
  isH5(): boolean {
    return this.getPlatform() === 'h5'
  }

  /**
   * 是否支持微信登录
   * - 小程序环境：支持
   * - H5 环境：需要检查是否在微信浏览器中
   */
  canUseWxLogin(): boolean {
    // 小程序环境直接支持
    if (this.isWeapp()) {
      return true
    }

    // H5 环境，检查是否在微信浏览器中
    if (this.isH5()) {
      return this.isInWechatBrowser()
    }

    return false
  }

  /**
   * 是否在微信浏览器中（H5 环境）
   */
  isInWechatBrowser(): boolean {
    if (!this.isH5()) {
      return false
    }

    try {
      // @ts-ignore
      const ua = navigator.userAgent.toLowerCase()
      return ua.includes('micromessenger')
    } catch (error) {
      return false
    }
  }

  /**
   * 获取系统信息
   */
  getSystemInfo(): Taro.getSystemInfoSync.Result | null {
    try {
      return Taro.getSystemInfoSync()
    } catch (error) {
      console.error('Platform getSystemInfo error:', error)
      return null
    }
  }

  /**
   * 是否是 iOS 系统
   */
  isIOS(): boolean {
    const systemInfo = this.getSystemInfo()
    if (!systemInfo) {
      return false
    }
    return systemInfo.platform === 'ios' || systemInfo.system.includes('iOS')
  }

  /**
   * 是否是 Android 系统
   */
  isAndroid(): boolean {
    const systemInfo = this.getSystemInfo()
    if (!systemInfo) {
      return false
    }
    return systemInfo.platform === 'android' || systemInfo.system.includes('Android')
  }

  /**
   * 获取设备像素比
   */
  getPixelRatio(): number {
    const systemInfo = this.getSystemInfo()
    return systemInfo?.pixelRatio || 2
  }

  /**
   * 获取屏幕宽度（px）
   */
  getScreenWidth(): number {
    const systemInfo = this.getSystemInfo()
    return systemInfo?.windowWidth || systemInfo?.screenWidth || 375
  }

  /**
   * 获取屏幕高度（px）
   */
  getScreenHeight(): number {
    const systemInfo = this.getSystemInfo()
    return systemInfo?.windowHeight || systemInfo?.screenHeight || 667
  }

  /**
   * 获取状态栏高度（px）
   */
  getStatusBarHeight(): number {
    const systemInfo = this.getSystemInfo()
    return systemInfo?.statusBarHeight || 0
  }

  /**
   * 获取安全区域信息（用于适配刘海屏等）
   */
  getSafeArea(): Taro.getSystemInfoSync.Result['safeArea'] | null {
    const systemInfo = this.getSystemInfo()
    return systemInfo?.safeArea || null
  }

  /**
   * 是否是开发环境
   */
  isDev(): boolean {
    return process.env.NODE_ENV === 'development'
  }

  /**
   * 是否是生产环境
   */
  isProd(): boolean {
    return process.env.NODE_ENV === 'production'
  }

  /**
   * 获取平台显示名称
   */
  getPlatformName(): string {
    return this.isWeapp() ? '微信小程序' : 'H5'
  }

  /**
   * 获取用户代理字符串（H5 环境）
   */
  getUserAgent(): string {
    if (!this.isH5()) {
      return ''
    }

    try {
      // @ts-ignore
      return navigator.userAgent || ''
    } catch (error) {
      return ''
    }
  }
}

// 导出单例
const platform = new Platform()

export default platform

// 导出便捷方法
export const {
  getPlatform,
  isWeapp,
  isH5,
  canUseWxLogin,
  isInWechatBrowser,
  getSystemInfo,
  isIOS,
  isAndroid,
  getPixelRatio,
  getScreenWidth,
  getScreenHeight,
  getStatusBarHeight,
  getSafeArea,
  isDev,
  isProd,
  getPlatformName,
  getUserAgent,
} = platform