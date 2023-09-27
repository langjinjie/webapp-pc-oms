/**
 * @name Loading
 * @author Lester
 * @date 2021-05-08 14:26
 */

import React from 'react';
import { Spin } from 'antd';
import style from './style.module.less';

const Loading: React.FC = () => {
  return (
    <div className={style.wrap}>
      <Spin />
    </div>
  );
};

export default Loading;
