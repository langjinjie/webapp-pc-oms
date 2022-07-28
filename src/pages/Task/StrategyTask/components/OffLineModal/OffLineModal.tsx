import React from 'react';
import { NgModal } from 'src/components';
import styles from './style.module.less';

interface OffLineModalProps {
  content?: string;
  onOK: () => void;
  visible: boolean;
  onCancel: () => void;
}
const OffLineModal: React.FC<OffLineModalProps> = ({ content, onCancel, onOK, visible }) => {
  return (
    <NgModal title={''} visible={visible} width={480} onOk={onOK} onCancel={onCancel}>
      <p className={styles.modalContent}>{content || '下架后会影响所有机构，确定要下架？'}</p>
    </NgModal>
  );
};

export default OffLineModal;
