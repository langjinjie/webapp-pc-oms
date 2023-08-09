import React, { Dispatch, SetStateAction, useContext, useState } from 'react';
import { Modal } from 'antd';
import { Context } from 'src/store';
import { IConfirmModalParam } from 'src/utils/interface';
import style from './style.module.less';
import dangerousHTMLToSafeHTML from 'src/utils/dangerousHTMLToSafeHTML';

const ConfirmModal: React.FC = () => {
  const { confirmModalParam, setConfirmModalParam } = useContext<{
    confirmModalParam: IConfirmModalParam;
    setConfirmModalParam: Dispatch<SetStateAction<IConfirmModalParam>>;
  }>(Context);
  const { visible, title, tips, onOk, onCancel, okText, cancelText } = confirmModalParam;
  const [isLoading, setIsLoading] = useState(false);
  const Ok = async () => {
    setIsLoading(true);
    await onOk?.();
    setIsLoading(false);
  };
  const cancel = async () => {
    setIsLoading(true);
    await onCancel?.();
    setConfirmModalParam({ visible: false });
    setIsLoading(false);
  };
  return (
    <Modal
      className={style.modalWrap}
      centered
      closable={false}
      visible={visible}
      width={300}
      title={title || '温馨提示'}
      okText={okText || '确认'}
      cancelText={cancelText || '取消'}
      onOk={Ok}
      onCancel={cancel}
      maskClosable={false}
      zIndex={9999} // 层级仅次于 message(99999)
      okButtonProps={{
        loading: isLoading
      }}
    >
      <div
        className={style.content}
        dangerouslySetInnerHTML={{
          __html: dangerousHTMLToSafeHTML(tips || '确定执行该操作吗？')
        }}
      />
    </Modal>
  );
};
export default ConfirmModal;
