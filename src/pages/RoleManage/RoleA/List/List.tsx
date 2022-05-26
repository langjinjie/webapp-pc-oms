import React from 'react';
import { RoleList } from 'src/pages/RoleManage/components';
import { useDocumentTitle } from 'src/utils/base';
import style from './style.module.less';

const List: React.FC = () => {
  useDocumentTitle('角色管理-A端角色管理');
  return (
    <div className={style.wrap}>
      <RoleList roleType={3} />
    </div>
  );
};
export default List;
