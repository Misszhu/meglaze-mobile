import type { UserState } from '../types/user'

/**
 * Redux 根状态类型
 */
export interface RootState {
  counter: {
    num: number
  }
  user: UserState
}

