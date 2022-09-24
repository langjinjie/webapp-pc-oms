import React, { useMemo, useState } from 'react';
import { Input } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { OrganizationalTree } from 'src/pages/RoleManage/components';
import { Icon } from 'src/components';
import style from './style.module.less';

interface ISelectStaffProps {
  value?: any;
  onChange?: (value?: any) => void;
  type?: 'staff' | 'dept';
}

const SelectStaff: React.FC<ISelectStaffProps> = ({ value, onChange, type = 'staff' }) => {
  const [orgParam, setOrgParam] = useState<{ visible: boolean; add: boolean }>({ visible: false, add: true });

  // 取消选择
  const delAll = () => {
    onChange?.(undefined);
  };

  const inputValue = useMemo(() => {
    if (type === 'staff') {
      return value
        ?.map((mapItem: any) => mapItem.staffName)
        .toString()
        .replace(/,/g, '；');
    } else {
      return value
        ?.map((mapItem: any) => mapItem.deptName)
        .toString()
        .replace(/,/g, '；');
    }
  }, [value]);
  return (
    <>
      <Input
        readOnly
        suffix={value ? <Icon name="guanbi" onClick={delAll} /> : <DownOutlined />}
        className={style.viewInput}
        value={inputValue}
        style={{ color: '#E1E2E6' }}
        onClick={() => setOrgParam((orgParam) => ({ ...orgParam, visible: true }))}
        placeholder="请选择"
      />
      <OrganizationalTree
        onCancel={() => setOrgParam((orgParam) => ({ ...orgParam, visible: false }))}
        showStaff={type === 'staff'}
        selectedDept={type === 'dept'}
        value={value}
        params={orgParam}
        title="选择客户经理"
        okText={'确认'}
        onChange={onChange}
      />
    </>
  );
};
export default SelectStaff;
