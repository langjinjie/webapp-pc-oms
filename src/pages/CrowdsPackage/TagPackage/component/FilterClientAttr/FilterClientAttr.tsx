import React, { useMemo, useState } from 'react';
import { Button, Form, Select, Input } from 'antd';
import classNames from 'classnames';

import style from './style.module.less';

interface FilterClientAttrProps {
  name: number;
  remove?: () => void;
  options: any[];
  disabled: boolean;
  formValues: any;
  index: number;
}
const FilterClientAttr: React.FC<FilterClientAttrProps> = ({ name, remove, options, disabled, formValues }) => {
  const [condOptions, setCondOptions] = useState<any[]>([]);
  const [valueOptions, setValueOptions] = useState<any[]>([]);
  const fieldCodeList = useMemo<string[]>(() => {
    return formValues.attrList?.map((item: any) => item.fieldCode) || [];
  }, [formValues.attrList]);

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
          <Form.Item name={[name, 'fieldCode']} rules={[{ required: true, message: '请选择属性' }]}>
            <Select placeholder="请选择" onChange={handleSelectChange} disabled={disabled}>
              {options.map((option) => (
                <Select.Option disabled={fieldCodeList.includes(option.code)} key={option.code} value={option.code}>
                  {option.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item className="ml10" name={[name, 'condiCode']} rules={[{ required: true, message: '请选择条件' }]}>
            <Select placeholder="请选择" disabled={disabled}>
              {condOptions.map((option) => (
                <Select.Option key={option.code} value={option.code}>
                  {option.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item className="ml10" name={[name, 'valueCode']} rules={[{ required: true, message: '请选择属性值' }]}>
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
