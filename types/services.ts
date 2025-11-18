// 请求层通用类型
export interface RequestOptions {
    url: string
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    data?: any
    headers?: Record<string, string>
    showLoading?: boolean
    loadingText?: string
    timeout?: number
    skipAuth?: boolean
}