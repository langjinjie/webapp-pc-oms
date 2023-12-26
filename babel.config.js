const isDev = process.env.NODE_ENV === 'development'; // 是否是开发模式

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false
      }
    ],
    '@babel/preset-react'
  ],
  plugins: [
    [
      'import',
      {
        libraryName: 'antd',
        style: 'css'
      }
    ],
    isDev && require.resolve('react-refresh/babel')
    // 如果是开发模式,就启动react热更新插件
  ].filter(Boolean) // 过滤空值
};
