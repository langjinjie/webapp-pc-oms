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
  const cancel = () => {
    onCancel?.();
    setOnBtnDsiabled(false);
  };
  const ok = async () => {
    setOnBtnDsiabled(true);
    await onOk?.();
    setOnBtnDsiabled(false);
  };
  return (
    <Modal
      width={300}
      centered
      wrapClassName={style.firmModalWrap}
      closable={false}
      visible={visible}
      title={title}
      onCancel={cancel}
      onOk={ok}
      maskClosable={false}
      okButtonProps={{
        loading: okBtnDisabled
      }}
    >
      <span className={style.content}>{content}</span>
    </Modal>
  );
};
export default ConfirmModal;
