import React from 'react';
import { NgModal } from '../../../../../components/NgModal/NgModal';

interface DeleteModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  onOk: () => void;
  onCancel: () => void;
}
const DeleteModal: React.FC<DeleteModalProps> = ({ title, message, ...props }) => {
  return (
    <NgModal title={title || '删除提醒'} {...props}>
      <div style={{ height: '100px', lineHeight: '100px', textAlign: 'center' }}>{message || '是否删除选中名单'}</div>
    </NgModal>
  );
};

export default DeleteModal;
