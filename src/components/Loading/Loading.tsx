/**
 * @name Loading
 * @author Lester
 * @date 2021-05-08 14:26
 */

import React from 'react';
import Icon from '../SvgIcon/SvgIcon';
import style from './style.module.less';

const Loading: React.FC = () => {
  return (
    <div className={style.wrap}>
      <Icon className={style.icon} name="jiazai" />
    </div>
  );
};

export default Loading;
