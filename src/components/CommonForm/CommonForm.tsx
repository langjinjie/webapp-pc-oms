/**
 * @name Form
 * @author Lester
 * @date 2021-11-05 16:22
 */
import React from 'react';
import { Form, Input, Select, DatePicker, Button, FormProps, FormItemProps } from 'antd';
import { DataItem, ItemDataProps, ItemProps } from 'src/utils/interface';
import style from './style.module.less';

interface CommonFormProps extends FormProps {
  onSubmit: (values: any) => void;
  itemProps?: FormItemProps;
  itemData: ItemProps[];
}

const { Item, useForm } = Form;
const { RangePicker } = DatePicker;
const { Option } = Select;

const CommonForm: React.FC<CommonFormProps> = ({ onSubmit, itemProps, itemData, ...formProps }) => {
  const [form] = useForm();

  const itemRender = ({ type, dataSource = [], placeholder }: ItemDataProps) => {
    switch (type) {
      case 'input':
        return <Input placeholder={placeholder || '请输入'} allowClear />;
      case 'select':
        return (
          <Select placeholder={placeholder || '请选择'} allowClear>
            {dataSource.map((item: DataItem) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        );
      case 'rangePicker':
        return <RangePicker />;
      case 'datePicker':
        return <DatePicker placeholder={placeholder || '请选择日期'} />;
      default:
        return null;
    }
  };

  return (
    <Form
      form={form}
      layout="inline"
      onFinish={onSubmit}
      onReset={() => onSubmit({})}
      {...formProps}
      className={style.formWrap}
    >
      {itemData.map(({ name, label, ...item }) => (
        <Item key={name} {...itemProps} name={name} label={label}>
          {itemRender(item)}
        </Item>
      ))}
      <Item>
        <Button htmlType="submit" type="primary">
          查询
        </Button>
        <Button htmlType="reset">重置</Button>
      </Item>
    </Form>
  );
};

export default CommonForm;
