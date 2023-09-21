import React, { useState } from 'react';
import { Icon, OrgTree } from 'src/components';
import { Button } from 'antd';
// import { OrganizationalTree } from 'src/pages/RoleManage/components';
import style from './style.module.less';
import classNames from 'classnames';

interface IStaffList {
  value?: { staffId: string; staffName: string }[];
  onChange?: (value: any[]) => void;
  readOnly?: boolean;
}

const StaffList: React.FC<IStaffList> = ({ value, onChange, readOnly }) => {
  const [params, setParams] = useState<{ visible: boolean; added: boolean; roleId: string }>({
    visible: false,
    added: true,
    roleId: ''
  });
  // 选择人员
  const chooseStaff = () => {
    setParams({ visible: true, added: true, roleId: '' });
  };
  // 清除单个标签选择
  const delStaff = (staffId: string) => {
    onChange?.(value?.filter((item) => item.staffId !== staffId) || []);
  };
  const clearStaff = () => {
    onChange?.([]);
  };
  return (
    <div className={style.wrap}>
      <div className={style.choosedList}>
        {!value?.length && <span className={style.placeholder}>请选择</span>}
        {value?.map((item) => (
          <div className={classNames(style.choosedItem, { [style.readOnly]: readOnly })} key={item.staffId}>
            {item.staffName}
            {readOnly || (
              <Icon className={style.delItem} name="icon_common_Line_Close" onClick={() => delStaff(item.staffId)} />
            )}
          </div>
        ))}
        {!value?.length || readOnly || <Icon name="guanbi" className={style.clear} onClick={clearStaff} />}
      </div>
      <Button className={style.chooseTagBtn} onClick={chooseStaff} disabled={readOnly}>
        选择人员
      </Button>
      <OrgTree
        value={value}
        onChange={onChange}
        selectedType="staff"
        title={params.added ? '添加成员' : '编辑成员'}
        visible={params.visible}
        onCancel={() => setParams((params) => ({ ...params, visible: false }))}
      />
    </div>
  );
};
export default StaffList;
