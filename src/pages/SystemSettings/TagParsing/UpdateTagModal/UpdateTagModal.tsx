import React, { useEffect, useState } from 'react';
import { Modal, NgTable } from 'src/components';
import style from './style.module.less';

export interface IAnalyseIdList {
  analyseId: string;
}

interface IUpdateTagModalProps {
  visible: boolean;
  value?: any;
  title?: string;
  onOk?: (list: IAnalyseIdList[]) => void;
  onClose: () => void;
}

const UpdateTagModal: React.FC<IUpdateTagModalProps> = ({ visible, title, onClose, onOk }) => {
  const [AnalyseIdList, setAnalyseIdList] = useState<IAnalyseIdList[]>([]);

  useEffect(() => {
    if (visible) {
      console.log('visible', visible);
    } else {
      setAnalyseIdList([]);
    }
  }, []);

  return (
    <Modal
      visible={visible}
      title={title || '选择标签更新'}
      width={710}
      centered
      className={style.wrap}
      onOk={() => onOk?.(AnalyseIdList)}
      onClose={onClose}
    >
      <div className={style.clientInfo}>
        <div>客户昵称：{'李斯'}</div>
        <div className={style.externalUserid}>外部联系人id：{'12hhdgagas277812'}</div>
      </div>
      <div className={style.chatInfo}>聊天内容：{'我老婆想给孩子买个熊孩子险，想先了解一下。'}</div>
      <NgTable className={style.table} scroll={{ x: 670 }} columns={[{ title: '标签' }, { title: '标签值' }]} />
    </Modal>
  );
};
export default UpdateTagModal;
