/**
 * @name StepTwo
 * @author Lester
 * @date 2021-12-23 15:44
 */
import React, { useEffect } from 'react';
import { Form, Input, Button, message, FormProps } from 'antd';
import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import { queryCompanyInfo, saveCompanyInfo, updateCompanyStep } from 'src/apis/company';
import style from './style.module.less';

interface StepTwoProps {
  corpId: string;
  nextStep: () => void;
  prevStep: () => void;
}

const { Item, useForm } = Form;

const StepTwo: React.FC<StepTwoProps> = ({ nextStep, prevStep, corpId }) => {
  const [form] = useForm();

  const formLayout: FormProps = {
    labelAlign: 'right',
    labelCol: { span: 2 },
    wrapperCol: { span: 8 }
  };

  const onNext = () => {
    updateCompanyStep({ corpId, opStep: 3 });
    nextStep();
  };

  const onSubmit = async (values: any) => {
    const res: any = await saveCompanyInfo({
      corpId,
      opStep: 2,
      corpContacts: values
    });
    if (res) {
      onNext();
    }
  };

  const getCompanyInfo = async () => {
    const res: any = await queryCompanyInfo({ corpId, opStep: 2 });
    if (res) {
      form.setFieldsValue(res.corpContacts);
    }
  };

  useEffect(() => {
    getCompanyInfo();
  }, []);

  return (
    <Form form={form} {...formLayout} onFinish={onSubmit}>
      <div className={style.desc}>
        ·以下企业信息可通过企业微信后台—我的企业—企业信息获取，注：此方式为通过API接口同步通讯录，
        <br />
        如果已经通过第三方应用同步通讯录，则需要先取消改同步方式，然后改成通过API接口进行同步
      </div>
      <div className={style.warn}>*请记录secret、Token和EncodingAESkey，保存至腾银数据库，确保与企微后台信息一致</div>
      <div className={classNames(style.mainText, style.mb12)}>1.权限设置：</div>
      <div className={classNames(style.deputyText, style.mb30)}>选择API编辑通讯录-&gt; 勾选开启手动编辑-&gt; 保存</div>
      <div className={classNames(style.mainText, style.mb12)}>2.将secret保存至后台</div>
      <Item name="secret" label="secret" rules={[{ required: true, message: '请输入' }]}>
        <Input placeholder="请输入" />
      </Item>
      <div className={classNames(style.mainText, style.mb12)}>3.设置接收事件服务器</div>
      <div className={classNames(style.deputyText, style.mb12)}>
        a.点击设置接收事件服务器，复制以下URL前往企微后台填写保存
      </div>
      <Item
        name="callBackUrl"
        label="URL"
        rules={[{ required: true, message: '请输入' }]}
        extra={
          <Button
            onClick={() => {
              const url: string = form.getFieldValue('callBackUrl');
              if (url) {
                copy(url);
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
      <Item name="encodingAesKey" label="EncodingAESkey" rules={[{ required: true, message: '请输入' }]}>
        <Input placeholder="请输入" />
      </Item>
      <div className={style.btnWrap}>
        <Button onClick={prevStep}>上一步</Button>
        <Button type="primary" htmlType="submit">
          下一步
        </Button>
        <span className={style.linkText} onClick={onNext}>
          跳过 》》
        </span>
      </div>
    </Form>
  );
};

export default StepTwo;
