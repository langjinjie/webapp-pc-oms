/**
 * @name StepFour
 * @author Lester
 * @date 2021-12-23 16:45
 */
import React, { useEffect } from 'react';
import { Form, Input, Button, message, FormProps } from 'antd';
import classNames from 'classnames';
import { copy } from 'tenacity-tools';
import { FileUpload } from 'src/components';
import { queryCompanyInfo, saveCompanyInfo, updateCompanyStep } from 'src/apis/company';
import style from './style.module.less';

interface StepFourProps {
  corpId: string;
  nextStep: () => void;
  prevStep: () => void;
}

const { Item, useForm } = Form;

const StepFour: React.FC<StepFourProps> = ({ nextStep, prevStep, corpId }) => {
  const [form] = useForm();

  const formLayout: FormProps = {
    labelAlign: 'right',
    labelCol: { span: 2 },
    wrapperCol: { span: 8 }
  };

  const copyBtn = (name: string, label: string) => {
    return (
      <Button
        onClick={() => {
          const values: string = form.getFieldValue(name);
          if (values) {
            copy(values, false);
            message.success('复制成功');
          } else {
            message.warn('请输入' + label);
          }
        }}
      >
        复制
      </Button>
    );
  };

  const onNext = () => {
    updateCompanyStep({ corpId, opStep: 5 });
    nextStep();
  };

  const getCompanyInfo = async () => {
    const res: any = await queryCompanyInfo({ corpId, opStep: 4 });
    if (res) {
      form.setFieldsValue(res.corpWebapp);
    }
  };

  const onSave = async (values: any, nextFlag?: boolean) => {
    const res: any = await saveCompanyInfo({
      corpId,
      opStep: 4,
      corpWebapp: values
    });
    if (res) {
      if (nextFlag) {
        onNext();
      } else {
        message.success('保存成功');
        getCompanyInfo();
      }
    }
  };

  const saveAgentIdSecret = async () => {
    const values: any = await form.validateFields(['agentId', 'secret']);
    onSave(values);
  };

  useEffect(() => {
    getCompanyInfo();
  }, []);

  return (
    <Form form={form} {...formLayout} onFinish={(values: any) => onSave(values, true)}>
      <div className={style.desc}>·创建自建应用操作指引</div>
      <div className={style.warn}>*请记录secret、Token和EncodingAESkey，保存至腾银数据库，确保与企微后台信息一致</div>
      <div className={classNames(style.mainText, style.mb12)}>1.创建自建应用：</div>
      <div className={classNames(style.deputyText, style.mb30)}>应用管理-&gt; 自建-&gt; 创建自建应用</div>
      <div className={classNames(style.mainText, style.mb12)}>2.将Agentld、secret保存至后台</div>
      <Item name="agentId" label="AgentId" rules={[{ required: true, message: '请输入' }]}>
        <Input placeholder="请输入" />
      </Item>
      <Item
        name="secret"
        label="secret"
        rules={[{ required: true, message: '请输入' }]}
        extra={<Button onClick={saveAgentIdSecret}>保存</Button>}
      >
        <Input placeholder="请输入" />
      </Item>
      <div className={classNames(style.mainText, style.mb12)}>3.保存后获取机构应用主页URL</div>
      <Item
        name="homeUrl"
        label="URL"
        rules={[{ required: true, message: '请输入' }]}
        extra={copyBtn('homeUrl', 'URL')}
      >
        <Input placeholder="请输入" />
      </Item>
      <div className={classNames(style.mainText, style.mb12)}>4.设置接收事件服务器</div>
      <div className={classNames(style.deputyText, style.mb12)}>
        a.点击设置接收事件服务器，复制以下URL前往企微后台填写保存
      </div>
      <Item
        name="callBackUrl"
        label="URL"
        rules={[{ required: true, message: '请输入' }]}
        extra={copyBtn('callBackUrl', 'URL')}
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
      <div className={classNames(style.mainText, style.mb12)}>5.设置网页授权及JS-SDK</div>
      <div className={classNames(style.deputyText, style.mb12)}>a.设置可信域名，将后台生成可信域名配置进企业微信</div>
      <Item
        name="trustOAuthUrl"
        labelCol={{ span: 4 }}
        label="网页授权功能回调可信域名"
        rules={[{ required: true, message: '请输入' }]}
        extra={copyBtn('trustOAuthUrl', '网页授权功能回调可信域名')}
      >
        <Input placeholder="请输入" />
      </Item>
      <Item
        name="trustJSUrl"
        labelCol={{ span: 4 }}
        label="调用JS-SDK、跳转小程序可信域名"
        rules={[{ required: true, message: '请输入' }]}
        extra={copyBtn('trustJSUrl', '调用JS-SDK、跳转小程序可信域名')}
      >
        <Input placeholder="请输入" />
      </Item>
      <div className={classNames(style.deputyText, style.mb12)}>
        b.申请校验域名，下载校验文件并上传至后台保存-&gt; 保存成功后
      </div>
      <Item wrapperCol={{ offset: 2 }} name="checkFile" rules={[{ required: false, message: '请上传' }]}>
        <FileUpload extraData={{ corpId: corpId }} />
      </Item>
      <div className={classNames(style.mainText, style.mb12)}>6.客户联系API授权可调用应用</div>
      <div className={style.btnWrap}>
        <Button onClick={prevStep}>上一步</Button>
        <Button type="primary" htmlType="submit">
          下一步
        </Button>
      </div>
    </Form>
  );
};

export default StepFour;
