/**
 * @name Modal
 * @author Lester
 * @date 2021-07-06 13:55
 */
import React from 'react';
import { Modal as AntdModal, ModalProps as AntdModalProps } from 'antd';
import classNames from 'classnames';
import style from './style.module.less';
import { Icon } from '../index';

interface ModalProps extends AntdModalProps {
  visible: boolean;
  title: string;
  tips?: string;
  onClose: () => void;
  okText?: string;
  onOk?: () => void;
  className?: string;
}

const Modal: React.FC<ModalProps> = (props) => {
  const { visible, onClose, onOk, children, title, tips, okText, className, ...otherProps } = props;
  return (
    <AntdModal
      className={classNames(style.modalWrap, className)}
      visible={visible}
      title={
        <div className={style.baseTitle}>
          {title}
          {tips && <span className={style.titleTips}>{tips}</span>}
        </div>
      }
      closeIcon={<Icon className={style.closeIcon} name="guanbi" />}
      onCancel={onClose}
      maskClosable={false}
      footer={
        <>
          {onOk
            ? (
            <div className={style.footerBtn}>
              <button className={style.cancel} onClick={onClose}>
                取消
              </button>
              <button className={style.ok} onClick={() => onOk && onOk()}>
                {okText || '确定'}
              </button>
            </div>
              )
            : null}
        </>
      }
      {...otherProps}
    >
      {children}
    </AntdModal>
  );
};

export default Modal;
