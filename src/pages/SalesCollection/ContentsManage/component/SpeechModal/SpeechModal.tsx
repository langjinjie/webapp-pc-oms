import React, { useEffect } from 'react';
import { Modal, NgTable } from 'src/components';

import { columns } from '../SyncSpeech/Config';
import style from './style.module.less';

interface ISpeechModalProps {
  visible: boolean;
  title?: string;
  catalogId?: string;
  onClose?: () => void;
}

const SpeechModal: React.FC<ISpeechModalProps> = ({ visible, title, catalogId, onClose }) => {
  const onCloseHandle = () => {
    onClose?.();
  };
  useEffect(() => {
    console.log('catalogId', catalogId);
  }, [visible]);
  return (
    <Modal
      centered
      title={title || '查看话术'}
      visible={visible}
      width={808}
      onClose={onCloseHandle}
      className={style.wrap}
    >
      <NgTable dataSource={[]} columns={columns()} pagination={{ simple: true }} />
    </Modal>
  );
};
export default SpeechModal;
