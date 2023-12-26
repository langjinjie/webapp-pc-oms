const portfinder = require('portfinder');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { merge } = require('webpack-merge');
const webpackConfig = require('./webpack.base');

const PORT = parseInt(process.env.PORT, 10) || 8060;
const HOST = process.env.HOST || 'localhost';
const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';

const startConfig = {
  devtool: 'eval-cheap-module-source-map',
  target: 'web',
  plugins: [
    new ReactRefreshWebpackPlugin() // 添加热更新插件
  ],
  watchOptions: {
    ignored: /node_modules/ // 最小化 watch 监控范围
  }
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
      // target: 'http://192.168.31.178:7060',
      // target: 'http://10.2.10.43:8080',
      secure: false,
      changeOrigin: true
    }
  ]
};
portfinder.basePort = PORT;
portfinder
  .getPortPromise()
  .then((port) => {
    devServerOptions.port = port;
    const server = new WebpackDevServer(compiler, devServerOptions);
    server.listen(port, HOST, (err) => {
      if (err) {
        return console.log(err);
      }
      console.log(`Starting sever on ${protocol}://${HOST}:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
