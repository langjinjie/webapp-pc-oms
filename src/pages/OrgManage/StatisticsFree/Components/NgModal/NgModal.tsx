import React from 'react';
import { Modal } from 'antd';

import styles from './style.module.less';

type ModalProps = React.ComponentProps<typeof Modal>;
interface NgModalProps extends Omit<ModalProps, 'onCancel'> {
  title: string;
  onCancel: () => void;
}

export const NgModal: React.FC<NgModalProps> = ({ visible, title, children, onOk, onCancel }) => {
  return (
    <Modal
      className={styles.customModal}
      visible={visible}
      centered
      title={title}
      onOk={onOk}
      onCancel={() => onCancel()}
    >
      {children}
    </Modal>
  );
};
