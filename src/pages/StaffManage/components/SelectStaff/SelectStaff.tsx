import React, { useMemo, useState } from 'react';
import { Input } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { OrganizationalTree } from 'src/pages/RoleManage/components';
import { Icon } from 'src/components';

interface ISelectStaffProps {
  value?: any;
  onChange?: (value?: any) => void;
  type?: 'staff' | 'dept';
  className?: string;
  singleChoice?: boolean;
  disabled?: boolean;
}

const SelectStaff: React.FC<ISelectStaffProps> = ({
  value,
  onChange,
  type = 'staff',
  className,
  singleChoice,
  disabled
}) => {
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
        suffix={!disabled && value ? <Icon name="guanbi" onClick={delAll} /> : <DownOutlined />}
        className={className}
        value={inputValue}
        style={{ color: '#E1E2E6' }}
        onClick={() => setOrgParam((orgParam) => ({ ...orgParam, visible: true }))}
        placeholder="请选择"
        disabled={disabled}
      />
      <OrganizationalTree
        onCancel={() => setOrgParam((orgParam) => ({ ...orgParam, visible: false }))}
        showStaff={type === 'staff'}
        selectedDept={type === 'dept'}
        value={value}
        params={orgParam}
        title={type === 'staff' ? '选择客户经理' : '选择部门'}
        okText={'确认'}
        onChange={onChange}
        checkStrictly={type === 'dept'}
        singleChoice={singleChoice}
      />
    </>
  );
};
export default SelectStaff;
