import React from 'react';
import { Drawer } from 'antd';

import styles from './style.module.less';
import { TOKEN_KEY } from 'src/utils/config';

interface PreviewProps {
  visible: boolean;
  onClose?: () => void;
}

const PreviewSpeech: React.FC<PreviewProps> = ({ visible, onClose }) => {
  const token = localStorage.getItem(TOKEN_KEY);
  const locationOrigin =
    window.location.origin.indexOf('localhost') > 0 ? 'http://localhost:8088' : window.location.origin;
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
        src={`${locationOrigin}/tenacity-webapp-preview/salesCollection/?token=${token}`}
        frameBorder="0"
      ></iframe>
    </Drawer>
  );
};

export default PreviewSpeech;
