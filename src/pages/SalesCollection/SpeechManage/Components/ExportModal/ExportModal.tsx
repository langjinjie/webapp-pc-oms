import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, message, Upload } from 'antd';

import styles from './style.module.less';
import { Icon } from 'src/components';
import classNames from 'classnames';

const { Dragger } = Upload;
interface ExportModalProps {
  visible: boolean;
  title?: string;
  onOK: (file: File) => void;
  onCancel: () => void;
  onDownLoad?: () => void;
  isShowDownLoad?: boolean;
  confirmLoading?: boolean;
}
const ExportModal: React.FC<ExportModalProps> = ({
  visible,
  title,
  onOK,
  onCancel,
  onDownLoad,
  isShowDownLoad = true,
  confirmLoading
}) => {
  const [fileList, setFileList] = useState<any[]>([]);
  const props = {
    multiple: false,
    onRemove: (file: any) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList([...newFileList]);
    },
    beforeUpload: (file: any) => {
      const { type, name } = file;
      if (type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && name.indexOf('.xlsx') > 0) {
        setFileList([file]);
      } else {
        message.warning('请下载模板文件，修改数据后进行上传');
        setFileList([]);
      }
      return false;
    },
    fileList
  };
  useEffect(() => {
    visible || setFileList([]);
  }, [visible]);
  return (
    <Modal
      title={title || '批量新增'}
      centered
      visible={visible}
      onOk={() => onOK(fileList[0])}
      onCancel={() => onCancel()}
      width={640}
      confirmLoading={confirmLoading}
      className={styles.exportWrap}
      okButtonProps={{
        disabled: !fileList.length
      }}
    >
      <Form>
        {isShowDownLoad && (
          <Form.Item label="下载模板">
            <Button type="primary" className={styles.uploadBtn} shape="round" ghost onClick={() => onDownLoad?.()}>
              下载
            </Button>
          </Form.Item>
        )}
        <Form.Item label="文件添加">
          <Dragger
            className={styles.dragWrap}
            {...props}
            maxCount={1}
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          >
            <div className={styles.uploadInfo}>
              <Icon className={styles.iconExcel} name="xingzhuangjiehe"></Icon>
              <div>
                <span className={classNames('font16 color-text-primary', styles.format)}>
                  支持excel文本格式，大小不超过10M
                </span>
                <span className="color-text-placeholder">点击或者拖拽到此处上传</span>
              </div>
            </div>
          </Dragger>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ExportModal;
