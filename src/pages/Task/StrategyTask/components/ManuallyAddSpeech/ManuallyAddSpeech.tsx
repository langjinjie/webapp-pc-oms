import React, { useState } from 'react';
import { NgModal } from 'src/components';
import { Input } from 'antd';
import { NgModalProps } from 'src/components/NgModal/NgModal';

interface ManuallyAddSpeechProps extends Omit<NgModalProps, 'onOk'> {
  visible: boolean;
  speech: string;
  onOk: (value: string) => void;
}
export const ManuallyAddSpeech: React.FC<ManuallyAddSpeechProps> = ({ visible, speech, onOk, ...props }) => {
  const [value, setValue] = useState('');
  const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    console.log(e.target.value);
    setValue(e.target.value);
  };
  const handleOK = () => {
    onOk?.(value);
  };
  return (
    <NgModal title="手工添加话术" visible={visible} width={'480px'} onOk={handleOK} {...props}>
      <div className="mb10">话术详情</div>
      <Input.TextArea rows={4} defaultValue={speech} onChange={onChange} />
    </NgModal>
  );
};
