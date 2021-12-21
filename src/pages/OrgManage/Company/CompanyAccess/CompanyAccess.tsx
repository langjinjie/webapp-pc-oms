/**
 * @name CompanyAccess
 * @author Lester
 * @date 2021-12-21 14:42
 */
import React, { useEffect } from 'react';
import { setTitle } from 'lester-tools';
import style from './style.module.less';

const CompanyAccess: React.FC = () => {
  useEffect(() => {
    setTitle('企业接入');
  }, []);

  return <div className={style.wrap}></div>;
};

export default CompanyAccess;
