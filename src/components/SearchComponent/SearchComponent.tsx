import React, { useEffect } from 'react';

import { Form, DatePicker, Button, Input, Space, Select, Row, Cascader } from 'antd';
import style from './style.module.less';
import { CascaderOptionType, CascaderValueType } from 'antd/lib/cascader';
import { NamePath } from 'rc-field-form/lib/interface';
import classNames from 'classnames';

export interface OptionProps {
  id: string | number;
  name: string;
}
export interface SearchCol {
  type: 'input' | 'select' | 'date' | 'rangePicker' | 'cascader';
  name: string;
  label: string;
  width?: number | string;
  maxLength?: number;
  placeholder?: string | [string, string];
  options?: OptionProps[] | null;
  cascaderOptions?: any[];

  fieldNames?: {
    label: string;
    value: string;
    children: string;
  };
}

interface SearchComponentProps {
  searchCols: SearchCol[];
  isInline?: boolean;
  onSearch: (params: any) => void;
  onReset?: () => void;
  onValuesChange?: (changeValues: any, values: any) => void;
  loadData?: ((selectedOptions?: CascaderOptionType[] | undefined) => void) | undefined;
  onChangeOfCascader?:
    | ((value: CascaderValueType, selectedOptions?: CascaderOptionType[] | undefined) => void)
    | undefined;
  defaultValues?: any;
  className?: string;
}
const { RangePicker } = DatePicker;

const SearchComponent: React.FC<SearchComponentProps> = (props) => {
  const { searchCols, onSearch, onValuesChange, isInline = true, loadData, onChangeOfCascader, onReset } = props;
  const [from] = Form.useForm();
  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      onChangeOfCascader?.([''], []);
      onSearch({});
    }
  };
  // 对数据进行处理
  const onChange = (value: CascaderValueType, selectedOptions?: CascaderOptionType[] | undefined) => {
    if (selectedOptions) {
      const lastOption = selectedOptions[selectedOptions?.length - 1];
      const fields: NamePath[] = [];
      searchCols.forEach((item: { name: string }) => {
        if (item.name !== 'catalogIds') {
          fields.push(item.name);
        }
      });
      if (lastOption?.lastLevel === 1) {
        from.resetFields(fields);
      }
    }
    onChangeOfCascader?.(value, selectedOptions);
  };
  useEffect(() => {
    if (props.defaultValues?.catalogIds) {
      from.setFieldsValue({ catalogIds: props.defaultValues.catalogIds });
    }
  }, [props.defaultValues]);
  return (
    <>
      {isInline
        ? (
        <Form
          form={from}
          layout="inline"
          onFinish={onSearch}
          onReset={() => {
            handleReset();
          }}
          className={classNames(style['search-wrap'], [props.className])}
          onValuesChange={onValuesChange}
        >
          {searchCols?.map((col) => {
            return (
              (col.type === 'input' && (
                <Form.Item key={col.name} label={col.label} name={col.name}>
                  <Input
                    maxLength={col.maxLength || 50}
                    placeholder={col.placeholder as string}
                    style={{ width: col.width }}
                    allowClear
                  />
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
                  <RangePicker
                    format="YYYY-MM-DD"
                    style={{ width: '320px' }}
                    placeholder={col.placeholder as [string, string]}
                  />
                </Form.Item>
              )) ||
              (col.type === 'cascader' && (
                <Form.Item key={col.name} label={col.label} name={col.name}>
                  <Cascader
                    changeOnSelect
                    options={col.cascaderOptions}
                    fieldNames={{ ...col.fieldNames }}
                    loadData={(data) => {
                      loadData?.(data);
                    }}
                    style={{ width: col.width }}
                    onChange={onChange}
                  />
                </Form.Item>
              ))
            );
          })}

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" className={style.btnConfirm} shape="round">
                查询
              </Button>
              <Button htmlType="reset" type="primary" className={style.btnReset} shape="round" ghost>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
          )
        : (
        <Form
          form={from}
          onFinish={onSearch}
          onReset={handleReset}
          className={style.customLayout}
          onValuesChange={onValuesChange}
        >
          <Row>
            {searchCols?.slice(0, 2).map((col) => {
              return (
                (col.type === 'input' && (
                  <Form.Item key={col.name} label={col.label} name={col.name}>
                    <Input placeholder={col.placeholder} style={{ width: col.width }} allowClear />
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
          </Row>
          <Row>
            {searchCols?.slice(2).map((col) => {
              return (
                (col.type === 'input' && (
                  <Form.Item key={col.name} label={col.label} name={col.name}>
                    <Input placeholder={col.placeholder} style={{ width: col.width }} allowClear />
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
                <Button type="primary" htmlType="submit" className={style.btnConfirm} shape="round">
                  查询
                </Button>
                <Button htmlType="reset" type="primary" className={style.btnReset} shape="round" ghost>
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Row>
        </Form>
          )}
    </>
  );
};

export default React.memo(SearchComponent);
