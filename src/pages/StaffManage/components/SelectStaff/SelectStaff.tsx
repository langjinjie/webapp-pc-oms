import React, { useMemo, useState } from 'react';
import { Input } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { OrganizationalTree } from 'src/pages/RoleManage/components';
import style from './style.module.less';

interface ISelectStaffProps {
  value?: any;
  onChange?: (value?: any) => void;
}

const SelectStaff: React.FC<ISelectStaffProps> = ({ value, onChange }) => {
  const [orgParam, setOrgParam] = useState<{ visible: boolean; add: boolean }>({ visible: false, add: true });
  const inputValue = useMemo(() => {
    return value?.map((mapItem: any) => mapItem.staffName);
  }, [value]);
  return (
    <>
      <Input
        readOnly
        suffix={<DownOutlined />}
        className={style.viewInput}
        value={inputValue}
        style={{ color: '#E1E2E6' }}
        onClick={() => setOrgParam((orgParam) => ({ ...orgParam, visible: true }))}
        placeholder="请选择"
      />
      <OrganizationalTree
        onCancel={() => setOrgParam((orgParam) => ({ ...orgParam, visible: false }))}
        showStaff
        selectedDept={false}
        value={value}
        params={orgParam}
        onChange={onChange}
      />
    </>
  );
};
export default SelectStaff;
