import React, { useEffect, useState } from 'react';
import { Upload, Button, message } from 'antd';
import { Icon } from 'src/components';
import style from './style.module.less';
import { RcFile } from 'antd/es/upload/interface';

interface IUploadFileProps {
  onChange?: (imgUrl: string) => void;
  value?: string;
  beforeUpload?: (file: RcFile) => void;
  bizKey?: string;
}

const UploadFile: React.FC<IUploadFileProps> = ({ onChange, value, beforeUpload, bizKey = 'media' }) => {
  const [showUploadBtn, setShowUploadBtn] = useState(true);
  const props = {
    name: 'file',
    maxCount: 1,
    action: '/tenacity-admin/api/file/upload',
    data: { bizKey },
    defaultFileList: value
      ? ([
          { uid: '1', name: value.split('/')[value.split('/').length - 1].split('?')[0], status: 'done', url: value }
        ] as any[])
      : []
  };
  const beforeUploadFileHandle = (file: RcFile) => {
    setShowUploadBtn(true);
    beforeUpload?.(file);
  };
  const onChangeHandle = (info: any) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功`);
      onChange?.(info.file.response.retdata?.filePath);
      setShowUploadBtn(false);
      return info.fileList;
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  };
  const onRemoveHandle = () => {
    setShowUploadBtn(true);
  };
  useEffect(() => {
    value && setShowUploadBtn(false);
  }, [value]);
  return (
    <>
      <Upload
        {...props}
        className={style.uploadFile}
        onChange={onChangeHandle}
        beforeUpload={beforeUploadFileHandle}
        onRemove={onRemoveHandle}
      >
        {showUploadBtn && (
          <Button className={style.uploadBtn}>
            <Icon className={style.uploadIcon} name="shangchuanwenjian" />
            将文件拖拽至此区域，或<span className={style.uploadText}>点此上传</span>
          </Button>
        )}
      </Upload>
    </>
  );
};
export default UploadFile;
