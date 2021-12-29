/**
 * @name StepOne
 * @author Lester
 * @date 2021-12-23 14:17
 */
import React from 'react';
import { Form, Input, Button, FormProps } from 'antd';
import classNames from 'classnames';
import style from './style.module.less';

interface StepOneProps {
  nextStep: () => void;
}

const { Item, useForm } = Form;

const StepOne: React.FC<StepOneProps> = ({ nextStep }) => {
  const [form] = useForm();

  const formLayout: FormProps = {
    labelAlign: 'right',
    labelCol: { span: 2 },
    wrapperCol: { span: 8 }
  };

  const onSubmit = (values: any) => {
    console.log(values);
  };

  return (
    <Form form={form} {...formLayout} onFinish={onSubmit}>
      <div className={classNames(style.desc, style.mb30)}>·以下企业信息可通过企业微信后台—我的企业—企业信息获取</div>
      <Item name="corpFullName" label="企业全称" rules={[{ required: true, message: '请输入企业全称' }]}>
        <Input placeholder="请输入" />
      </Item>
      <Item name="corpSimpleName" label="企业简称">
        <Input placeholder="请输入" />
      </Item>
      <Item name="corpType" label="主体类型">
        <Input placeholder="请输入" />
      </Item>
      <Item name="industryType" label="行业类型">
        <Input placeholder="请输入" />
      </Item>
      <Item
        name="staffSize"
        label="人员规模"
        rules={[{ validateTrigger: 'onBlur', pattern: /^[1-9]{1}\d+$/, message: '请输入正整数' }]}
      >
        <Input placeholder="请输入" />
      </Item>
      <Item name="corpId" label="企业ID" rules={[{ required: true, message: '请输入企业ID' }]}>
        <Input placeholder="请输入" />
      </Item>
      <Item name="corpAddress" label="企业地址">
        <Input placeholder="请输入" />
      </Item>
      <div className={style.btnWrap}>
        <Button type="primary" htmlType="submit" onClick={nextStep}>
          下一步
        </Button>
      </div>
    </Form>
  );
};

export default StepOne;
