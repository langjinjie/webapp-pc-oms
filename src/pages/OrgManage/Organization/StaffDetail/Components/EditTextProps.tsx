import React from 'react';

import { DatePicker, Input } from 'antd';
import { Icon } from 'src/components';

import styles from './style.module.less';
import moment from 'moment';

interface EditTextProps {
  type?: 'date' | 'text' | 'textArea';
  value?: string;
  readOnly?: boolean;
  onChange?: (value: any) => void;
  placeholder?: string;
}
export const EditText: React.FC<EditTextProps> = ({ value, onChange, type = 'text', readOnly = true, placeholder }) => {
  const clearInputValue = () => {
    onChange?.('');
  };
  const handleTextareaChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    onChange?.(e.target.value);
  };
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
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
        <>
          {readOnly
            ? (
            <div>{value}</div>
              )
            : type === 'text'
              ? (
            <Input
              placeholder={placeholder}
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
                )
              : (
            <Input.TextArea
              placeholder={placeholder}
              className={styles.textarea}
              allowClear
              bordered={false}
              value={value}
              autoSize
              onChange={handleTextareaChange}
            />
                )}
        </>
          )}
    </div>
  );
};
