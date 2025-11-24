import { Component, PropsWithChildren } from 'react'
import { Provider } from 'react-redux'

import configStore from './store'
import { initUserState } from './actions/user'

import './app.scss'

const store = configStore()

class App extends Component<PropsWithChildren> {
  componentDidMount () {
    // 从本地存储恢复用户登录状态
    // @ts-ignore - Redux thunk middleware allows dispatching functions
    store.dispatch(initUserState())
  }

  componentDidShow () {}

  componentDidHide () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    )
  }
}

export default App
