import React from 'react';

import { Input } from 'antd';
import { Icon } from 'src/components';

import styles from './style.module.less';

interface EditTextProps {
  value?: string;
  readOnly?: boolean;
  onChange?: (value: any) => void;
}
export const EditText: React.FC<EditTextProps> = ({ value, onChange, readOnly = true }) => {
  const clearInputValue = () => {
    onChange?.('');
  };
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    console.log(e.target.value);
    onChange?.(e.target.value);
  };
  return (
    <div className={styles.editText}>
      <Input
        bordered={false}
        value={value}
        readOnly={readOnly}
        onChange={handleChange}
        suffix={!readOnly ? <Icon name="icon_common_16_inputclean" onClick={clearInputValue} /> : undefined}
      />
    </div>
  );
};
