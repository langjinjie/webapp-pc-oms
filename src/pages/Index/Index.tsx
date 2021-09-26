/**
 * @name Index
 * @author Lester
 * @date 2021-05-07 09:26
 */

import React, { useContext } from 'react';
import style from './style.module.less';
import { Context } from 'src/store';
const Index: React.FC = () => {
  const { userInfo } = useContext(Context);
  return <div className={style.wrap}>{userInfo?.corpName}欢迎您</div>;
};

export default Index;
