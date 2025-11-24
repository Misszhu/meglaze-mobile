import { Component } from 'react'
import { View, Button, Input, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { connect } from 'react-redux'
import { wxLoginAsync, emailLoginAsync } from '../../actions/user'
import platform from '../../utils/platform'
import type { RootState } from '../../store/types'
import './index.scss'

interface LoginPageProps {
  loading: boolean
  error: string | null
  wxLogin: () => Promise<any>
  emailLogin: (email: string, password: string) => Promise<any>
}

interface LoginPageState {
  loginType: 'wx' | 'email'
  email: string
  password: string
  showPassword: boolean
}

class LoginPage extends Component<LoginPageProps, LoginPageState> {
  state: LoginPageState = {
    loginType: 'wx',
    email: '',
    password: '',
    showPassword: false,
  }

  componentDidMount() {
    // 根据平台决定默认登录方式
    if (platform.canUseWxLogin()) {
      this.setState({ loginType: 'wx' })
    } else {
      this.setState({ loginType: 'email' })
    }
  }

  // 微信登录
  handleWxLogin = async () => {
    try {
      await this.props.wxLogin()
      
      Taro.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 1500,
      })
      
      // 跳转到首页
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/index/index' })
      }, 1500)
    } catch (error) {
      // 错误已在 action 中处理
      console.error('微信登录失败', error)
    }
  }

  // 邮箱登录
  handleEmailLogin = async () => {
    const { email, password } = this.state
    
    // 表单验证
    if (!email) {
      Taro.showToast({
        title: '请输入邮箱',
        icon: 'none',
      })
      return
    }
    
    if (!password) {
      Taro.showToast({
        title: '请输入密码',
        icon: 'none',
      })
      return
    }

    // 简单的邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      Taro.showToast({
        title: '邮箱格式不正确',
        icon: 'none',
      })
      return
    }

    if (password.length < 6) {
      Taro.showToast({
        title: '密码至少6位',
        icon: 'none',
      })
      return
    }

    try {
      await this.props.emailLogin(email, password)
      
      Taro.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 1500,
      })
      
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/index/index' })
      }, 1500)
    } catch (error) {
      // 错误已在 action 中处理
      console.error('邮箱登录失败', error)
    }
  }

  // 切换登录方式
  switchLoginType = (type: 'wx' | 'email') => {
    this.setState({ loginType: type })
  }

  // 切换密码显示
  togglePasswordVisibility = () => {
    this.setState({ showPassword: !this.state.showPassword })
  }

  render() {
    const { loading } = this.props
    const { loginType, email, password, showPassword } = this.state
    const showWxLogin = platform.canUseWxLogin()

    return (
      <View className='login-page'>
        {/* 顶部装饰 */}
        <View className='login-header'>
          <View className='header-bg'></View>
          <View className='header-content'>
            <Text className='title'>釉料管理系统</Text>
            <Text className='subtitle'>Meglaze Mobile</Text>
          </View>
        </View>

        {/* 登录表单 */}
        <View className='login-content'>
          <View className='login-card'>
            {/* 微信登录 */}
            {showWxLogin && (
              <View className='login-section'>
                <Button
                  className='wx-login-btn'
                  loading={loading && loginType === 'wx'}
                  onClick={this.handleWxLogin}
                >
                  <Text className='btn-icon'>📱</Text>
                  <Text className='btn-text'>微信一键登录</Text>
                </Button>
              </View>
            )}

            {/* 分割线 */}
            {showWxLogin && (
              <View className='divider'>
                <View className='divider-line'></View>
                <Text className='divider-text'>或使用邮箱登录</Text>
                <View className='divider-line'></View>
              </View>
            )}

            {/* 邮箱登录 */}
            <View className='login-section email-section'>
              <View className='form-item'>
                <View className='input-wrapper'>
                  <Text className='input-icon'>📧</Text>
                  <Input
                    className='input'
                    type='text'
                    placeholder='请输入邮箱'
                    placeholderClass='input-placeholder'
                    value={email}
                    onInput={(e) => this.setState({ email: e.detail.value })}
                  />
                </View>
              </View>

              <View className='form-item'>
                <View className='input-wrapper'>
                  <Text className='input-icon'>🔒</Text>
                  <Input
                    className='input'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='请输入密码'
                    placeholderClass='input-placeholder'
                    value={password}
                    onInput={(e) => this.setState({ password: e.detail.value })}
                  />
                  <Text 
                    className='toggle-password'
                    onClick={this.togglePasswordVisibility}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </View>
              </View>

              <Button
                className='email-login-btn'
                loading={loading && loginType === 'email'}
                onClick={this.handleEmailLogin}
              >
                登录
              </Button>

              {/* 忘记密码链接 */}
              <View className='form-footer'>
                <Text className='link-text'>忘记密码？</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 底部信息 */}
        <View className='login-footer'>
          <Text className='footer-text'>登录即表示同意</Text>
          <Text className='footer-link'>用户协议</Text>
          <Text className='footer-text'>和</Text>
          <Text className='footer-link'>隐私政策</Text>
        </View>
      </View>
    )
  }
}

export default connect(
  (state: RootState) => ({
    loading: state.user.loading,
    error: state.user.error,
  }),
  (dispatch) => ({
    wxLogin: () => dispatch(wxLoginAsync()),
    emailLogin: (email: string, password: string) => dispatch(emailLoginAsync(email, password)),
  })
)(LoginPage)

