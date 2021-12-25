/**
 * @name StepFive
 * @author Lester
 * @date 2021-12-24 18:05
 */
import React from 'react';
import { Form, Button, FormProps } from 'antd';
import { ImageUpload } from 'src/components';
import style from './style.module.less';

interface StepFiveProps {
  nextStep: () => void;
  prevStep: () => void;
}

const { Item, useForm } = Form;

const StepFive: React.FC<StepFiveProps> = ({ nextStep, prevStep }) => {
  const [form] = useForm();

  const formLayout: FormProps = {
    labelAlign: 'right',
    labelCol: { span: 2 },
    wrapperCol: { span: 8 }
  };

  const imgDesc = '为确保最佳展示效果，请上传132*132像素高清图片，仅支持.png/.jpg格式';

  const onSubmit = (values: any) => {
    console.log(values);
  };

  return (
    <Form form={form} {...formLayout} onFinish={onSubmit}>
      <Item
        className={style.imgItem}
        name="corpLogo"
        label="企业logo"
        rules={[{ required: true, message: '请上传企业logo' }]}
        extra={imgDesc}
      >
        <ImageUpload />
      </Item>
      <Item
        className={style.imgItem}
        name="cardLogo"
        label="名片logo"
        rules={[{ required: true, message: '请上传名片logo' }]}
        extra={imgDesc}
      >
        <ImageUpload />
      </Item>
      <Item
        className={style.imgItem}
        name="manageLogo"
        label="管理平台logo"
        rules={[{ required: true, message: '请上传管理平台logo' }]}
        extra={imgDesc}
      >
        <ImageUpload />
      </Item>
      <Item
        className={style.imgItem}
        name="whiteLogo"
        label="白色logo"
        rules={[{ required: true, message: '请上传白色logo' }]}
        extra={imgDesc}
      >
        <ImageUpload />
      </Item>
      <div className={style.btnWrap}>
        <Button onClick={prevStep}>上一步</Button>
        <Button type="primary" htmlType="submit" onClick={nextStep}>
          下一步
        </Button>
      </div>
    </Form>
  );
};

export default StepFive;
