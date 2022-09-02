/**
 * @name FileUpload
 * @author Lester
 * @date 2021-12-24 11:31
 */
import React, { useState } from 'react';
import { Upload, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { UploadChangeParam } from 'antd/lib/upload/interface';
import { Icon } from 'src/components';
import { TOKEN_KEY } from 'src/utils/config';
import style from './style.module.less';

interface KeyMapVal {
  [key: string]: string;
}

interface FileUploadProps {
  value?: string;
  onChange?: (val: string) => void;
  extraData?: KeyMapVal;
}
const FileUpload: React.FC<FileUploadProps> = ({ value, onChange, extraData }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');

  const myToken = window.localStorage.getItem(TOKEN_KEY);

  const fileChange = (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
      return setLoading(true);
    }
    if (info.file.status === 'done') {
      if (info.file.response.ret === 0) {
        message.success('上次成功');
        onChange && onChange(info.file.response.retdata?.filePath);
      } else {
        message.error(info.file.response.retmsg || '上传失败');
      }
      setFileName(info.file.name);
      return setLoading(false);
    }
  };

  return (
    <Upload
      accept=".txt"
      showUploadList={false}
      action={'/tenacity-admin/api/corp/open/uploaddomain?myToken=' + myToken}
      data={extraData}
      onChange={fileChange}
    >
      <div className={style.uploadBtn}>
        {value
          ? (
              fileName
            )
          : (
          <>
            {loading
              ? (
              <>
                <LoadingOutlined />
                上传中...
              </>
                )
              : (
              <>
                <Icon className={style.uploadIcon} name="shangchuanwenjian" />
                上传校验文件
              </>
                )}
          </>
            )}
      </div>
    </Upload>
  );
};

export default FileUpload;
