import React, { useEffect } from 'react';
import { Modal } from 'src/components';
import { Form, Input, message } from 'antd';
import { IRuleItem } from './Config';
import { requestSaveCheckInActivityRule } from 'src/apis/marketingActivity';
import { ChoosePrize } from 'src/pages/MarketingActivity/component';
import style from './style.module.less';
import qs from 'qs';

const { Item } = Form;

interface IAddRulesProps {
  value?: IRuleItem;
  title?: string;
  visible: boolean;
  onClose?: () => void;
  onOk?: () => void;
  condiDayList?: number[]; // 用于校验
}

const AddRules: React.FC<IAddRulesProps> = ({ title, visible, onClose, onOk, value, condiDayList }) => {
  const [form] = Form.useForm();

  const onCloseHandle = () => {
    onClose?.();
  };

  const onOkHandle = async () => {
    form.validateFields();
    const { actId } = qs.parse(location.search, { ignoreQueryPrefix: true });
    const {
      condiDay,
      priCount = 1,
      goods: { goodsName, goodsId }
    } = form.getFieldsValue();
    // 奖励天数重复校验
    if ((condiDayList || []).filter((day) => day !== +(condiDay || 0)).includes(+condiDay)) {
      return message.info('存在相同奖励天数的规则');
    }
    const res = await requestSaveCheckInActivityRule({
      condiDay: +condiDay,
      priCount: +priCount,
      goodsName,
      goodsId,
      actId,
      prId: value?.prId
    });
    if (res) {
      form.resetFields();
      onOk?.();
    }
  };

  const getDetail = () => {
    if (!value) return;
    const { condiDay, /* priCount, */ goodsId, goodsName } = value;
    form.setFieldsValue({ condiDay, /* priCount, */ goods: { goodsId, goodsName } });
  };

  useEffect(() => {
    if (visible) getDetail();
  }, [visible]);

  return (
    <Modal
      centered
      width={640}
      title={title || '新建规则'}
      visible={visible}
      className={style.modalWrap}
      onClose={onCloseHandle}
      onOk={onOkHandle}
    >
      <Form form={form}>
        <Item label="需累计签到" required>
          <Item name="condiDay" noStyle rules={[{ required: true }]}>
            <Input className="width100 mr10" placeholder="请输入" />
          </Item>
          天
        </Item>
        <Item label="奖品" name="goods" rules={[{ required: true }]}>
          <ChoosePrize />
        </Item>
        {/* <Item label="奖品数量" name="priCount" rules={[{ required: true }]}>
          <Input className="width100" placeholder="请输入" />
        </Item> */}
      </Form>
    </Modal>
  );
};
export default AddRules;
