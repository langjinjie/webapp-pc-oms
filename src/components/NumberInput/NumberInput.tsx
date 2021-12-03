/**
 * @description 目前只支持两位小数
 * input输入纯数字
 */
import React from 'react';
import { Input } from 'antd';

interface NumberInputProps {
  onChange: (value: string) => void;
  onBlur?: () => void;
  value: string;
}
const NumberInput: React.FC<NumberInputProps> = (props) => {
  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value } = e.target;
    // const reg = /^-?\d*(\.\d*)?$/;
    const reg = /^\d+(\.\d{0,2})?$/; // 两位小数的正则
    if (reg.test(value) || value === '') {
      props.onChange(value);
    }
  };

  const onBlur = () => {
    console.log('1');
    const { value, onBlur, onChange } = props;
    let valueTemp = value;
    if (value.charAt(value.length - 1) === '.') {
      valueTemp = value.slice(0, -1);
    }
    onChange(valueTemp.replace(/0*(\d+)/, '$1'));
    if (onBlur) {
      onBlur();
    }
  };
  return (
    <Input
      {...props}
      onChange={onChange}
      onBlur={onBlur}
      placeholder="请输入"
      maxLength={10}
      style={{ width: '100px' }}
    />
  );
};

export default NumberInput;
