/**
 * @name NoPermission
 * @author Lester
 * @date 2022-05-17 10:23
 */
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import style from './style.module.less';

const NoPermission: React.FC<RouteComponentProps> = ({ location }) => {
  const { errCode }: any = location.state || {};

  return (
    <div className={style.wrap}>
      {errCode}
      <img className={style.img} src={require('src/assets/images/permission/no_permission.png')} alt="" />
      <div className={style.text}>暂无使用权限，请联系管理员</div>
    </div>
  );
};

export default NoPermission;
