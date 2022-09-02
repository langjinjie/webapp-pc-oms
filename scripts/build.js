/**
 * @name build
 * @author Lester
 * @date 2021-05-11 11:05
 */
'use strict';

process.env.NODE_ENV = 'production';

// 当Promise 被 reject 且没有 reject 处理器的时候，会触发 unhandledrejection 事件
process.on('unhandledRejection', (err) => {
  throw err;
});

const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin'); // 简单打包进度百分比
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // css压缩
const TerserWebpackPlugin = require('terser-webpack-plugin'); // js压缩
const webpackConfig = require('./webpack.config');

const buildConfig = {
  // devtool: 'source-map',
  plugins: [new CleanWebpackPlugin(), new SimpleProgressWebpackPlugin()],
  performance: {
    hints: false
  },
  optimization: {
    splitChunks: {
      chunks: 'all', // initial(初始化) | async(动态加载) | all(全部)
      minSize: 30000, // // 大于30k会被webpack进行拆包，默认0
      minChunks: 1, // 被引用次数大于等于这个次数进行拆分，默认1
      maxAsyncRequests: 5, // 最大异步请求数， 默认1
      maxInitialRequests: 5, // 最大初始化请求数，默认1
      name: 'name',
      automaticNameDelimiter: '-', // 打包分隔符
      cacheGroups: {
        // 基础库
        baseChunks: {
          name: 'base.chunks', // 要分隔出来的 chunk 名称
          test: (module) => /react|react-dom|react-router-dom|axios|moment/.test(module.context),
          priority: 20 // 打包优先级
        },
        // UI、icon、图表、表情等库
        uiChunks: {
          name: 'ui.chunks', // 要分隔出来的 chunk 名称
          test: (module) => /antd|@ant-design\/icons|echarts|emoji-mart/.test(module.context),
          priority: 10 // 打包优先级
        },
        // 打包其余的的公共代码
        default: {
          name: 'common.chunks', // 要分隔出来的 chunk 名称
          minChunks: 2, // 引入两次及以上被打包
          priority: 5,
          reuseExistingChunk: true // 可设置是否重用已用chunk 不再创建新的chunk
        }
      }
    },
    minimizer: [
      new TerserWebpackPlugin({
        parallel: true,
        terserOptions: {
          output: {
            comments: false,
            ascii_only: true
          },
          compress: {
            drop_console: false,
            drop_debugger: true,
            comparisons: false
          },
          safari10: true
        }
      }),
      new CssMinimizerPlugin()
    ]
  }
};

module.exports = merge(webpackConfig(), buildConfig);
