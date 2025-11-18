/**
 * API 统一响应格式
 */
export interface ApiResponse<T = any> {
    /** 业务状态码 */
    code: string
    /** 提示信息 */
    message: string
    /** 响应数据 */
    data: T
}
  
/**
 * 分页请求参数
 */
export interface PaginationParams {
    /** 页码（从1开始） */
    page?: number
    /** 每页数量 */
    pageSize?: number
}

/**
 * 分页响应数据
 */
export interface PaginationResponse<T = any> {
    /** 数据列表 */
    list: T[]
    /** 总数量 */
    total: number
    /** 当前页码 */
    page: number
    /** 每页数量 */
    pageSize: number
    /** 总页数 */
    totalPages: number
}
  
/**
 * 排序参数
 */
export interface SortParams {
    /** 排序字段 */
    sortField?: string
    /** 排序方向：asc | desc */
    sortOrder?: 'asc' | 'desc'
}

/**
 * 查询参数（分页 + 排序）
 */
export interface QueryParams extends PaginationParams, SortParams {
    /** 搜索关键词 */
    keyword?: string
}