import React, { useState } from 'react';
import { Button } from 'antd';
import { ExportModal } from 'src/components';
import { exportExcel } from 'src/apis/CrowdsPackage';

interface IExport {
  value?: string;
  onChange?: (value?: string) => void;
  onOk?: (value?: string) => void;
  onDownload?: () => void;
  title?: string;
}

const UploadExcel: React.FC<IExport> = ({ onChange, onOk, onDownload, title }) => {
  const [visible, setVisible] = useState(false);

  const onOkHandle = async (file: File) => {
    // 创建一个空对象实例
    const uploadData = new FormData();
    // 调用append()方法来添加数据
    uploadData.append('file', file);
    uploadData.append('bizKey', 'excel');
    const res = await exportExcel(uploadData);
    if (res) {
      onChange?.(res.filePath);
      onOk?.(res.filePath);
      setVisible(false);
    }
  };

  return (
    <>
      <Button type="primary" shape="round" onClick={() => setVisible(true)}>
        导入文件
      </Button>
      <ExportModal
        title={title || '导入表格'}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOK={onOkHandle}
        onDownLoad={onDownload}
      />
    </>
  );
};

export default UploadExcel;
