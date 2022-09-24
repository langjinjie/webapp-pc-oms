import React, { useEffect, useState } from 'react';
import { /* Button, Tag, Select, message, */ Modal } from 'antd';
// import style from './style.module.less';

interface IAudioProps {
  audioVisible: boolean;
  source: string;
  handleChange?: () => void;
}

const AudioPlay: React.FC<IAudioProps> = ({ audioVisible, source, handleChange }) => {
  const [audioPlay, setAudioPlay] = useState(false);

  const onCancel = () => {
    // @ts-ignore
    handleChange?.();
    setAudioPlay(false);
  };
  useEffect(() => {
    if (audioVisible) {
      setAudioPlay(true);
    } else {
      setAudioPlay(false);
    }
  }, [audioVisible]);
  return (
    <Modal
      visible={audioVisible}
      title="视频"
      bodyStyle={{ height: 600, overflow: 'auto' }}
      onCancel={onCancel}
      onOk={onCancel}
      footer={null}
    >
      {/* @ts-ignore */}
      {audioPlay && (
        <video src={source} controls preload="auto" style={{ width: 470 }}>
          {/* <source src={source} type='video/mp4' />
      <source src={source} type="audio/ogg" />
      <source src={source} type="audio/mpeg" /> */}
        </video>
      )}
    </Modal>
  );
};
export default AudioPlay;
