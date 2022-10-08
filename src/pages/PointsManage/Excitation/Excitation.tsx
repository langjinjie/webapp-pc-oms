import React from 'react';
import { Button, Form, Input, DatePicker, Select } from 'antd';
import style from './style.module.less';

const Excitation: React.FC = () => {
  const [form] = Form.useForm();
  const { Item } = Form;
  const { RangePicker } = DatePicker;
  const { Option } = Select;
  const options = [
    { value: 0, label: '未上架' },
    { value: 1, label: '已上架' },
    { value: 2, label: '已下架' }
  ];
  return (
    <div className={style.wrap}>
      <Button type="primary" className={style.addExcitation}>
        创建激励任务
      </Button>
      <Form form={form} className={style.form} layout="inline">
        <Item label="任务名称：">
          <Input className={style.textInput} placeholder="请输入" />
        </Item>
        <Item label="任务时间：">
          <RangePicker className={style.rangePicker} />
        </Item>
        <Item label="任务状态：">
          <Select className={style.select}>
            {options.map((mapItem) => (
              <Option key={mapItem.value}>{mapItem.label}</Option>
            ))}
          </Select>
        </Item>
        <Button className={style.submitBtn} htmlType="submit">
          查询
        </Button>
        <Button className={style.resetBtn} htmlType="reset">
          重置
        </Button>
      </Form>
    </div>
  );
};
export default Excitation;
