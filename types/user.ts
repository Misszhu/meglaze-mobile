import type { ApiResponse, PaginationParams, PaginationResponse } from './api'

/**
 * 登录类型
 */
export type LoginType = 'wx' | 'email'

/**
 * 用户基本信息
 */
export interface User {
    /** 用户ID（数据库主键） */
    id: string
    /** 用户业务ID（统一用户标识） */
    userId: string
    /** 昵称 */
    nickname?: string
    /** 头像URL */
    avatar?: string
    /** 邮箱 */
    email?: string
    /** 手机号 */
    phone?: string
    /** 是否绑定微信 */
    hasWxBind: boolean
    /** 是否绑定邮箱 */
    hasEmailBind: boolean
    /** 创建时间 */
    createdAt: string
    /** 更新时间 */
    updatedAt?: string
}

/**
 * 登录响应数据
 */
export interface LoginResponse {
    /** 访问令牌 */
    token: string
    /** 刷新令牌（可选） */
    refreshToken?: string
    /** 用户信息 */
    user: User
    /** 是否需要绑定账号 */
    needBind?: boolean
    /** 需要绑定的账号类型 */
    bindType?: 'email' | 'wx'
    /** 过期时间（时间戳，毫秒） */
    expiresIn?: number
}

  
/**
 * 微信登录请求参数
 */
export interface WxLoginRequest {
    /** 登录类型 */
    type: 'wx'
    /** 微信登录凭证 code */
    code: string
    /** 用户信息（可选，需要用户授权） */
    userInfo?: WxUserInfo
  }
  
  /**
   * 邮箱登录请求参数
   */
  export interface EmailLoginRequest {
    /** 登录类型 */
    type: 'email'
    /** 邮箱 */
    email: string
    /** 密码 */
    password: string
  }
  
  /**
   * 登录请求参数（联合类型）
   */
  export type LoginRequest = WxLoginRequest | EmailLoginRequest

/**
 * 微信用户信息（从 getUserProfile 获取）
 */
export interface WxUserInfo {
    /** 用户昵称 */
    nickName: string
    /** 用户头像 */
    avatarUrl: string
    /** 性别：0-未知，1-男，2-女 */
    gender?: number
    /** 国家 */
    country?: string
    /** 省份 */
    province?: string
    /** 城市 */
    city?: string
    /** 语言 */
    language?: string
}

/**
 * 账号绑定请求参数
 */
export interface BindWxRequest {
    /** 微信登录凭证 code */
    code: string
}

export interface BindEmailRequest {
    /** 邮箱 */
    email: string
    /** 密码 */
    password: string
}

/**
 * 账号绑定响应
 */
export interface BindResponse {
    /** 是否成功 */
    success: boolean
    /** 提示信息 */
    message?: string
    /** 绑定后的用户信息 */
    user?: User
}
  
  /**
   * 用户账号绑定信息
   */
  export interface UserBinding {
    /** 绑定类型 */
    type: 'wx' | 'email' | 'phone'
    /** 绑定标识（openid、邮箱、手机号） */
    key: string
    /** 是否主账号 */
    isPrimary: boolean
    /** 绑定时间 */
    bindTime?: string
}  

/**
 * 获取用户绑定列表响应
 */
export interface UserBindingsResponse {
    /** 绑定列表 */
    bindings: UserBinding[]
}
  
/**
 * 刷新 Token 请求参数
 */
export interface RefreshTokenRequest {
    /** 刷新令牌 */
    refreshToken: string
}
  
/**
 * 刷新 Token 响应
 */
  export interface RefreshTokenResponse {
    /** 新的访问令牌 */
    token: string
    /** 新的刷新令牌 */
    refreshToken?: string
    /** 过期时间（时间戳，毫秒） */
    expiresIn?: number
}

/**
 * 登录状态枚举
 */
export enum LoginStatus {
    /** 未登录 */
    NOT_LOGGED_IN = 'NOT_LOGGED_IN',
    /** 已登录 */
    LOGGED_IN = 'LOGGED_IN',
    /** Token 过期 */
    TOKEN_EXPIRED = 'TOKEN_EXPIRED',
    /** 需要重新登录 */
    NEED_RELOGIN = 'NEED_RELOGIN',
}
  
/**
 * 用户状态（用于 Redux）
 */
export interface UserState {
    /** 登录状态 */
    loginStatus: LoginStatus
    /** 用户信息 */
    userInfo: User | null
    /** Token */
    token: string | null
    /** 刷新 Token */
    refreshToken: string | null
    /** 是否正在登录 */
    loading: boolean
    /** 错误信息 */
    error: string | null
}

/**
 * 登录表单数据
 */
export interface LoginFormData {
    /** 登录类型 */
    loginType: LoginType
    /** 邮箱（邮箱登录时使用） */
    email?: string
    /** 密码（邮箱登录时使用） */
    password?: string
}
  
/**
 * 注册请求参数
 */
export interface RegisterRequest {
    /** 邮箱 */
    email: string
    /** 密码 */
    password: string
    /** 确认密码 */
    confirmPassword: string
    /** 验证码（可选） */
    verifyCode?: string
    /** 昵称（可选） */
    nickname?: string
}

  /**
 * 注册响应
 */
export interface RegisterResponse {
    /** 用户信息 */
    user: User
    /** 访问令牌 */
    token: string
    /** 是否需要验证邮箱 */
    needVerifyEmail?: boolean
}
  
/**
 * 忘记密码请求参数
 */
export interface ForgotPasswordRequest {
    /** 邮箱 */
    email: string
    /** 验证码 */
    verifyCode: string
    /** 新密码 */
    newPassword: string
}
  
/**
 * 修改密码请求参数
 */
export interface ChangePasswordRequest {
    /** 旧密码 */
    oldPassword: string
    /** 新密码 */
    newPassword: string
    /** 确认新密码 */
    confirmPassword: string
}

/**
 * 更新用户信息请求参数
 */
export interface UpdateUserInfoRequest {
    /** 昵称 */
    nickname?: string
    /** 头像 */
    avatar?: string
    /** 手机号 */
    phone?: string
}