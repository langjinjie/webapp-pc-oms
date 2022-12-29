import { Form, Input } from 'antd';
import React from 'react';
import { Modal } from 'src/components';
import style from './style.module.less';

interface IModifyRuleProps {
  visible: boolean;
  title?: string;
  onClose: () => void;
}

const ModifyRule: React.FC<IModifyRuleProps> = ({ visible, title, onClose }) => {
  const onCloseHanele = () => {
    onClose();
  };

  const onOkHandle = () => {
    onClose();
  };
  return (
    <Modal
      title={title || '修改新人规则'}
      className={style.wrap}
      visible={visible}
      onClose={onCloseHanele}
      onOk={onOkHandle}
      centered
    >
      <Form>
        <Form.Item>
          <Form.Item name="newcomerDay" noStyle>
            <Input className={style.input} type="number" />
          </Form.Item>
          天
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default ModifyRule;
