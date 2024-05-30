/**
 * @name index
 * @author Lester
 * @date 2021-05-06 15:15
 */

import '@babel/polyfill';
import React from 'react';
import ReactDom from 'react-dom';
import { ConfigProvider } from 'antd';
import locale from 'antd/es/locale/zh_CN';
import 'moment/locale/zh-cn';
// import 'src/utils/setup'; // 主动执行文件
import App from './App';
import './index.less';
import './antd.less';
import './theme/antd.less';

ReactDom.render(
  <ConfigProvider locale={locale}>
    <App />
  </ConfigProvider>,
  document.getElementById('root')
);
