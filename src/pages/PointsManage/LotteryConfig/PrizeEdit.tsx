/**
 * @name PrizeEdit
 * @author Lester
 * @date 2022-05-26 14:22
 */
import React, { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, message, Space } from 'antd';
import classNames from 'classnames';
import { BreadCrumbs } from 'src/components';
import style from './style.module.less';
import NgUpload from 'src/pages/Marketing/Components/Upload/Upload';
import { RouteComponentProps } from 'react-router-dom';
import { editPrize, queryPrizeDetail } from 'src/apis/pointsMall';
import { PrizeItem } from './LotteryConfig';
import { throttle } from 'src/utils/base';

interface State {
  goodsId: string;
  goodsType: number;
}
const PrizeEdit: React.FC<RouteComponentProps<any, any, State>> = ({ location, history }) => {
  const [editForm] = Form.useForm();
  const [detail, setDetail] = useState<PrizeItem>();
  const getDetail = async (goodsId: string) => {
    const res = await queryPrizeDetail({ goodsId });
    console.log(res);
    setDetail(res || {});
    editForm.setFieldsValue(res);
  };
  useEffect(() => {
    const { goodsId } = location.state;
    if (goodsId) {
      getDetail(goodsId);
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
    console.log(res);
  }, 500);
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
        <Form.Item label="奖品名称" name="name">
          <Input placeholder="请输入" className="width420" />
        </Form.Item>
        <Form.Item
          name={'imgUrl'}
          label="奖品图片"
          extra="为确保最佳展示效果，请上传300*300像素透明底图片，大小不超过200k，仅支持.jpg格式"
        >
          <NgUpload showDeleteBtn></NgUpload>
        </Form.Item>
        {detail?.goodsType !== 1
          ? (
          <>
            <Form.Item name={'totalStock'} label="奖品库存" extra="件" className="customExtra">
              <InputNumber className="width100" controls={false} max={999999999} />
            </Form.Item>
            <Form.Item name={'winWeight'} label="中奖概率" extra="%" className="customExtra">
              <InputNumber controls={false} className="width100" max={100} />
            </Form.Item>
          </>
            )
          : null}

        <Form.Item name={'exchangeDesc'} label="兑换流程说明">
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
