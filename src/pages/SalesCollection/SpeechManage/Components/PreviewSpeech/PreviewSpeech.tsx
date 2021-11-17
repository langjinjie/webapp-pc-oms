import React from 'react';
import { Drawer } from 'antd';

import styles from './style.module.less';

interface PreviewProps {
  visible: boolean;
  onClose?: () => void;
}

const PreviewSpeech: React.FC<PreviewProps> = ({ visible, onClose }) => {
  return (
    <Drawer
      title="预览"
      placement="right"
      width={600}
      onClose={() => {
        onClose?.();
      }}
      visible={visible}
    >
      <iframe
        className={styles.iframeWrap}
        src="http://localhost:8088/tenacity-webapp-sidebar/salesCollection/?token=1211121ss121"
        frameBorder="0"
      ></iframe>
    </Drawer>
  );
};

export default PreviewSpeech;
