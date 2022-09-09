import React from 'react';
import { BreadCrumbs } from 'src/components';
import { Button, Form, InputNumber, DatePicker, Input, Select } from 'antd';
import style from './style.module.less';

// 时间限制
const periodTypeList = [
  { value: 1, name: '每日' },
  { value: 2, name: '每周' },
  { value: 3, name: '每月' }
];

const Edit: React.FC = () => {
  const { Item } = Form;
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const { Option } = Select;

  // 确认提交
  const onFinishHandle = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    console.log('values', values);
  };

  return (
    <div className={style.wrap}>
      <BreadCrumbs
        navList={[
          { path: '/pointsConfig', name: '打卡与奖励任务' },
          { path: '', name: '编辑' }
        ]}
      />
      <div className={style.header}>
        <div className={style.title}>编辑打卡任务</div>
        <Button className={style.sumbit} type="primary" onClick={onFinishHandle}>
          确认
        </Button>
      </div>
      <div className={style.desc}>任务说明：【朋友圈】客户经理发送</div>
      <Form className={style.form} form={form} layout="horizontal">
        <Item required name="sort" label="A端展示排序：">
          <InputNumber placeholder="请输入" className={style.inputNum} controls={false} />
        </Item>
        <Item required name="effectiveTime" label="生效时间">
          <DatePicker />
        </Item>
        <Item required name="taskName" label="任务名称">
          <Input placeholder="请输入" className={style.input} showCount />
        </Item>
        <Item required name="taskDesc" label="任务描述">
          <Input placeholder="请输入" className={style.input} showCount />
        </Item>
        <Item required name="taskDetail" label="详细说明">
          <TextArea className={style.textArea} showCount />
        </Item>
        <Item required label="奖励分值">
          <Item name="taskPoints" noStyle>
            <InputNumber className={style.inputNum} controls={false} />
          </Item>
          <span className={style.unit}>分</span>
        </Item>
        <Item required label="积分上限">
          <Item name="maxPoints" noStyle>
            <InputNumber className={style.inputNum} controls={false} />
          </Item>
          <span className={style.unit}>分</span>
        </Item>
        <Item required name="periodType" label="时间限制">
          <Select className={style.select}>
            {periodTypeList.map((typeItem) => (
              <Option key={typeItem.value} value={typeItem.value}>
                {typeItem.name}
              </Option>
            ))}
          </Select>
        </Item>
        <Item required name="businessModel" label="业务模式">
          <Select className={style.select}>
            {periodTypeList.map((typeItem) => (
              <Option key={typeItem.value} value={typeItem.value}>
                {typeItem.name}
              </Option>
            ))}
          </Select>
        </Item>
      </Form>
    </div>
  );
};
export default Edit;
