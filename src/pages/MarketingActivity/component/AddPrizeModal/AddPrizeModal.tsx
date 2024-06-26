import React, { useEffect } from 'react';
import { Form, Input, message } from 'antd';
import { ImageUpload, Modal } from 'src/components';
import { requestAddOrUpdateActivityGoods, requestActivityPrizeDetail } from 'src/apis/marketingActivity';
import qs from 'qs';
import style from './style.module.less';

const { Item } = Form;
const { TextArea } = Input;

interface IAddPrizeModalProps {
  visible: boolean;
  title?: string;
  onOk?: () => void;
  onCancel?: () => void;
}

const AddPrizeModal: React.FC<IAddPrizeModalProps> = ({ visible, title, onOk, onCancel }) => {
  const [form] = Form.useForm();

  const { goodsId } = qs.parse(location.search, { ignoreQueryPrefix: true }) || {};

  // 获取奖品详情
  const getDetail = async () => {
    const res = await requestActivityPrizeDetail({ goodsId });
    if (res) {
      console.log(res);
      form.setFieldsValue(res);
    }
  };

  const onFinish = async (values?: any) => {
    const res = await requestAddOrUpdateActivityGoods({ ...values, goodsId });
    if (res) {
      message.success(`奖品${goodsId ? '修改' : '新增'}成功`);
      onOk?.();
    }
  };

  useEffect(() => {
    if (goodsId) {
      getDetail();
    }
  }, []);
  return (
    <>
      <Modal
        width={600}
        className={style.modalWrap}
        title={title || '新增奖励'}
        visible={visible}
        onOk={onFinish}
        onClose={() => onCancel?.()}
      >
        <Form form={form}>
          <Item name="goodsName" label="奖品名称" rules={[{ required: true, message: '请输入奖品名称' }]}>
            <Input className="width480" placeholder="请输入奖品名称，30字以内" maxLength={30} />
          </Item>
          <Item name="goodsImg" label="奖品图片" rules={[{ required: true, message: '请上产奖品图片' }]}>
            <ImageUpload />
          </Item>
          <Item name="goodsDesc" label="奖品说明" rules={[{ required: true, message: '请输入奖品说明' }]}>
            <TextArea className="width480" placeholder="请输入奖品说明，300字以内" maxLength={300} />
          </Item>
        </Form>
      </Modal>
    </>
  );
};
export default AddPrizeModal;
