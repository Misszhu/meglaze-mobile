export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/login/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '釉料管理系统',
    navigationBarTextStyle: 'black'
  },
  // tabBar 配置（暂时注释，等有多个页面时再启用）
  // 微信小程序要求 tabBar.list 至少包含 2 项
  // tabBar: {
  //   color: '#7A7E83',
  //   selectedColor: '#667eea',
  //   backgroundColor: '#ffffff',
  //   borderStyle: 'white',
  //   list: [
  //     {
  //       pagePath: 'pages/index/index',
  //       text: '首页',
  //     },
  //     {
  //       pagePath: 'pages/profile/index',
  //       text: '我的',
  //     }
  //   ]
  // }
})
