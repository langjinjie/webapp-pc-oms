/**
 * @name StepThree
 * @author Lester
 * @date 2021-12-24 17:58
 */

import React from 'react';
import { Form, Input, Button, message, FormProps } from 'antd';
import classNames from 'classnames';
import { copy } from 'lester-tools';
import style from './style.module.less';

interface StepThreeProps {
  nextStep: () => void;
  prevStep: () => void;
}

const { Item, useForm } = Form;

const StepThree: React.FC<StepThreeProps> = ({ nextStep, prevStep }) => {
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
      <div className={style.desc}>
        ·以下企业信息可通过企业微信后台—我的企业—企业信息获取，注：此方式为通过API接口同步通讯录，
        <br />
        如果已经通过第三方应用同步通讯录，则需要先取消改同步方式，然后改成通过API接口进行同步
      </div>
      <div className={style.warn}>*请记录secret、Token和EncodingAESkey，保存至年高数据库，确保与企微后台信息一致</div>
      <div className={classNames(style.mainText, style.mb12)}>1.将客户联系secret保存至后台</div>
      <Item name="secret" label="secret" rules={[{ required: true, message: '请输入' }]}>
        <Input placeholder="请输入" />
      </Item>
      <div className={classNames(style.mainText, style.mb12)}>2.设置接收事件服务器</div>
      <div className={classNames(style.deputyText, style.mb12)}>
        a.点击设置接收事件服务器，复制以下URL前往企微后台填写保存
      </div>
      <Item
        name="url"
        label="URL"
        rules={[{ required: true, message: '请输入' }]}
        extra={
          <Button
            onClick={() => {
              const url: string = form.getFieldValue('url');
              if (url) {
                copy(url, false);
                message.success('复制成功');
              } else {
                message.warn('请输入URL');
              }
            }}
          >
            复制
          </Button>
        }
      >
        <Input placeholder="请输入" />
      </Item>
      <div className={classNames(style.deputyText, style.mb12)}>
        b.点击设置接收事件服务器-&gt; 随机获取以下参数 -&gt; 保存成功后再至企微后台保存{' '}
      </div>
      <Item name="token" label="Token" rules={[{ required: true, message: '请输入' }]}>
        <Input placeholder="请输入" />
      </Item>
      <Item name="encodingAESkey" label="EncodingAESkey" rules={[{ required: true, message: '请输入' }]}>
        <Input placeholder="请输入" />
      </Item>
      <div className={classNames(style.mainText, style.mb12)}>3.绑定微信开发者ID</div>
      <div className={style.btnWrap}>
        <Button onClick={prevStep}>上一步</Button>
        <Button type="primary" htmlType="submit" onClick={nextStep}>
          下一步
        </Button>
        <span className={style.linkText} onClick={nextStep}>
          跳过 》》
        </span>
      </div>
    </Form>
  );
};

export default StepThree;
