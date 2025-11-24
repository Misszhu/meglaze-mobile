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
import type { UserState } from '../types/user'
import { LoginStatus } from '../types/user'

const INITIAL_STATE: UserState = {
  loginStatus: LoginStatus.NOT_LOGGED_IN,
  userInfo: null,
  token: null,
  refreshToken: null,
  loading: false,
  error: null,
}

export default function user(state = INITIAL_STATE, action): UserState {
  switch (action.type) {
    case SET_LOGIN_STATUS:
      return {
        ...state,
        loginStatus: action.payload,
      }

    case SET_USER_INFO:
      return {
        ...state,
        userInfo: action.payload,
      }

    case SET_TOKEN:
      return {
        ...state,
        token: action.payload,
      }

    case CLEAR_USER_INFO:
      return {
        ...state,
        userInfo: null,
        token: null,
        refreshToken: null,
        loginStatus: LoginStatus.NOT_LOGGED_IN,
      }

    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      }

    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        loginStatus: LoginStatus.LOGGED_IN,
        token: action.payload.token,
        userInfo: action.payload.userInfo,
        error: null,
      }

    case LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        loginStatus: LoginStatus.NOT_LOGGED_IN,
      }

    case LOGOUT:
      return {
        ...INITIAL_STATE,
      }

    case UPDATE_USER_INFO:
      return {
        ...state,
        userInfo: state.userInfo
          ? {
              ...state.userInfo,
              ...action.payload,
            }
          : null,
      }

    default:
      return state
  }
}

