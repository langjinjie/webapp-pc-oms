import React from 'react';
import { Modal } from 'src/components';
import style from './style.module.less';

interface IChoosePrizeProps {
  title?: string;
  visible: boolean;
  onClose: () => void;
  onOk?: () => void;
}

const ChoosePrize: React.FC<IChoosePrizeProps> = ({ title, visible, onClose, onOk }) => {
  return (
    <Modal
      centered
      title={title || '选择奖品'}
      visible={visible}
      onClose={onClose}
      onOk={onOk}
      className={style.choosePrizeModal}
    >
      ChoosePrize
    </Modal>
  );
};
export default ChoosePrize;
