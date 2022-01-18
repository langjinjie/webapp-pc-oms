import React, { useContext, useState } from 'react';
import { Modal } from 'antd';
import { Context } from 'src/store';
import style from './style.module.less';

const ConfirmModal: React.FC = () => {
  const { confirmModalParam } = useContext(Context);
  const { visible, title, tips, onOk, onCancel } = confirmModalParam;
  const [isLoading, setIsLoading] = useState(false);
  const Ok = async () => {
    setIsLoading(true);
    await onOk();
    setIsLoading(false);
  };
  const cancel = async () => {
    setIsLoading(true);
    await onCancel();
    setIsLoading(false);
  };
  return (
    <Modal
      className={style.modalWrap}
      centered
      visible={visible}
      width={300}
      title={title}
      onOk={Ok}
      onCancel={cancel}
      maskClosable={false}
      okButtonProps={{
        loading: isLoading
      }}
    >
      <div className={style.content}>{tips}</div>
    </Modal>
  );
};
export default ConfirmModal;
