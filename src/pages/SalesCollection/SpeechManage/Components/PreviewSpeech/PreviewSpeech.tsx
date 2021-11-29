import React from 'react';
import { Drawer } from 'antd';

import styles from './style.module.less';
import { getCookie } from 'src/utils/base';

interface PreviewProps {
  visible: boolean;
  onClose?: () => void;
}

const PreviewSpeech: React.FC<PreviewProps> = ({ visible, onClose }) => {
  const token = getCookie('b2632ff42e4a58b67f37c8c1f322b213');
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
