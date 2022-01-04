/**
 * @name StepSix
 * @author Lester
 * @date 2021-12-24 18:28
 */
import React from 'react';
import { Form, Input, Button, DatePicker, FormProps } from 'antd';
import classNames from 'classnames';
import style from './style.module.less';

interface StepSixProps {
  nextStep: () => void;
  prevStep: () => void;
}

const { Item, useForm } = Form;

const StepSix: React.FC<StepSixProps> = ({ nextStep, prevStep }) => {
  const [form] = useForm();

  const formLayout: FormProps = {
    labelAlign: 'right',
    wrapperCol: { span: 5 }
  };

  const emailValidator = (rule: any, value: string) => {
    const res = (value || '')
      .split(';')
      .every((val: string) => !val || /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+\.([a-zA-Z0-9_-]|\.)*(com|cn)$/.test(val));
    if (res) {
      return Promise.resolve();
    } else {
      return Promise.reject(new Error('请输入正确格式的邮箱'));
    }
  };

  const onSubmit = (values: any) => {
    console.log(values);
  };

  return (
    <Form form={form} {...formLayout} onFinish={onSubmit} className={style.sixWrap}>
      <div className={classNames(style.mainText, style.mb12)}>1.设置机构账号数</div>
      <div className={classNames(style.deputyText, style.mb12)}>
        设置上限数后，如机构使用人数达到设置上限，则超出部分员工不能正常使用
      </div>
      <Item name="count" rules={[{ required: true, message: '请输入' }]} extra="/人">
        <Input placeholder="请输入" />
      </Item>
      <div className={classNames(style.mainText, style.mb12)}>2.设置应用到期时间</div>
      <div className={classNames(style.deputyText, style.mb12)}>设置到期日后，过期不能正常访问应用</div>
      <Item name="date" rules={[{ required: true, message: '请选择' }]}>
        <DatePicker />
      </Item>
      <div className={classNames(style.mainText, style.mb12)}>3.到期提醒接收人员（年高管理员）</div>
      <Item
        name="email"
        rules={[
          { required: true, message: '请输入' },
          {
            validateTrigger: 'onBlur',
            validator: emailValidator
          }
        ]}
      >
        <Input placeholder="请输入邮箱，多个英文分号隔开" />
      </Item>
      <div className={style.btnWrap}>
        <Button onClick={prevStep}>上一步</Button>
        <Button type="primary" htmlType="submit" onClick={nextStep}>
          保存
        </Button>
      </div>
    </Form>
  );
};

export default StepSix;
