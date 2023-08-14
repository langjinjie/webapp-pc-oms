import React from 'react';
import { Modal } from 'src/components';
import { Form, Input } from 'antd';
import ChoosePrize from './ChoosePrize';
import style from './style.module.less';

const { Item } = Form;

interface IAddRulesProps {
  title?: string;
  visible: boolean;
  onClose?: () => void;
  onOk?: () => void;
}

const AddRules: React.FC<IAddRulesProps> = ({ title, visible, onClose, onOk }) => {
  const [form] = Form.useForm();

  const onCloseHandle = () => {
    onClose?.();
  };
  return (
    <Modal
      centered
      width={640}
      title={title || '新建规则'}
      visible={visible}
      className={style.modalWrap}
      onClose={onCloseHandle}
      onOk={onOk}
    >
      <Form form={form}>
        <Item label="需累计签到">
          <Item name="需累计签到" noStyle>
            <Input className="width100 mr10" placeholder="请输入" />
          </Item>
          天
        </Item>
        <Item name="奖品" label="奖品">
          <ChoosePrize />
        </Item>
        <Item name="奖品数量" label="奖品数量">
          <Input className="width100" placeholder="请输入" />
        </Item>
      </Form>
    </Modal>
  );
};
export default AddRules;
