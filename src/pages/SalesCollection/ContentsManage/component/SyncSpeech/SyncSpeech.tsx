import React from 'react';
import { Modal } from 'src/components';
import style from './style.module.less';

export interface ISyncSpeechProps {
  syncSpeechParam: ISyncSpeechParam;
  onClose?: () => void;
}

export interface ISyncSpeechParam {
  visible: boolean;
  title?: string;
}

const SyncSpeech: React.FC<ISyncSpeechProps> = ({ syncSpeechParam, onClose }) => {
  const onCloseHandle = () => {
    onClose?.();
  };
  return (
    <Modal
      centered
      title={syncSpeechParam.title || '同步目录'}
      visible={syncSpeechParam.visible}
      className={style.modalWrap}
      onClose={onCloseHandle}
    >
      <div className={style.treeWrap}>
        <div className={style.tree}></div>
        <div className={style.selectTree}></div>
      </div>
    </Modal>
  );
};
export default SyncSpeech;
