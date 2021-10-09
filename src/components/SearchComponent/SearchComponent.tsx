import React from 'react';

import { Form, DatePicker, Button, Input, Space, Select } from 'antd';
import style from './style.module.less';

export interface OptionProps {
  id: string;
  name: string;
}
export interface searchCol {
  type: 'input' | 'select' | 'date' | 'rangePicker';
  name: string;
  label: string;
  width?: number;
  placeholder?: string;
  options?: OptionProps[] | null;
}

interface SearchComponentProps {
  searchCols: searchCol[];
  onSearch: (params: any) => void;
  onValuesChange: (changeValues: any, value: any) => void;
}
const { RangePicker } = DatePicker;
const SearchComponent: React.FC<SearchComponentProps> = (props) => {
  const { searchCols, onSearch, onValuesChange } = props;
  const [from] = Form.useForm();
  return (
    <Form
      form={from}
      layout="inline"
      onFinish={onSearch}
      onReset={onSearch}
      className={style['search-wrap']}
      onValuesChange={onValuesChange}
    >
      {searchCols?.map((col) => {
        return (
          (col.type === 'input' && (
            <Form.Item key={col.name} label={col.label} name={col.name}>
              <Input placeholder={col.placeholder} width={col.width} />
            </Form.Item>
          )) ||
          (col.type === 'select' && (
            <Form.Item key={col.name} label={col.label} name={col.name}>
              <Select placeholder="请选择" allowClear style={{ width: col.width }}>
                {col.options &&
                  col.options.map((option) => (
                    <Select.Option key={option.id} value={option.id}>
                      {option.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          )) ||
          (col.type === 'rangePicker' && (
            <Form.Item key={col.name} label={col.label} name={col.name}>
              <RangePicker format="YYYY-MM-DD" />
            </Form.Item>
          ))
        );
      })}
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button htmlType="reset">重置</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default React.memo(SearchComponent);
