import type { UserConfigExport } from "@tarojs/cli";
import WebpackObfuscator from 'webpack-obfuscator';

export default {
  mini: {
    // 小程序端配置
    webpackChain(chain) {
      // 生产环境启用代码混淆
      if (process.env.NODE_ENV === 'production') {
        // 配置代码混淆选项
        chain.plugin('obfuscator')
          .use(WebpackObfuscator, [{
            // 混淆选项配置
            rotateStringArray: true, // 旋转字符串数组
            stringArray: true, // 字符串数组编码
            stringArrayCallsTransform: true, // 字符串数组调用转换
            stringArrayEncoding: ['base64'], // 字符串数组编码方式
            stringArrayIndexShift: true, // 字符串数组索引偏移
            stringArrayRotate: true, // 字符串数组旋转
            stringArrayShuffle: true, // 字符串数组洗牌
            stringArrayWrappersCount: 2, // 字符串数组包装器数量
            stringArrayWrappersChainedCalls: true, // 字符串数组包装器链式调用
            stringArrayWrappersParametersMaxCount: 4, // 字符串数组包装器参数最大数量
            stringArrayWrappersType: 'function', // 字符串数组包装器类型
            stringArrayThreshold: 0.75, // 字符串数组阈值
            transformObjectKeys: true, // 转换对象键名
            unicodeEscapeSequence: false, // 禁用 Unicode 转义序列（避免增加代码体积）
            
            // 性能优化选项
            compact: true, // 紧凑输出
            controlFlowFlattening: true, // 控制流扁平化
            controlFlowFlatteningThreshold: 0.75, // 控制流扁平化阈值
            deadCodeInjection: false, // 禁用死代码注入（避免体积过大）
            debugProtection: false, // 禁用调试保护（可能影响性能）
            debugProtectionInterval: 0, // 调试保护间隔
            disableConsoleOutput: false, // 不禁用 console（避免影响调试）
            identifierNamesGenerator: 'hexadecimal', // 标识符名称生成器
            log: false, // 不输出日志
            numbersToExpressions: true, // 数字转表达式
            renameGlobals: false, // 不重命名全局变量（避免破坏代码）
            selfDefending: true, // 自我保护（检测代码篡改）
            simplify: true, // 简化代码
            splitStrings: true, // 分割字符串
            splitStringsChunkLength: 10, // 分割字符串块长度
            target: 'browser', // 目标环境
          }]);
        
        // 优化 Terser 压缩配置（webpack 5 已内置 Terser）
        // Taro 会自动配置 Terser，这里可以选择性地覆盖配置
        // 如果需要自定义，可以通过 chain.optimization.minimizer('terser').tap() 方法
      }
    }
  },
  h5: {
    /**
     * WebpackChain 插件配置
     * @docs https://github.com/neutrinojs/webpack-chain
     */
    webpackChain(chain) {
      // 生产环境启用代码混淆
      if (process.env.NODE_ENV === 'production') {
        // 配置代码混淆选项
        chain.plugin('obfuscator')
          .use(WebpackObfuscator, [{
            // 混淆选项配置
            rotateStringArray: true, // 旋转字符串数组
            stringArray: true, // 字符串数组编码
            stringArrayCallsTransform: true, // 字符串数组调用转换
            stringArrayEncoding: ['base64'], // 字符串数组编码方式
            stringArrayIndexShift: true, // 字符串数组索引偏移
            stringArrayRotate: true, // 字符串数组旋转
            stringArrayShuffle: true, // 字符串数组洗牌
            stringArrayWrappersCount: 2, // 字符串数组包装器数量
            stringArrayWrappersChainedCalls: true, // 字符串数组包装器链式调用
            stringArrayWrappersParametersMaxCount: 4, // 字符串数组包装器参数最大数量
            stringArrayWrappersType: 'function', // 字符串数组包装器类型
            stringArrayThreshold: 0.75, // 字符串数组阈值
            transformObjectKeys: true, // 转换对象键名
            unicodeEscapeSequence: false, // 禁用 Unicode 转义序列（避免增加代码体积）
            
            // 性能优化选项
            compact: true, // 紧凑输出
            controlFlowFlattening: true, // 控制流扁平化
            controlFlowFlatteningThreshold: 0.75, // 控制流扁平化阈值
            deadCodeInjection: false, // 禁用死代码注入（避免体积过大）
            debugProtection: false, // 禁用调试保护（可能影响性能）
            debugProtectionInterval: 0, // 调试保护间隔
            disableConsoleOutput: false, // 不禁用 console（避免影响调试）
            identifierNamesGenerator: 'hexadecimal', // 标识符名称生成器
            log: false, // 不输出日志
            numbersToExpressions: true, // 数字转表达式
            renameGlobals: false, // 不重命名全局变量（避免破坏代码）
            selfDefending: true, // 自我保护（检测代码篡改）
            simplify: true, // 简化代码
            splitStrings: true, // 分割字符串
            splitStringsChunkLength: 10, // 分割字符串块长度
            target: 'browser', // 目标环境
          }, [
            // 排除不需要混淆的文件
            'excluded_bundle_name.js',
          ]]);
        
        // 优化 Terser 压缩配置（webpack 5 已内置 Terser）
        const terserOptions = chain.optimization.minimizer('terser');
        if (terserOptions) {
          terserOptions.tap((args: any[]) => {
            args[0] = {
              ...args[0],
              terserOptions: {
                ...args[0]?.terserOptions,
                compress: {
                  ...args[0]?.terserOptions?.compress,
                  drop_console: false, // 保留 console（可根据需要开启）
                  drop_debugger: true, // 移除 debugger
                  pure_funcs: ['console.log'], // 移除指定函数的调用（可选）
                },
                format: {
                  ...args[0]?.terserOptions?.format,
                  comments: false, // 移除注释
                },
              },
              extractComments: false, // 不提取注释到单独文件
            };
            return args;
          });
        }
      }
      /**
       * 如果 h5 端编译后体积过大，可以使用 webpack-bundle-analyzer 插件对打包体积进行分析。
       * @docs https://github.com/webpack-contrib/webpack-bundle-analyzer
       */
      // chain.plugin('analyzer')
      //   .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
      /**
       * 如果 h5 端首屏加载时间过长，可以使用 prerender-spa-plugin 插件预加载首页。
       * @docs https://github.com/chrisvfritz/prerender-spa-plugin
       */
      // const path = require('path')
      // const Prerender = require('prerender-spa-plugin')
      // const staticDir = path.join(__dirname, '..', 'dist')
      // chain
      //   .plugin('prerender')
      //   .use(new Prerender({
      //     staticDir,
      //     routes: [ '/pages/index/index' ],
      //     postProcess: (context) => ({ ...context, outputPath: path.join(staticDir, 'index.html') })
      //   }))
    }
  }
} satisfies UserConfigExport<'webpack5'>
