import React, { useEffect, useState } from 'react';
import { Modal } from 'src/components';
import { Button, Input } from 'antd';
import copy from 'copy-to-clipboard';
import { downloadImage } from 'src/utils/base';
import QRCode from 'qrcode';
import style from './style.module.less';

interface IDownLoadQRCodeModalProps {
  title?: string;
  visible: boolean;
  onClose: () => void;
  link?: string;
}
/**
 * @description 产婆列表查看二维码
 * @param param0
 * @returns
 */
const DownLoadQRCodeModal: React.FC<IDownLoadQRCodeModalProps> = ({ title, visible, onClose, link }) => {
  const [qrCode, setQrCode] = useState('');

  // 合成图片
  const generateQR = async () => {
    try {
      const qrCode = await QRCode.toDataURL(link as string);
      setQrCode(qrCode);
    } catch (err) {
      console.error('err', err);
    }
  };

  // 下载二维码
  const downLoadQRCode = () => {
    downloadImage(qrCode, '产品二维码');
  };

  useEffect(() => {
    if (link) {
      generateQR();
    }
  }, [link]);

  return (
    <Modal
      title={title || '产品二维码'}
      centered
      width={480}
      className={style.wrap}
      visible={visible}
      onClose={onClose}
      footer={
        <Button disabled={!link} className={style.downLoadBtn} type="primary" onClick={downLoadQRCode}>
          下载二维码
        </Button>
      }
    >
      <div className={style.qrCode}>
        <img src={qrCode} />
      </div>
      <Input className={style.input} readOnly value={link} />
      <Button disabled={!link} className={style.copyBtn} shape="round" onClick={() => copy(link || '')}>
        复制链接
      </Button>
    </Modal>
  );
};
export default DownLoadQRCodeModal;
