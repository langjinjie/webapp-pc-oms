import React from 'react';
import { Modal } from 'src/components';
import style from './style.module.less';

interface IStaffModalProps {
  visible: boolean;
  onClose: () => void;
  onChange?: (param: any[]) => void;
}

const StaffModal: React.FC<IStaffModalProps> = ({ visible, onClose, onChange }) => {
  const onOk = () => {
    onChange?.([1, 2, 3, 4, 5, 6]);
    onClose();
  };
  return (
    <Modal centered className={style.wrap} onClose={onClose} visible={visible} title="选择执行人员" onOk={onOk}>
      StaffModal
    </Modal>
  );
};
export default StaffModal;
