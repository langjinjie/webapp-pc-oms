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

const NODE_ENV = process.env.NODE_ENV;

const isDev = NODE_ENV === 'development';

const argv = require('yargs').argv;

const cssReg = /\.css$/;
const cssModuleReg = /\.module\.css$/;
const lessReg = /\.less$/;
const lessModuleReg = /\.module\.less$/;

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

/**
 * 获取babel loader
 * @param isTs
 * @returns {{loader: string, options: {plugins: [[string, {libraryName: string, style: string}]]}}}
 */
const getBabelLoader = (isTs = false) => {
  const loader = {
    loader: 'babel-loader',
    options: {
      plugins: [['import', { libraryName: 'antd', style: 'css' }]]
    }
  };
  if (isTs) {
    loader.options.presets = ['@babel/preset-typescript'];
  }
  return loader;
};

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
          test: cssReg,
          exclude: cssModuleReg,
          use: getStyleLoader(false, false)
        },
        {
          test: cssModuleReg,
          exclude: /node_modules/,
          use: getStyleLoader(true, false)
        },
        {
          test: lessReg,
          exclude: lessModuleReg,
          // use: 'happypack/loader?id=less',
          use: getStyleLoader(false, true)
        },
        {
          test: lessModuleReg,
          exclude: /node_modules/,
          // use: 'happypack/loader?id=lessModule',
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
          use: ['thread-loader', getBabelLoader]
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['thread-loader', getBabelLoader]
        },
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.ico$/],
          loader: 'url-loader',
          options: {
            esModule: false,
            limit: 10000,
            name: time + '/images/[name].[contenthash:8].[ext]'
          }
        },
        {
          test: /\.(woff|svg|eot|ttf)\??.*$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: time + '/font/[name].[contenthash:8].[ext]'
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
      })
    ]
  };
};
