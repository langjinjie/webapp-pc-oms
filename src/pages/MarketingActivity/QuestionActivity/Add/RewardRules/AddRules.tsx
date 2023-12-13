import React, { useEffect } from 'react';
import { Modal } from 'src/components';
import { Form, Input } from 'antd';
import { IPrizeConfig } from './Config';
import { requestUpdateQuestionActivityPrize } from 'src/apis/marketingActivity';
import { ChoosePrize } from 'src/pages/MarketingActivity/component';
import style from './style.module.less';
import qs from 'qs';

const { Item } = Form;

interface IAddRulesProps {
  value?: IPrizeConfig;
  title?: string;
  visible: boolean;
  onClose?: () => void;
  onOk?: () => void;
}

const AddRules: React.FC<IAddRulesProps> = ({ title, visible, onClose, onOk, value }) => {
  const [form] = Form.useForm();

  const onCloseHandle = () => {
    form.resetFields();
    onClose?.();
  };

  const onOkHandle = async () => {
    const { activityId } = qs.parse(location.search, { ignoreQueryPrefix: true });
    const { reportId } = value || {};
    const {
      score,
      goods: { goodsName, goodsId }
    } = form.getFieldsValue();
    const res = await requestUpdateQuestionActivityPrize({
      score,
      goodsId,
      goodsName,
      activityId,
      reportId
    });
    if (res) {
      form.resetFields();
      onOk?.();
    }
  };

  const getDetail = () => {
    if (!value) return;
    const { score, num, goodsId, goodsName } = value;
    form.setFieldsValue({ score, num, goods: { goodsId, goodsName } });
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
        <Item label="奖励分值" name="score">
          <Input className="width100 mr10" placeholder="请输入" />
        </Item>
        <Item label="奖品" name="goods">
          <ChoosePrize />
        </Item>
        {/* <Item label="奖品数量" name="num">
          <Input className="width100" placeholder="请输入" />
        </Item> */}
      </Form>
    </Modal>
  );
};
export default AddRules;
