import React from 'react';

import { DatePicker, Input } from 'antd';
import { Icon } from 'src/components';

import styles from './style.module.less';
import moment from 'moment';

interface EditTextProps {
  type: 'date' | 'text';
  value?: string;
  readOnly?: boolean;
  onChange?: (value: any) => void;
}
export const EditText: React.FC<EditTextProps> = ({ value, onChange, type, readOnly = true }) => {
  const clearInputValue = () => {
    onChange?.('');
  };
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    console.log(e.target.value);
    onChange?.(e.target.value);
  };
  return (
    <div className={styles.editText}>
      {type === 'date'
        ? (
        <DatePicker
          bordered={false}
          disabled={readOnly}
          value={value ? moment(value) : undefined}
          onChange={(value, dateString) => onChange?.(dateString)}
        />
          )
        : (
        <Input
          bordered={false}
          value={value}
          readOnly={readOnly}
          onChange={handleChange}
          suffix={
            !readOnly
              ? (
              <Icon name="icon_common_16_inputclean" className="font16" onClick={clearInputValue} />
                )
              : undefined
          }
        />
          )}
    </div>
  );
};
