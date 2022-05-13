import React from 'react';
import { AddRole } from 'src/pages/RoleManage/components';
import style from './style.module.less';

const Add: React.FC = () => {
  return (
    <div className={style.wrap}>
      <AddRole roleType={2} />
    </div>
  );
};
export default Add;
