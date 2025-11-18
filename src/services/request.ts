import Taro from '@tarojs/taro'
import storage from '../utils/storage'
import type { RequestOptions } from '../../types/services'

const BASE_URL = process.env.TARO_APP_API_BASE_URL || ''
const DEFAULT_TIMEOUT = 30000

onst request = async <T = any>(options: RequestOptions): Promise<T> => {
    const {
        url,
        method = 'GET',
        data,
        headers = {},
        showLoading = false,
        loadingText = '加载中...',
        timeout = DEFAULT_TIMEOUT,
        skipAuth = false,
    } = options

    if (showLoading) {
        Taro.showLoading({
            title: loadingText,
            mask: true,
        })
    }

    const token = storage.getToken()
    const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers,
    }

    if (!skipAuth && token) {
        requestHeaders.Authorization = `Bearer ${token}`
    }

    try {
        const res = await Taro.request<Taro.request.SuccessCallbackResult<T>>({
            url: `${BASE_URL}${url}`,
            method: method as any,
            data,
            header: requestHeaders,
            timeout,
        })

        if (showLoading) {
            Taro.hideLoading()
        }

        const { statusCode, data: responseData } = res

        if (statusCode >= 200 && statusCode < 300) {
            // 约定的业务响应格式：{ code, message, data }
            const { code, message, data } = responseData as any
      
            if (code === '200' || code === 200) {
              return data as T
            }
      
            if (code === '401') {
              storage.clearAuth()
              Taro.showToast({
                title: '登录状态已过期，请重新登录',
                icon: 'none',
              })
              setTimeout(() => {
                Taro.reLaunch({ url: '/pages/login/index' })
              }, 1500)
              throw new Error('登录状态已过期')
            }
      
            throw new Error(message || '请求失败')
        }
      
        throw new Error(`HTTP 错误：${statusCode}`)
    } catch (error) {
        if (showLoading) {
            Taro.hideLoading()
        }
      
        const errMsg = error?.message || error?.errMsg || '网络错误'
        console.error(`[Request Error] ${method} ${url}`, errMsg)
      
        Taro.showToast({
            title: errMsg,
            icon: 'none',
            duration: 2000,
        })
      
        throw error
    }
}

export const get = <T = any>(url: string, params?: Record<string, any>, options?: Partial<RequestOptions>): Promise<T> => {
    request<T>({
        url,
        method: 'GET',
        data: params,
        ...options,
    })
}

export const post = <T = any>(url: string, data?: any, options?: Partial<RequestOptions>) =>
    request<T>({
        url,
        method: 'POST',
        data,
        ...options,
})

export const put = <T = any>(url: string, data?: any, options?: Partial<RequestOptions>) =>
    request<T>({
        url,
        method: 'PUT',
        data,
        ...options,
    })
  
export const delete = <T = any>(url: string, data?: any, options?: Partial<RequestOptions>) =>
    request<T>({
        url,
        method: 'DELETE',
        data,
        ...options,
    })

export default request