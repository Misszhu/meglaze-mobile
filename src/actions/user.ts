import {
  SET_LOGIN_STATUS,
  SET_USER_INFO,
  SET_TOKEN,
  CLEAR_USER_INFO,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  UPDATE_USER_INFO,
} from '../constants/user'
import { wxLogin, emailLogin, logout as logoutUtil } from '../utils/auth'
import storage from '../utils/storage'
import type { User, LoginStatus } from '../types/user'

/**
 * 设置登录状态
 */
export const setLoginStatus = (status: LoginStatus) => ({
  type: SET_LOGIN_STATUS,
  payload: status,
})

/**
 * 设置用户信息
 */
export const setUserInfo = (userInfo: User | null) => ({
  type: SET_USER_INFO,
  payload: userInfo,
})

/**
 * 设置 Token
 */
export const setToken = (token: string | null) => ({
  type: SET_TOKEN,
  payload: token,
})

/**
 * 清除用户信息
 */
export const clearUserInfo = () => ({
  type: CLEAR_USER_INFO,
})

/**
 * 登录请求开始
 */
const loginRequest = () => ({
  type: LOGIN_REQUEST,
})

/**
 * 登录成功
 */
const loginSuccess = (token: string, userInfo: User) => ({
  type: LOGIN_SUCCESS,
  payload: { token, userInfo },
})

/**
 * 登录失败
 */
const loginFailure = (error: string) => ({
  type: LOGIN_FAILURE,
  payload: error,
})

/**
 * 退出登录
 */
export const logoutAction = () => ({
  type: LOGOUT,
})

/**
 * 更新用户信息
 */
export const updateUserInfo = (userInfo: Partial<User>) => ({
  type: UPDATE_USER_INFO,
  payload: userInfo,
})

/**
 * 微信登录（异步 action）
 */
export const wxLoginAsync = () => {
  return async (dispatch) => {
    try {
      dispatch(loginRequest())
      const response = await wxLogin()
      dispatch(loginSuccess(response.token, response.user))
      return response
    } catch (error: any) {
      dispatch(loginFailure(error.message || '登录失败'))
      throw error
    }
  }
}

/**
 * 邮箱登录（异步 action）
 */
export const emailLoginAsync = (email: string, password: string) => {
  return async (dispatch) => {
    try {
      dispatch(loginRequest())
      const response = await emailLogin(email, password)
      dispatch(loginSuccess(response.token, response.user))
      return response
    } catch (error: any) {
      dispatch(loginFailure(error.message || '登录失败'))
      throw error
    }
  }
}

/**
 * 退出登录（异步 action）
 */
export const logoutAsync = () => {
  return async (dispatch) => {
    try {
      await logoutUtil()
      dispatch(logoutAction())
    } catch (error) {
      // 即使退出失败，也清除本地状态
      dispatch(logoutAction())
    }
  }
}

/**
 * 初始化用户状态（从本地存储恢复）
 */
export const initUserState = () => {
  return (dispatch) => {
    const token = storage.getToken()
    const userInfo = storage.getUserInfo<User>()
    
    if (token && userInfo) {
      dispatch(setToken(token))
      dispatch(setUserInfo(userInfo))
      dispatch(setLoginStatus('LOGGED_IN' as LoginStatus))
    }
  }
}

