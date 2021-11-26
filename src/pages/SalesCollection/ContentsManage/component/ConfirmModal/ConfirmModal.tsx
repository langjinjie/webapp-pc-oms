import React from 'react';
import { Modal } from 'antd';
import { IFirmModalParam } from 'src/utils/interface';
import style from './style.module.less';

interface IConfirmModalProps {
  firmModalParam: IFirmModalParam;
  setFirmModalParam: (param: IFirmModalParam) => void;
}

const ConfirmModal: React.FC<IConfirmModalProps> = ({ firmModalParam, setFirmModalParam }) => {
  const { visible, title, content, onOk } = firmModalParam;
  const onCancelHandle = () => {
    setFirmModalParam({ ...firmModalParam, visible: false });
  };
  return (
    <Modal
      width={300}
      centered
      wrapClassName={style.firmModalWrap}
      closable={false}
      visible={visible}
      title={title}
      onCancel={onCancelHandle}
      onOk={() => onOk?.()}
      maskClosable={false}
      destroyOnClose
    >
      <span className={style.content}>{content}</span>
    </Modal>
  );
};
export default ConfirmModal;
