import React, { useState } from 'react';
import { Button, Form, Select } from 'antd';
import classNames from 'classnames';

import style from './style.module.less';

interface FilterClientAttrProps {
  name: number;
  remove?: () => void;
  options: any[];
}
const FilterClientAttr: React.FC<FilterClientAttrProps> = ({ name, remove, options }) => {
  const [condOptions, setCondOptions] = useState<any[]>([]);
  const [valueOptions, setValueOptions] = useState<any[]>([]);
  const handleSelectChange = (value: string) => {
    console.log(value);
    const current = options.filter((option) => option.code === value)[0];
    setCondOptions(current.condList || []);
    setValueOptions(current.valueList || []);
  };
  return (
    <div className={classNames('flex', style.wrap)}>
      <Form.Item name={[name, 'fieldCode']}>
        <Select placeholder="请选择" onChange={handleSelectChange}>
          {options.map((option) => (
            <Select.Option key={option.code} value={option.code}>
              {option.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item className="ml10" name={[name, 'condiCode']}>
        <Select placeholder="请选择">
          {condOptions.map((option) => (
            <Select.Option key={option.code} value={option.code}>
              {option.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item className="ml10" name={[name, 'valueCode']}>
        <Select placeholder="请选择">
          {valueOptions.map((option) => (
            <Select.Option key={option.code} value={option.code}>
              {option.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {remove && (
        <Button className="ml10" shape="round" onClick={() => remove()}>
          删除
        </Button>
      )}
    </div>
  );
};

export default FilterClientAttr;
