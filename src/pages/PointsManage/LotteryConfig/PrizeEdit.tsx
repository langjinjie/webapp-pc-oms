/**
 * @name PrizeEdit
 * @author Lester
 * @date 2022-05-26 14:22
 */
import React, { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, message, Select, Space } from 'antd';
import classNames from 'classnames';
import { BreadCrumbs } from 'src/components';
import style from './style.module.less';
import NgUpload from 'src/pages/Marketing/Components/Upload/Upload';
import { RouteComponentProps } from 'react-router-dom';
import { editPrize, getGoodsExchangeDesc, queryPrizeDetail } from 'src/apis/pointsMall';
import { PrizeItem } from './LotteryConfig';
import { throttle } from 'src/utils/base';

interface State {
  goodsId: string;
  goodsType: number;
}
const PrizeEdit: React.FC<RouteComponentProps<any, any, State>> = ({ location, history }) => {
  const [editForm] = Form.useForm();
  const [detail, setDetail] = useState<PrizeItem>();
  const [exchangeDesc, setExchangeDesc] = useState<{ goodsType: number; exchangeDesc: string }[]>([]);
  const getDetail = async (goodsId: string) => {
    const res = await queryPrizeDetail({ goodsId });
    setDetail(res || {});
    editForm.setFieldsValue(res);
  };
  const getExchangeDesc = async () => {
    const res = (await getGoodsExchangeDesc({})) || [];
    setExchangeDesc(res);
  };
  useEffect(() => {
    const { goodsId } = location.state;
    if (goodsId) {
      getDetail(goodsId);
      getExchangeDesc();
    }
  }, []);

  const onFinish = throttle(async (values: any) => {
    const { name, imgUrl, totalStock, winWeight, exchangeDesc } = values;
    const res = await editPrize({
      goodsId: detail?.goodsId,
      name,
      imgUrl,
      goodsType: detail?.goodsType,
      totalStock,
      winWeight,
      exchangeDesc
    });
    if (res) {
      message.success('编辑成功');
      history.goBack();
    }
  }, 500);
  const onGoodsTypeChange = async (value: number) => {
    const currentDesc = exchangeDesc.filter((desc) => desc.goodsType === value)[0].exchangeDesc;
    editForm.setFieldsValue({
      exchangeDesc: currentDesc,
      winWeight: '',
      totalStock: ''
    });
    setDetail((detail) => ({ ...detail!, goodsType: value }));
  };
  return (
    <div className={classNames(style.prizeEdit, 'container')}>
      <BreadCrumbs navList={[{ name: '抽奖配置' }, { name: '奖品配置' }, { name: '奖品编辑' }]} />
      <Form
        form={editForm}
        className="edit mt30"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        onFinish={(values) => onFinish(values)}
      >
        <Form.Item label="奖品名称" name="name" rules={[{ required: true, message: '请输入奖品名称' }]}>
          <Input placeholder="请输入" className="width420" maxLength={100} />
        </Form.Item>
        <Form.Item
          rules={[{ required: true }]}
          name={'imgUrl'}
          label="奖品图片"
          extra="为确保最佳展示效果，请上传300*300像素透明底图片，大小不超过200k，仅支持.jpg格式"
        >
          <NgUpload showDeleteBtn></NgUpload>
        </Form.Item>
        <Form.Item label="奖品类型" name={'goodsType'} rules={[{ required: true }]}>
          <Select className="width240" disabled={detail?.goodsType === 1} onChange={onGoodsTypeChange}>
            <Select.Option value={1} disabled>
              大奖
            </Select.Option>
            <Select.Option value={2}>红包类 </Select.Option>
            <Select.Option value={3}>空气 </Select.Option>
            <Select.Option value={4}>物流类 </Select.Option>
          </Select>
        </Form.Item>
        {detail?.goodsType !== 1
          ? (
          <>
            {detail?.goodsType !== 3 && (
              <Form.Item
                name={'totalStock'}
                label="奖品库存"
                rules={[{ required: true }]}
                extra="件"
                className="customExtra"
              >
                <InputNumber className="width100" controls={false} max={999999999} />
              </Form.Item>
            )}

            <Form.Item rules={[{ required: true }]} name={'winWeight'} label="中奖权重">
              <InputNumber controls={false} className="width100" max={100} />
            </Form.Item>
          </>
            )
          : null}

        <Form.Item name={'exchangeDesc'} label="兑换流程说明" rules={[{ required: true }]}>
          <Input.TextArea maxLength={300} showCount placeholder="请输入" autoSize={{ minRows: 4 }} />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4 }} className="formFooter">
          <Space size={20} className="ml20">
            <Button
              type="primary"
              shape="round"
              ghost
              htmlType="reset"
              onClick={() => {
                history.goBack();
              }}
            >
              返回
            </Button>
            <Button type="primary" shape="round" htmlType="submit">
              保存
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PrizeEdit;
