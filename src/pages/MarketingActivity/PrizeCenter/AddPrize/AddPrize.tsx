import React from 'react';
import { Button, Card, DatePicker, Form, Input } from 'antd';
import { BreadCrumbs, ImageUpload } from 'src/components';
import style from './style.module.less';

const { Item } = Form;
const { TextArea } = Input;

const AddPrize: React.FC = () => {
  const [form] = Form.useForm();

  const onValuesChange = (values?: any) => {
    console.log('values', values);
  };
  return (
    <Card
      title={
        <>
          <BreadCrumbs
            className={style.breadCrumbs}
            navList={[{ path: '/prizeCenter', name: '奖品中心' }, { name: '新增奖品' }]}
          />
          新增奖品
        </>
      }
    >
      <Form form={form} onValuesChange={onValuesChange}>
        <Item name="奖品名称" label="奖品名称">
          <Input className="width480" placeholder="请输入奖品名称，30字以内" />
        </Item>
        <Item name="奖品图片" label="奖品图片">
          <ImageUpload />
        </Item>
        <Item name="奖品说明" label="奖品说明">
          <TextArea className="width480" placeholder="请输入奖品说明，300字以内" />
        </Item>
        <Item name="过期时间" label="过期时间">
          <DatePicker />
        </Item>
        <Button className={style.submitBtn} type="primary" htmlType="submit" shape="round">
          新增
        </Button>
      </Form>
    </Card>
  );
};
export default AddPrize;
