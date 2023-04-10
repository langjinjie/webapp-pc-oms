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
    },
    setFieldsValue: (values: any) => {
      searchForm.setFieldsValue(values);
    }
  }));
  useEffect(() => {
    if (props.defaultValues?.catalogIds) {
      searchForm.setFieldsValue({ catalogIds: props.defaultValues.catalogIds, ...props.defaultValues });
    }
  }, [props.defaultValues]);

  /**
   * 日期格式化
   */
  const dateValueFormat = (values: any) => {
    const rangePickers = searchCols.filter((col) => col.type === 'rangePicker');
    if (rangePickers.length > 0) {
      rangePickers.forEach((rangePicker) => {
        const rangePickerName = rangePicker.name;
        if (rangePickerName) {
          const rangePickerNames = rangePickerName.split('-');
          const rangePickerData: [Moment, Moment] = values[rangePickerName];
          if (rangePickerData?.length > 0) {
            const beginTime = rangePickerData[0].startOf('day').format('YYYY-MM-DD HH:mm:ss');
            const endTime = rangePickerData[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');

            if (rangePickerNames.length > 1) {
              values[rangePickerNames[0]] = beginTime;
              values[rangePickerNames[1]] = endTime;
            }
          } else {
            values[rangePickerNames[0]] = undefined;
            values[rangePickerNames[1]] = undefined;
          }
        }
        delete values[rangePickerName];
      });
    }

    const dates = searchCols.filter((col) => col.type === 'date');
    if (dates.length > 0) {
      dates.forEach((date) => {
        const dateName = date.name;
        if (dateName) {
          const dateMoment: Moment = values[dateName];
          values[dateName] = dateMoment?.format('YYYY-MM-DD') || undefined;
        }
      });
    }

    return values;
  };
  const handleFinish = (values: any) => {
    onSearch(dateValueFormat(values));
  };

  const handleReset = () => {
    const values = searchForm.getFieldsValue();
    if (onReset) {
      onReset();
    } else {
      onChangeOfCascader?.([''], []);
      onSearch(dateValueFormat(values));
    }
  };

  const handleValuesChange = (changedValues: any, values: any) => {
    onValuesChange?.(changedValues, dateValueFormat(values));
  };
  return (
    <>
      {isInline
        ? (
        <Form
          ref={searchRef}
          form={searchForm}
          layout="inline"
          onFinish={handleFinish}
          onReset={handleReset}
          className={classNames(style['search-wrap'], [props.className])}
          onValuesChange={handleValuesChange}
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
          onValuesChange={handleValuesChange}
          className={classNames(style.customLayout, props.className)}
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
