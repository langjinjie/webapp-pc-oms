import React, { useEffect, MutableRefObject, useImperativeHandle, Key } from 'react';

import { Form, DatePicker, Button, Input, Space, Select, Row, Cascader, InputNumber } from 'antd';
import style from './style.module.less';
import { DefaultOptionType } from 'antd/lib/cascader';
import { NamePath } from 'rc-field-form/lib/interface';
import classNames from 'classnames';
import { Moment } from 'moment';

export interface OptionProps {
  id: Key;
  name: string;
  [prop: string]: any;
}
export interface SearchCol {
  type: 'input' | 'select' | 'date' | 'rangePicker' | 'cascader' | 'custom' | 'inputNumber';
  name: string;
  label: string;
  width?: number | string;
  maxLength?: number;
  placeholder?: string | [string, string];
  options?: OptionProps[] | null;
  cascaderOptions?: any[];
  selectNameKey?: string;
  selectValueKey?: string;
  customNode?: React.ReactNode;
  fieldNames?: {
    label: string;
    value: string;
    children: string;
  };
}

type SingleValueType = (string | number)[];
interface SearchComponentProps {
  searchCols: SearchCol[];
  isInline?: boolean;
  firstRowChildCount?: number;
  onSearch: (params: any) => void;
  onReset?: () => void;
  onValuesChange?: (changeValues: any, values: any) => void;
  loadData?: ((selectedOptions?: DefaultOptionType[] | undefined) => void) | undefined;
  onChangeOfCascader?:
    | ((value: SingleValueType, selectedOptions?: DefaultOptionType[] | undefined) => void)
    | undefined;
  defaultValues?: any;
  className?: string;
  hideReset?: boolean;
  children?: React.ReactNode;
  searchRef?: MutableRefObject<any>;
}
const { RangePicker } = DatePicker;

