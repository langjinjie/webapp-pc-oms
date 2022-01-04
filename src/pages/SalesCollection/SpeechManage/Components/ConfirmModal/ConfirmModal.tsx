import { Button, Modal } from 'antd';
import React from 'react';
import style from './style.module.less';

interface ConfirmModalProps {
  visible: boolean;
  onCancel?: () => void;
  onOk?: () => void;
  isShowCancel?: boolean;
  title?: string;
}
const ConfirmModal: React.FC<ConfirmModalProps> = ({ visible, onCancel, onOk, isShowCancel, title = '操作提示' }) => {
  return (
    <Modal
      className={style.customConfirm}
      centered
      zIndex={10001}
      visible={visible}
      footer={null}
      closable={false}
      width={320}
    >
      <div className={style.ngModalWrap}>
        <div className={style.modalTitle}>{title}</div>
        <div className={style.modalContent}>有敏感词更新，为了不影响话术上架，建议您重新检测敏感词。</div>
        <div className={style.modalFooter}>
          {isShowCancel && (
            <Button type="default" onClick={() => onCancel?.()}>
              取消
            </Button>
          )}
          <Button type="primary" onClick={() => onOk?.()}>
            确定
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
