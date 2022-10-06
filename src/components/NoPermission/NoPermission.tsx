/**
 * @name NoPermission
 * @author Lester
 * @date 2022-05-17 10:23
 */
import React from 'react';
import style from './style.module.less';

const NoPermission: React.FC = () => {
  return (
    <div className={style.wrap}>
      <img className={style.img} src={require('src/assets/images/permission/no_permission.png')} alt="" />
      <div className={style.text}>该菜单暂无使用权限，请联系管理员</div>
    </div>
  );
};

export default NoPermission;
