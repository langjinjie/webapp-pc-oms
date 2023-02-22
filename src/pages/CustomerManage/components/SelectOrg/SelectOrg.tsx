import React, { Key, useMemo, useState } from 'react';
import { Input } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { OrgTree, Icon } from 'src/components';

import style from './style.module.less';
import classNames from 'classnames';

interface ISelectStaffProps {
  value?: any;
  onChange?: (value?: any) => void;
  type?: 'staff' | 'dept';
  className?: string;
  singleChoice?: boolean;
  disabled?: boolean;
  checkabledDTypeKeys?: Key[];
  isDeleted?: 0 | 1; // 0不包含离职 1-包含离职
}

const SelectStaff: React.FC<ISelectStaffProps> = ({
  value,
  onChange,
  type = 'staff',
  className,
  singleChoice,
  disabled,
  checkabledDTypeKeys,
  isDeleted = 0
}) => {
  const [visible, setVisible] = useState(false);

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
        className={classNames(style.viewInput, className)}
        value={inputValue}
        style={{ color: '#E1E2E6' }}
        onClick={() => setVisible(true)}
        placeholder="请选择"
        disabled={disabled}
      />
      <OrgTree
        visible={visible}
        onCancel={() => setVisible(false)}
        showStaff={type === 'staff'}
        selectedDept={type === 'dept'}
        value={value}
        title={type === 'dept' ? '选择部门' : '选择客户经理'}
        okText={'确认'}
        onChange={onChange}
        checkStrictly={type === 'dept'}
        singleChoice={singleChoice}
        checkabledDTypeKeys={checkabledDTypeKeys}
        isDeleted={isDeleted}
      />
    </>
  );
};
export default SelectStaff;
