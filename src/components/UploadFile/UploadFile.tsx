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
  onRemove?: () => void;
}

const UploadFile: React.FC<IUploadFileProps> = ({ onChange, value, beforeUpload, bizKey = 'media', onRemove }) => {
  const [props, setProps] = useState<any>();
  const beforeUploadFileHandle = (file: RcFile) => {
    return beforeUpload?.(file);
  };
  const onChangeHandle = (info: any) => {
    if (info.file.status === 'done') {
      if (info.file.response.ret === 0) {
        message.success(`${info.file.name} 上传成功`);
        onChange?.(info.file.response.retdata?.filePath);
        return info.fileList;
      } else {
        message.error(info.file.response.retmsg);
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  };
  const onRemoveHandle = () => {
    onRemove?.();
  };
  useEffect(() => {
    setProps(
      value && {
        fileList: [
          {
            uid: '1',
            name: value.split('/')[value.split('/').length - 1].split('?')[0],
            status: 'done',
            url: value
          }
        ]
      }
    );
  }, [value]);
  return (
    <>
      <Upload
        {...props}
        name={'file'}
        maxCount={1}
        action={'/tenacity-admin/api/file/upload'}
        data={{ bizKey }}
        className={style.uploadFile}
        onChange={onChangeHandle}
        beforeUpload={beforeUploadFileHandle}
        onRemove={onRemoveHandle}
      >
        {!value && (
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
