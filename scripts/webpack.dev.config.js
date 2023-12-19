/**
 * @name start
 * @author Lester
 * @date 2021-05-11 10:31
 */
'use strict';

process.env.NODE_ENV = 'development';

// 当Promise 被 reject 且没有 reject 处理器的时候，会触发 unhandledrejection 事件
process.on('unhandledRejection', (err) => {
  throw err;
});

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const { merge } = require('webpack-merge');
const webpackConfig = require('./webpack.base');

const PORT = parseInt(process.env.PORT, 10) || 8060;
const HOST = process.env.HOST || 'localhost';
const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';

const startConfig = {
  devtool: 'source-map',
  target: 'web'
};

const compiler = webpack(merge(webpackConfig(), startConfig));

const devServerOptions = {
  host: HOST,
  port: PORT,
  open: true,
  hot: true,
  https: process.env.HTTPS === 'true',
  historyApiFallback: true,
  disableHostCheck: true, // 防止Invalid Host header的报错
  progress: true,
  overlay: {
    errors: true,
    warnings: true
  },
  proxy: [
    {
      context: ['/api', '/tenacity-admin', '/res'],
      target: 'https://dev.tenacity.com.cn',
      // target: 'http://172.30.15.141:7060',
      // target: 'https://piccgz.tenacity.com.cn/',
      // pathRewrite: {
      //   '^/tenacity-admin': '/tenacity/tenacity-admin'
      // },
      secure: false,
      changeOrigin: true
    }
  ]
};

const server = new WebpackDevServer(compiler, devServerOptions);

server.listen(PORT, HOST, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log(`Starting sever on ${protocol}://${HOST}:${PORT}`);
});
