/**
 * @name Company
 * @author Lester
 * @date 2021-12-21 13:57
 */
import React, { useEffect } from 'react';
import { setTitle } from 'lester-tools';
import style from './style.module.less';

const Company: React.FC = () => {
  useEffect(() => {
    setTitle('企业管理');
  }, []);

  return <div className={style.wrap}></div>;
};

export default Company;
