import { Button } from 'antd';
import React from 'react';
import { NgModal } from '../../../../components/NgModal/NgModal';

interface BatchResultProps {
  onCancel: () => void;
  visible: boolean;
  batchAddResult: any;
}
const BatchAddResult: React.FC<BatchResultProps> = ({ onCancel, batchAddResult, visible }) => {
  return (
    <NgModal
      visible={visible}
      width={360}
      title="温馨提示"
      footer={[
        <Button
          onClick={() => {
            onCancel();
            window.location.href = batchAddResult.errorUrl;
          }}
          key={'submit'}
          type="primary"
        >
          下载失败名单
        </Button>
      ]}
      onCancel={onCancel}
    >
      <ul className="ml40" key={'batchAddResult'}>
        <li key={'successCount'}>1、 外部联系人成功新增{batchAddResult?.successCount}条。</li>
        <li key={'repeatCount'}>2、 重复的外部联系人有{batchAddResult?.repeatCount}条。</li>
        <li key={'notExistCount'}>3、 不存在的外部联系人有{batchAddResult?.notExistCount}条。</li>
        <li key={'emptyCount'}>4、 格式为空的外部联系人{batchAddResult?.emptyCount}条。</li>
      </ul>
    </NgModal>
  );
};

export default BatchAddResult;
