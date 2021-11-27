import React, { useMemo } from 'react';
import { Input } from 'antd';

interface InputShowLengthProps {
  value?: string;
  onChange?: (val: string) => void;
  maxLength: number;
  [propKey: string]: any;
}
export const Suffix: React.FC<{ maxLength: number; count: number }> = ({ maxLength, count = 0 }) => {
  return (
    <span className="color-text-placeholder">
      {count}/{maxLength}
    </span>
  );
};
const InputShowLength: React.FC<InputShowLengthProps> = ({ value, onChange, maxLength = 100, ...props }) => {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const val = e.target.value;

    onChange?.(val);
  };
  const count = useMemo(() => {
    if (value) {
      return value.length;
    } else {
      return 0;
    }
  }, [value]);
  return (
    <Input
      value={value}
      {...props}
      maxLength={maxLength}
      onChange={(e) => handleChange(e)}
      suffix={<Suffix maxLength={maxLength} count={count} />}
    ></Input>
  );
};
export default InputShowLength;
