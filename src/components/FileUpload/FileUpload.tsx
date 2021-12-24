/**
 * @name FileUpload
 * @author Lester
 * @date 2021-12-24 11:31
 */
import React, { useState } from 'react';
import { Upload } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { UploadChangeParam } from 'antd/lib/upload/interface';
import { Icon } from 'src/components';
import style from './style.module.less';

interface FileUploadProps {
  value?: string;
  onChange?: (val: string) => void;
}
const FileUpload: React.FC<FileUploadProps> = ({ value, onChange }) => {
  const [loading, setLoading] = useState(false);

  const fileChange = (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
      return setLoading(true);
    }
    if (info.file.status === 'done') {
      if (info.file.response.ret === 0) {
        onChange && onChange(info.file.response.retdata.filePath);
      }
      return setLoading(false);
    }
  };

  const uploadButton = (
    <div className={style.uploadBtn}>
      {loading
        ? (
        <LoadingOutlined />
          )
        : (
        <>
          <Icon className={style.uploadIcon} name="shangchuanwenjian" />
          上传校验文件
        </>
          )}
    </div>
  );

  return (
    <Upload
      accept="*"
      showUploadList={false}
      action="/tenacity-admin/api/file/upload"
      data={{ bizKey: 'news' }}
      onChange={fileChange}
    >
      {value || uploadButton}
    </Upload>
  );
};

export default FileUpload;
