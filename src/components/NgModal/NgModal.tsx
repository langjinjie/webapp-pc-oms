import React from 'react';
import { Modal, ModalProps } from 'antd';

import styles from './style.module.less';
import classNames from 'classnames';

// type ModalProps = React.ComponentProps<typeof Modal>;
// interface NgModalProps extends Omit<ModalProps, 'onCancel'> {
//   className?: string;
// }

export type NgModalProps = ModalProps;

export const NgModal: React.FC<NgModalProps> = ({ children, onOk, className, ...props }) => {
  return (
    <Modal {...props} className={classNames(styles.customModal, className)} centered onOk={onOk}>
      {children}
    </Modal>
  );
};
