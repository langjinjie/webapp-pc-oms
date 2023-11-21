/**
 * @name webpack.config
 * @author Lester
 * @date 2021-05-11 10:39
 */

const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const DotEnvWebpack = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const threadLoader = require('thread-loader');

const NODE_ENV = process.env.NODE_ENV;

const isDev = NODE_ENV === 'development';

const argv = require('yargs').argv;

// 环境变量配置
const envConfig = {
  test: path.resolve(__dirname, './env/.env.test'), // 测试环境配置
  prod: path.resolve(__dirname, './env/.env.prod'), // 测试环境配置
  local: path.resolve(__dirname, './env/.env.local') // 本地义环境配置
};

/**
 * 获取样式处理loader
 * @param isModule
 * @param isLess
 * @returns {[string|*, {loader: string, options: {modules: {localIdentName: string}}}|string, string]}
 */
const getStyleLoader = (isModule = false, isLess = false) => {
  const cssModuleLoader = {
    loader: 'css-loader',
    options: {
      modules: {
        localIdentName: '[local]_[hash:base64:5]'
      }
    }
  };
  const loaders = [
    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
    isModule ? cssModuleLoader : 'css-loader',
    'postcss-loader'
  ];
  if (isLess) {
    loaders.push({
      loader: 'less-loader',
      options: {
        lessOptions: {
          javascriptEnabled: true,
          modifyVars: {
            '@primary-color': '#318cf5'
          }
        }
      }
    });
  }
  return loaders;
};

const jsWorkerPool = {
  // options

  // 产生的 worker 的数量，默认是 (cpu 核心数 - 1)
  // 当 require('os').cpus() 是 undefined 时，则为 1
  workers: 2,

  // 闲置时定时删除 worker 进程
  // 默认为 500ms
  // 可以设置为无穷大， 这样在监视模式(--watch)下可以保持 worker 持续存在
  poolTimeout: 2000
};

threadLoader.warmup(jsWorkerPool, ['babel-loader']);

module.exports = function () {
  const ROOT_PATH = path.resolve(__dirname, '../');

  const fix = (num, length) => {
    return ('' + num).length < length ? (new Array(length + 1).join('0') + num).slice(-length) : '' + num;
  };
  const date = new Date();
  const time = `${date.getFullYear()}${fix(date.getMonth() + 1, 2)}${fix(date.getDate(), 2)}${fix(
    date.getHours(),
    2
  )}${fix(date.getMinutes(), 2)}${fix(date.getSeconds(), 2)}`;

  return {
    // noParse: /jquery|lodash/, // noParse 配置的意思是让 webpack 忽略没有模块化的文件
    entry: {
      main: path.resolve(ROOT_PATH, './src/index.tsx')
    },
    output: {
      path: path.resolve(ROOT_PATH, './dist'),
      filename: time + '/js/[name].[chunkhash:8].bundle.js',
      publicPath: isDev ? '/' : '/tenacity-oms/'
      // publicPath: isDev ? '/' : './'
    },
    mode: NODE_ENV || 'production',
    module: {
      rules: [
        {
          test: /\.css$/,
          exclude: /\.module\.css$/,
          use: getStyleLoader(false, false)
        },
        {
          test: /\.module\.css$/,
          exclude: /node_modules/,
          use: getStyleLoader(true, false)
        },
        {
          test: /\.less$/,
          exclude: /\.module\.less$/,
          use: getStyleLoader(false, true)
        },
        {
          test: /\.module\.less$/,
          exclude: /node_modules/,
          use: getStyleLoader(true, true)
        },
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          enforce: 'pre',
          use: [
            {
              loader: 'eslint-loader',
              options: {
                fix: true
              }
            }
          ]
        },
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: [
            { loader: 'thread-loader', options: jsWorkerPool },
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-typescript']
              }
            }
          ]
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,

          exclude: /node_modules/,
          type: 'asset/resource',
          // options: {
          //   esModule: false,
          //   limit: 10000,
          //   name: time + '/images/[name].[contenthash:8].[ext]'
          // }
          generator: {
            outputPath: time + '/images'
          }
        }
      ]
    },
    resolve: {
      alias: {
        src: path.resolve(ROOT_PATH, './src'),
        '@': path.resolve(ROOT_PATH, './src')
      },
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json', '.less', '.css']
    },
    plugins: [
      new DotEnvWebpack({
        path: envConfig[argv.env || 'local']
      }),
      new CopyPlugin({
        patterns: [
          // Copy glob results (with dot files) to /absolute/path/
          {
            from: path.resolve(ROOT_PATH, './static/'),
            to: path.resolve(ROOT_PATH, './dist/' + time + '/static')
          }
        ]
      }),
      new HtmlPlugin({
        template: path.resolve(ROOT_PATH, './public/index.html'),
        favicon: path.resolve(ROOT_PATH, './public/favicon.ico'),
        projectPath: process.env.NODE_ENV === 'production' ? '/tenacity-oms/' + time : '',
        // html压缩
        minify: {
          collapseWhitespace: true,
          preserveLineBreaks: true
        }
      }),
      new MiniCssExtractPlugin({
        filename: isDev ? time + '/css/[name][hash:8].css' : time + '/css/[name].[chunkhash:8].css',
        chunkFilename: isDev ? time + '/css/[id][hash:8].css' : time + '/css/[id].[chunkhash:8].css',
        ignoreOrder: true
      }),
      new webpack.DefinePlugin({
        'process.env.BASE_PATH': time,
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      })
    ]
  };
};
