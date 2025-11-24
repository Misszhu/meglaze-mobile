import { get, post } from '../request'
import type {
    LoginRequest,
    LoginResponse,
    BindWxRequest,
    BindEmailRequest,
    BindResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
    User,  
} from '../../types/user'

/**
 * 微信/邮箱登录
 */
export const loginApi = (data: LoginRequest) => 
    post<LoginResponse>('/auth/login', data)

/**
 * 微信登录（快捷方法）
 */
export const wxLoginApi = (code: string, userInfo?: any) => 
    loginApi({
        type: 'wx',
        code,
        userInfo,
     })

/**
 * 邮箱登录（快捷方法）
*/
export const emailLoginApi = (email: string, password: string) =>
    loginApi({
        type: 'email',
        email,
        password,
    })
  
/**
 * 刷新 Token
 */
export const refreshTokenApi = (data: RefreshTokenRequest) =>
    post<RefreshTokenResponse>('/auth/refresh-token', data)

/**
 * 退出登录
 */
export const logoutApi = () =>
    post<void>('/auth/logout')

/**
 * 获取当前用户信息
 */
export const getUserInfoApi = () =>
    get<User>('/auth/profile')
  
/**
 * 绑定微信账号
 */
export const bindWxApi = (data: BindWxRequest) =>
    post<BindResponse>('/auth/bind-wx', data)

/**
 * 绑定邮箱账号
 */
export const bindEmailApi = (data: BindEmailRequest) =>
    post<BindResponse>('/auth/bind-email', data)
  
/**
 * 解绑账号
 */
export const unbindAccountApi = (type: 'wx' | 'email') =>
    post<void>('/auth/unbind', { type })