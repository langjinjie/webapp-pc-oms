import { InputNumber } from 'antd';
import React, { useMemo } from 'react';

interface CustomTimeProps {
  value?: number;
  onChange?: (value: number) => void;
}
const CustomTime: React.FC<CustomTimeProps> = ({ value, onChange }) => {
  const [min, second] = useMemo(() => {
    if (!value) {
      return [undefined, undefined];
    } else {
      const min = Math.floor(value / 60);
      const second = value % 60;

      return [min || undefined, second || undefined];
    }
  }, [value]);

  const handleChange = (value: number, type: 'min' | 'second') => {
    if (type === 'min') {
      onChange?.((value || 0) * 60 + (second || 0));
    } else if (type === 'second') {
      onChange?.((value || 0) + (min || 0) * 60);
    }
  };

  return (
    <div>
      <InputNumber
        placeholder="请输入"
        onChange={(value) => handleChange(value, 'min')}
        value={min}
        controls={false}
        max={480}
        precision={0}
        style={{ width: '140px' }}
        min={0}
      />
      <span className="mr20 ml5">分钟</span>
      <InputNumber
        placeholder="请输入"
        onChange={(value) => handleChange(value, 'second')}
        value={second}
        controls={false}
        style={{ width: '140px' }}
        min={0}
        max={59}
      />
      <span className="ml5">秒</span>
    </div>
  );
};

export default CustomTime;
