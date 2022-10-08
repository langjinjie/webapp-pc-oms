import React, { useMemo, useState } from 'react';
import { NgModal } from 'src/components';
import { Input } from 'antd';
import { NgModalProps } from 'src/components/NgModal/NgModal';

interface ManuallyAddSpeechProps extends NgModalProps {
  value?: string;
  onChange?: (value: string) => void;
  isReadonly?: boolean;
}
export const ManuallyAddSpeech: React.FC<ManuallyAddSpeechProps> = ({ value, onChange, isReadonly }) => {
  // 配置弹框
  const [speechVisible, setSpeechVisible] = useState(false);
  const [inputValue, setValue] = useState('');
  const onHandleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    console.log(e.target.value);
    setValue(e.target.value);
  };
  useMemo(() => {
    setValue(value || '');
  }, [value]);
  const handleOK = () => {
    setSpeechVisible(false);
    onChange?.(inputValue);
  };
  return (
    <>
      <Input
        disabled={isReadonly}
        placeholder="点击输入文本"
        value={value}
        readOnly
        onClick={() => setSpeechVisible(true)}
      ></Input>
      <NgModal
        title="手工添加话术"
        visible={speechVisible}
        width={'480px'}
        onOk={handleOK}
        onCancel={() => setSpeechVisible(false)}
      >
        <div className="mb10">话术详情</div>
        <Input.TextArea rows={4} defaultValue={inputValue} maxLength={100} onChange={onHandleChange} />
      </NgModal>
    </>
  );
};
