import React from 'react';
import { Modal } from 'src/components';
import style from './style.module.less';

interface IAddRulesProps {
  title?: string;
  visible: boolean;
  onClose?: () => void;
  onOk?: () => void;
}

const AddRules: React.FC<IAddRulesProps> = ({ title, visible, onClose, onOk }) => {
  const onCloseHandle = () => {
    onClose?.();
  };
  return (
    <Modal
      centered
      width={640}
      title={title || '新建规则'}
      visible={visible}
      className={style.wrap}
      onClose={onCloseHandle}
      onOk={onOk}
    >
      AddRules
    </Modal>
  );
};
export default AddRules;
