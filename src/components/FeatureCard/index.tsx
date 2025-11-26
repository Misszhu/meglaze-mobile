import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import './index.scss'

export interface FeatureCardProps {
  /** 图标（emoji 或文本） */
  icon: string
  /** 模块名称 */
  name: string
  /** 模块描述 */
  desc: string
  /** 图标颜色主题 */
  color: 'purple' | 'blue' | 'green' | 'orange' | 'red' | 'yellow' | 'pink' | 'teal'
  /** 点击事件 */
  onClick?: () => void
}

class FeatureCard extends Component<FeatureCardProps> {
  render() {
    const { icon, name, desc, color, onClick } = this.props

    return (
      <View className='feature-card' onClick={onClick}>
        <View className={`icon-wrapper ${color}`}>
          <Text className='icon'>{icon}</Text>
        </View>
        <Text className='item-name'>{name}</Text>
        <Text className='item-desc'>{desc}</Text>
      </View>
    )
  }
}

export default FeatureCard

