import React, { useState } from 'react';
import { Button, Form, Select, Input } from 'antd';
import classNames from 'classnames';

import style from './style.module.less';

interface FilterClientAttrProps {
  name: number;
  remove?: () => void;
  options: any[];
  disabled: boolean;
}
const FilterClientAttr: React.FC<FilterClientAttrProps> = ({ name, remove, options, disabled }) => {
  const [condOptions, setCondOptions] = useState<any[]>([]);
  const [valueOptions, setValueOptions] = useState<any[]>([]);
  const handleSelectChange = (value: string) => {
    const current = options.filter((option) => option.code === value)[0];
    setCondOptions(current.condList || []);
    setValueOptions(current.valueList || []);
  };

  return (
    <div className={classNames('flex', style.wrap)}>
      {disabled
        ? (
        <>
          <Form.Item name={[name, 'fieldCodeName']}>
            <Input readOnly></Input>
          </Form.Item>
          <Form.Item className="ml10" name={[name, 'condiCodeName']}>
            <Input readOnly></Input>
          </Form.Item>
          <Form.Item className="ml10" name={[name, 'valueCodeName']}>
            <Input readOnly></Input>
          </Form.Item>
        </>
          )
        : (
        <>
          <Form.Item name={[name, 'fieldCode']}>
            <Select placeholder="请选择" onChange={handleSelectChange} disabled={disabled}>
              {options.map((option) => (
                <Select.Option key={option.code} value={option.code}>
                  {option.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item className="ml10" name={[name, 'condiCode']}>
            <Select placeholder="请选择" disabled={disabled}>
              {condOptions.map((option) => (
                <Select.Option key={option.code} value={option.code}>
                  {option.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item className="ml10" name={[name, 'valueCode']}>
            <Select placeholder="请选择" disabled={disabled}>
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
        </>
          )}
    </div>
  );
};

export default FilterClientAttr;
