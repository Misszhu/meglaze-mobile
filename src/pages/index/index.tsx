import { Component } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { connect } from 'react-redux'
import type { RootState } from '../../store/types'
import FeatureCard, { type FeatureCardProps } from '../../components/FeatureCard'
import './index.scss'

interface HomePageProps {
  userInfo: any
}

interface HomePageState {
  stats: {
    userCount: number
    formulaCount: number
    experimentCount: number
  }
}

// 功能模块配置
const featureModules: Array<Omit<FeatureCardProps, 'onClick'> & { path: string }> = [
  { icon: '📦', name: '材料管理', desc: '原材料管理', color: 'purple', path: '/pages/material/index' },
  { icon: '⚙️', name: '球磨制度', desc: '工艺管理', color: 'blue', path: '/pages/ball-milling/index' },
  { icon: '🧪', name: '配方管理', desc: '配方设计', color: 'green', path: '/pages/formula/index' },
  { icon: '🔥', name: '烧成制度', desc: '温度曲线', color: 'orange', path: '/pages/firing/index' },
  { icon: '📊', name: '实验记录', desc: '实验数据', color: 'red', path: '/pages/experiment/index' },
  { icon: '🛡️', name: '安全管理', desc: 'SDS管理', color: 'yellow', path: '/pages/safety/index' },
  { icon: '📖', name: '用户指南', desc: '使用帮助', color: 'pink', path: '/pages/guide/index' },
]

class HomePage extends Component<HomePageProps, HomePageState> {
  state: HomePageState = {
    stats: {
      userCount: 0,
      formulaCount: 0,
      experimentCount: 0,
    }
  }

  componentDidMount() {
    // 加载统计数据（无需登录）
    this.loadStats()
  }

  componentDidShow() {
    // 页面显示时刷新数据
    this.loadStats()
  }

  // 加载统计数据
  loadStats = async () => {
    try {
      // TODO: 调用实际 API
      // const stats = await getStatsApi()
      // this.setState({ stats })
      
      // 模拟数据
      this.setState({
        stats: {
          userCount: 128,
          formulaCount: 256,
          experimentCount: 512,
        }
      })
    } catch (error) {
      console.error('加载统计数据失败', error)
    }
  }

  // 处理开始使用按钮点击
  handleGetStarted = () => {
    const { userInfo } = this.props
    if (userInfo) {
      // 已登录，跳转到功能模块（如配方管理）
      this.navigateTo('/pages/formula/index')
    } else {
      // 未登录，跳转到登录页
      Taro.navigateTo({ url: '/pages/login/index' })
    }
  }

  // 处理技术支持按钮点击
  handleSupport = () => {
    // 跳转到用户指南或技术支持页面
    Taro.navigateTo({ url: '/pages/guide/index' })
  }

  // 快捷入口导航（需要登录的功能）
  navigateTo = async (url: string) => {
    const { userInfo } = this.props
    
    // 检查是否需要登录
    if (!userInfo) {
      const res = await Taro.showModal({
        title: '提示',
        content: '该功能需要登录后使用，是否前往登录？',
        confirmText: '去登录',
        cancelText: '取消'
      })
      
      if (res.confirm) {
        Taro.navigateTo({ url: '/pages/login/index' })
      }
      return
    }
    
    // 已登录，直接跳转
    Taro.navigateTo({ url })
  }

  render() {
    const { stats } = this.state

    return (
      <ScrollView className='home-page' scrollY>
        {/* 顶部 Banner */}
        <View className='banner'>
          <View className='banner-bg'></View>
          <View className='banner-content'>
            <View className='banner-title'>
              <Text className='title'>Meglaze</Text>
              <Text className='subtitle'>专业的釉料实验与管理系统</Text>
            </View>
            <View className='banner-actions'>
              <View className='action-btn primary' onClick={this.handleGetStarted}>
                <Text className='btn-text'>开始使用</Text>
              </View>
              <View className='action-btn secondary' onClick={this.handleSupport}>
                <Text className='btn-text'>技术支持</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 数据统计 */}
        <View className='stats-section'>
          <View className='stats-card'>
            <View className='stat-item'>
              <Text className='stat-value'>{stats.userCount}+</Text>
              <Text className='stat-label'>注册用户</Text>
            </View>
            <View className='stat-divider'></View>
            <View className='stat-item'>
              <Text className='stat-value'>{stats.formulaCount}+</Text>
              <Text className='stat-label'>配方数量</Text>
            </View>
            <View className='stat-divider'></View>
            <View className='stat-item'>
              <Text className='stat-value'>{stats.experimentCount}+</Text>
              <Text className='stat-label'>实验记录</Text>
            </View>
          </View>
        </View>

        {/* 快捷入口 */}
        <View className='quick-entries'>
          <View className='section-header'>
            <Text className='section-title'>功能模块</Text>
          </View>
          
          <View className='grid-container'>
            {featureModules.map((module) => (
              <FeatureCard
                key={module.path}
                icon={module.icon}
                name={module.name}
                desc={module.desc}
                color={module.color}
                onClick={() => this.navigateTo(module.path)}
              />
            ))}
          </View>
        </View>

        {/* 最新动态 */}
        <View className='news-section'>
          <View className='section-header'>
            <Text className='section-title'>最新动态</Text>
            <Text className='more-text'>更多 &gt;</Text>
          </View>
          
          <View className='news-list'>
            <View className='news-item'>
              <View className='news-icon'>🔒</View>
              <View className='news-content'>
                <Text className='news-title'>数据安全升级</Text>
                <Text className='news-desc'>全面升级数据加密系统，提供更安全的数据保护</Text>
                <Text className='news-time'>2025-01</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 底部信息 */}
        <View className='footer'>
          <Text className='footer-text'>釉料管理系统 · Meglaze</Text>
          <Text className='footer-text'>景德镇陶瓷大学</Text>
        </View>
      </ScrollView>
    )
  }
}

export default connect(
  (state: RootState) => ({
    userInfo: state.user.userInfo,
  })
)(HomePage)
