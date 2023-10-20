import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { ExportModal } from 'src/components';
import { exportExcel } from 'src/apis/CrowdsPackage';

interface IExport {
  value?: string;
  onChange?: (value?: string) => void;
  onOk?: (value?: string) => void;
  onDownload?: () => void;
}

const UploadExcel: React.FC<IExport> = ({ value, onChange, onOk, onDownload }) => {
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

  useEffect(() => {
    console.log('value', value);
  }, [value]);

  return (
    <>
      <Button type="primary" shape="round" onClick={() => setVisible(true)}>
        导入文件
      </Button>
      <ExportModal
        title="导入审核链"
        visible={visible}
        onCancel={() => setVisible(false)}
        onOK={onOkHandle}
        onDownLoad={onDownload}
      />
    </>
  );
};

export default UploadExcel;
