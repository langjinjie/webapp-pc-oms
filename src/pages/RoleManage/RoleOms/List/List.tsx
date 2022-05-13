import React from 'react';
import { RoleList } from 'src/pages/RoleManage/components';
import style from './style.module.less';

const List: React.FC = () => {
  return (
    <div className={style.wrap}>
      <RoleList roleType={1} />
    </div>
  );
};
export default List;