const SearchComponent: React.FC<SearchComponentProps> = (props) => {
  const {
    searchCols,
    onSearch,
    onValuesChange,
    isInline = true,
    loadData,
    onChangeOfCascader,
    onReset,
    firstRowChildCount,
    hideReset,
    searchRef
  } = props;
  const [searchForm] = Form.useForm();
  const handleReset = () => {
    const values = searchForm.getFieldsValue();
    if (onReset) {
      onReset();
    } else {
      onChangeOfCascader?.([''], []);
      onSearch(values);
    }
  };
  // 对数据进行处理
  const onChange = (value: SingleValueType, selectedOptions?: DefaultOptionType[] | undefined) => {
    if (selectedOptions) {
      const lastOption = selectedOptions[selectedOptions?.length - 1];
      const fields: NamePath[] = [];
      searchCols.forEach((item: { name: string }) => {
        if (item.name !== 'catalogIds') {
          fields.push(item.name);
        }
      });
      if (lastOption?.lastLevel === 1) {
        searchForm.resetFields(fields);
      }
    }
    onChangeOfCascader?.(value, selectedOptions);
  };

  useImperativeHandle(searchRef, () => ({
    handleReset: () => {
      searchForm.resetFields();
    }
  }));
  useEffect(() => {
    if (props.defaultValues?.catalogIds) {
      searchForm.setFieldsValue({ catalogIds: props.defaultValues.catalogIds, ...props.defaultValues });
    }
  }, [props.defaultValues]);
  const handleFinish = (values: any) => {
    // const {} = values;
    const rangePickerName = searchCols.filter((col) => col.type === 'rangePicker')[0]?.name;
    if (rangePickerName) {
      const rangePickerData: [Moment, Moment] = values[rangePickerName];
      if (rangePickerData?.length > 0) {
        const beginTime = rangePickerData[0].startOf('day').format('YYYY-MM-DD HH:mm:ss');
        const endTime = rangePickerData[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');
        values.beginTime = beginTime;
        values.endTime = endTime;
      }
    }

    onSearch(values);
  };
  return (
    <>
      {isInline
        ? (
        <Form
          form={searchForm}
          layout="inline"
          onFinish={handleFinish}
          onReset={handleReset}
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
              (col.type === 'inputNumber' && (
                <Form.Item key={col.name} label={col.label} name={col.name}>
                  <InputNumber
                    type={'number'}
                    max={col.maxLength}
                    placeholder={col.placeholder as string}
                    style={{ width: col.width }}
                    controls={false}
                  />
                </Form.Item>
              )) ||
              (col.type === 'select' && (
                <Form.Item key={col.name} label={col.label} name={col.name}>
                  <Select placeholder="请选择" allowClear style={{ width: col.width }}>
                    {col.options &&
                      col.options.map((option) => (
                        <Select.Option
                          key={option[col.selectValueKey!] || option.id}
                          value={option[col.selectValueKey!] || option.id}
                        >
                          {option[col.selectNameKey || 'name']}
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
              )) ||
              (col.type === 'date' && (
                <Form.Item key={col.name} label={col.label} name={col.name}>
                  <DatePicker format="YYYY-MM-DD" />
                </Form.Item>
              )) ||
              (col.type === 'custom' && col.customNode)
            );
          })}
          {props.children}

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" className={style.btnConfirm} shape="round">
                查询
              </Button>
              {!hideReset && (
                <Button htmlType="reset" type="primary" className={style.btnReset} shape="round" ghost>
                  重置
                </Button>
              )}
            </Space>
          </Form.Item>
        </Form>
          )
        : (
        <Form
          form={searchForm}
          onFinish={handleFinish}
          onReset={handleReset}
          className={style.customLayout}
          onValuesChange={onValuesChange}
        >
          <Row>
            {searchCols?.slice(0, firstRowChildCount || 2).map((col) => {
              return (
                (col.type === 'input' && (
                  <Form.Item key={col.name} label={col.label} name={col.name}>
                    <Input placeholder={col.placeholder as string} style={{ width: col.width }} allowClear />
                  </Form.Item>
                )) ||
                (col.type === 'inputNumber' && (
                  <Form.Item key={col.name} label={col.label} name={col.name}>
                    <InputNumber
                      type={'number'}
                      max={col.maxLength}
                      placeholder={col.placeholder as string}
                      style={{ width: col.width }}
                      controls={false}
                    />
                  </Form.Item>
                )) ||
                (col.type === 'select' && (
                  <Form.Item key={col.name} label={col.label} name={col.name}>
                    <Select placeholder="请选择" allowClear style={{ width: col.width }}>
                      {col.options &&
                        col.options.map((option) => (
                          <Select.Option
                            key={option[col.selectValueKey!] || option.id}
                            value={option[col.selectValueKey!] || option.id}
                          >
                            {option[col.selectNameKey || 'name']}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                )) ||
                (col.type === 'rangePicker' && (
                  <Form.Item key={col.name} label={col.label} name={col.name}>
                    <RangePicker format="YYYY-MM-DD" />
                  </Form.Item>
                )) ||
                (col.type === 'date' && (
                  <Form.Item key={col.name} label={col.label} name={col.name}>
                    <DatePicker format="YYYY-MM-DD" />
                  </Form.Item>
                )) ||
                (col.type === 'custom' && col.customNode)
              );
            })}
          </Row>
          <Row>
            {searchCols?.slice(firstRowChildCount || 2).map((col) => {
              return (
                (col.type === 'input' && (
                  <Form.Item key={col.name} label={col.label} name={col.name}>
                    <Input placeholder={col.placeholder as string} style={{ width: col.width }} allowClear />
                  </Form.Item>
                )) ||
                (col.type === 'inputNumber' && (
                  <Form.Item key={col.name} label={col.label} name={col.name}>
                    <InputNumber
                      type={'number'}
                      max={col.maxLength}
                      placeholder={col.placeholder as string}
                      style={{ width: col.width }}
                      controls={false}
                    />
                  </Form.Item>
                )) ||
                (col.type === 'select' && (
                  <Form.Item key={col.name} name={col.name} label={col.label}>
                    <Select placeholder="请选择" allowClear style={{ width: col.width }}>
                      {col.options &&
                        col.options.map((option) => (
                          <Select.Option
                            key={option[col.selectValueKey!] || option.id}
                            value={option[col.selectValueKey!] || option.id}
                          >
                            {option[col.selectNameKey || 'name']}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                )) ||
                (col.type === 'rangePicker' && (
                  <Form.Item key={col.name} label={col.label} name={col.name}>
                    <RangePicker format="YYYY-MM-DD" />
                  </Form.Item>
                )) ||
                (col.type === 'date' && (
                  <Form.Item key={col.name} label={col.label} name={col.name}>
                    <DatePicker format="YYYY-MM-DD" />
                  </Form.Item>
                )) ||
                (col.type === 'custom' && col.customNode)
              );
            })}
            {props.children}
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" className={style.btnConfirm} shape="round">
                  查询
                </Button>
                {!hideReset && (
                  <Button htmlType="reset" type="primary" className={style.btnReset} shape="round" ghost>
                    重置
                  </Button>
                )}
              </Space>
            </Form.Item>
          </Row>
        </Form>
          )}
    </>
  );
};

export default React.memo(SearchComponent);
