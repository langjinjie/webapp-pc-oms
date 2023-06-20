import { Button, Form, Select } from 'antd';
import classNames from 'classnames';
import React from 'react';

import style from './style.module.less';

interface FilterClientAttrProps {
  name: number;
  remove?: () => void;
}
const FilterClientAttr: React.FC<FilterClientAttrProps> = ({ name, remove }) => {
  return (
    <div className={classNames('flex', style.wrap)}>
      <Form.Item name={[name, 'fieldCode']}>
        <Select placeholder="请选择"></Select>
      </Form.Item>
      <Form.Item className="ml10" name={[name, 'condiCode']}>
        <Select placeholder="请选择"></Select>
      </Form.Item>
      <Form.Item className="ml10" name={[name, 'valueCode']}>
        <Select placeholder="请选择"></Select>
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
