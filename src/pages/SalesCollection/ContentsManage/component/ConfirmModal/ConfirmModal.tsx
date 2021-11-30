import React, { useState } from 'react';
import { Modal } from 'antd';
import { IFirmModalParam } from 'src/utils/interface';
import style from './style.module.less';

interface IConfirmModalProps {
  firmModalParam: IFirmModalParam;
}

const ConfirmModal: React.FC<IConfirmModalProps> = ({ firmModalParam }) => {
  const { visible, title, content, onOk, onCancel } = firmModalParam;
  const [okBtnDisabled, setOnBtnDsiabled] = useState(false);
  return (
    <Modal
      width={300}
      centered
      wrapClassName={style.firmModalWrap}
      closable={false}
      visible={visible}
      title={title}
      onCancel={() => onCancel?.()}
      onOk={async () => {
        setOnBtnDsiabled(true);
        await onOk?.();
        setOnBtnDsiabled(false);
      }}
      maskClosable={false}
      okButtonProps={{
        disabled: okBtnDisabled,
        loading: okBtnDisabled
      }}
    >
      <span className={style.content}>{content}</span>
    </Modal>
  );
};
export default ConfirmModal;
