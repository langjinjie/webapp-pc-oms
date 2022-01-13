/**
 * @name StepOne
 * @author Lester
 * @date 2021-12-23 14:17
 */
import React, { useEffect } from 'react';
import { Form, Input, Select, Button, FormProps } from 'antd';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { queryCompanyInfo, saveCompanyInfo, updateCompanyStep } from 'src/apis/company';
import style from './style.module.less';

interface StepOneProps {
  corpId: string;
  nextStep: () => void;
}

const { Item, useForm } = Form;
const { Option } = Select;

const StepOne: React.FC<StepOneProps> = ({ nextStep, corpId }) => {
  const [form] = useForm();
  const history = useHistory();

  const formLayout: FormProps = {
    labelAlign: 'right',
    labelCol: { span: 2 },
    wrapperCol: { span: 8 }
  };

  const types: string[] = ['企业', '政府以及事业单位', '其他组织', '团队号'];

  const onSubmit = async (values: any) => {
    history.replace('/company/access', { corpId: values.corpId });
    const res: any = await saveCompanyInfo({
      corpId,
      opStep: 1,
      corpInfo: values
    });
    if (res) {
      if (corpId) {
        updateCompanyStep({ corpId, opStep: 2 });
        nextStep();
      } else {
        await updateCompanyStep({ corpId, opStep: 2 });
        history.replace('/company/access', { corpId: values.corpId });
      }
    }
  };

  const getCompanyInfo = async () => {
    const res: any = await queryCompanyInfo({ corpId, opStep: 1 });
    if (res) {
      form.setFieldsValue(res.corpInfo);
    }
  };

  useEffect(() => {
    corpId && getCompanyInfo();
  }, []);

  return (
    <Form form={form} {...formLayout} onFinish={onSubmit}>
      <div className={classNames(style.desc, style.mb30)}>·以下企业信息可通过企业微信后台—我的企业—企业信息获取</div>
      <Item name="corpFullName" label="企业全称" rules={[{ required: true, message: '请输入企业全称' }]}>
        <Input placeholder="请输入" />
      </Item>
      <Item name="corpName" label="企业简称">
        <Input placeholder="请输入" />
      </Item>
      <Item name="subjectType" label="主体类型">
        <Select placeholder="请选择">
          {types.map((val: string, index: number) => (
            <Option value={index + 1} key={val}>
              {val}
            </Option>
          ))}
        </Select>
      </Item>
      <Item name="corpIndustry" label="行业类型">
        <Input placeholder="请输入" />
      </Item>
      <Item
        name="corpScale"
        label="人员规模"
        rules={[{ validateTrigger: 'onBlur', pattern: /^[1-9]{1}\d+$/, message: '请输入正整数' }]}
      >
        <Input placeholder="请输入" />
      </Item>
      <Item name="corpId" label="企业ID" rules={[{ required: true, message: '请输入企业ID' }]}>
        <Input disabled={!!corpId} placeholder="请输入" />
      </Item>
      <Item name="location" label="企业地址">
        <Input placeholder="请输入" />
      </Item>
      <div className={style.btnWrap}>
        <Button type="primary" htmlType="submit">
          下一步
        </Button>
      </div>
    </Form>
  );
};

export default StepOne;
