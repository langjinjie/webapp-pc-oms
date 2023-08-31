import React, { useEffect } from 'react';
import { Button, Card, Form, Input, message } from 'antd';
import { BreadCrumbs, ImageUpload } from 'src/components';
import { requestAddOrUpdateActivityGoods, requestActivityPrizeDetail } from 'src/apis/marketingActivity';
import qs from 'qs';
import style from './style.module.less';

const { Item } = Form;
const { TextArea } = Input;

const AddPrize: React.FC = () => {
  const [form] = Form.useForm();

  const { goodsId } = qs.parse(location.search, { ignoreQueryPrefix: true }) || {};

  // 获取奖品详情
  const getDetail = async () => {
    console.log('获取奖品详情');
    const res = await requestActivityPrizeDetail({ goodsId });
    if (res) {
      console.log(res);
      form.setFieldsValue(res);
    }
  };

  const onFinish = async (values?: any) => {
    console.log('values', values);
    const res = await requestAddOrUpdateActivityGoods(values);
    if (res) {
      message.success(`奖品${goodsId ? '修改' : '新增'}成功`);
    }
  };

  useEffect(() => {
    if (goodsId) {
      getDetail();
    }
  }, []);
  return (
    <Card
      title={
        <>
          <BreadCrumbs
            className={style.breadCrumbs}
            navList={[{ path: '/prizeCenter', name: '奖品中心' }, { name: goodsId ? '修改奖品' : '新增奖品' }]}
          />
          新增奖品
        </>
      }
    >
      <Form form={form} onFinish={onFinish}>
        <Item name="goodsName" label="奖品名称">
          <Input className="width480" placeholder="请输入奖品名称，30字以内" />
        </Item>
        <Item name="googsImg" label="奖品图片">
          <ImageUpload />
        </Item>
        <Item name="goodsDesc" label="奖品说明">
          <TextArea className="width480" placeholder="请输入奖品说明，300字以内" />
        </Item>
        <Button className={style.submitBtn} type="primary" htmlType="submit" shape="round">
          {goodsId ? '修改' : '新增'}
        </Button>
      </Form>
    </Card>
  );
};
export default AddPrize;
