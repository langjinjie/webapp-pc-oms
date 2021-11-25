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
  // modal确认
  const modalOnOkHandle = async () => {
    const res = await onOk?.({});
    console.log(res);
    if (res) {
      setFirmModalParam({ ...firmModalParam, visible: false });
    }
  };
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
      onOk={modalOnOkHandle}
      maskClosable={false}
      destroyOnClose
    >
      <div className={style.content}>{content}</div>
    </Modal>
  );
};
export default ConfirmModal;
