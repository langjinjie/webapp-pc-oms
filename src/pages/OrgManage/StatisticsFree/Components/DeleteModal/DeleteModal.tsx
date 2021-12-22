import React from 'react';
import { NgModal } from '../NgModal/NgModal';

interface DeleteModalProps {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
}
const DeleteModal: React.FC<DeleteModalProps> = ({ ...props }) => {
  return (
    <NgModal title="删除提醒" {...props}>
      <div style={{ height: '100px', lineHeight: '100px', textAlign: 'center' }}>是否删除选中名单</div>
    </NgModal>
  );
};

export default DeleteModal;
