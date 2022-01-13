/**
 * @name StepFive
 * @author Lester
 * @date 2021-12-24 18:05
 */
import React, { useEffect } from 'react';
import { Form, Button, FormProps } from 'antd';
import { ImageUpload } from 'src/components';
import { queryCompanyInfo, saveCompanyInfo, updateCompanyStep } from 'src/apis/company';
import style from './style.module.less';

interface StepFiveProps {
  corpId: string;
  nextStep: () => void;
  prevStep: () => void;
}

const { Item, useForm } = Form;

const StepFive: React.FC<StepFiveProps> = ({ nextStep, prevStep, corpId }) => {
  const [form] = useForm();

  const formLayout: FormProps = {
    labelAlign: 'right',
    labelCol: { span: 2 },
    wrapperCol: { span: 8 }
  };

  const imgDesc = '为确保最佳展示效果，请上传132*132像素高清图片，仅支持.png/.jpg格式';

  const onNext = () => {
    updateCompanyStep({ corpId, opStep: 6 });
    nextStep();
  };

  const onSubmit = async (values: any) => {
    const res: any = await saveCompanyInfo({
      corpId,
      opStep: 5,
      corpLogo: values
    });
    if (res) {
      onNext();
    }
  };

  const getCompanyInfo = async () => {
    const res: any = await queryCompanyInfo({ corpId, opStep: 5 });
    if (res) {
      form.setFieldsValue(res.corpLogo);
    }
  };

  useEffect(() => {
    getCompanyInfo();
  }, []);

  return (
    <Form form={form} {...formLayout} onFinish={onSubmit}>
      <Item
        className={style.imgItem}
        name="corpPhotoLogoUrl"
        label="企业logo"
        rules={[{ required: true, message: '请上传企业logo' }]}
        extra={imgDesc}
      >
        <ImageUpload />
      </Item>
      <Item
        className={style.imgItem}
        name="corpSelfUploadSmallLogoUrl"
        label="名片logo"
        rules={[{ required: true, message: '请上传名片logo' }]}
        extra={imgDesc}
      >
        <ImageUpload />
      </Item>
      <Item
        className={style.imgItem}
        name="corpSelfUploadLogoUrl"
        label="管理平台logo"
        rules={[{ required: true, message: '请上传管理平台logo' }]}
        extra={imgDesc}
      >
        <ImageUpload />
      </Item>
      <Item
        className={style.imgItem}
        name="corpWhiteCompleteLogoUrl"
        label="白色logo"
        rules={[{ required: true, message: '请上传白色logo' }]}
        extra={imgDesc}
      >
        <ImageUpload />
      </Item>
      <div className={style.btnWrap}>
        <Button onClick={prevStep}>上一步</Button>
        <Button type="primary" htmlType="submit">
          下一步
        </Button>
      </div>
    </Form>
  );
};

export default StepFive;
