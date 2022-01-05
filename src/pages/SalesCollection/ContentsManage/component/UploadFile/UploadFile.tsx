import React, { useEffect, useState } from 'react';
import { Form, Upload, message, Button } from 'antd';
import { Icon } from 'src/components';
import style from './style.module.less';

interface IUploadFileProps {
  type: string;
  fileList: any[];
  imgLimitParam: { type: string[]; size: number };
  rules: [{ required: boolean; message: string }];
  extra: string;
}

interface IFileTypeContrast {
  'audio/mpeg': 'mp3';
  'audio/mp3': 'mp3';
  'video/mp4': 'mp4';
  'application/pdf': 'pdf';
}

const UploadFile: React.FC<IUploadFileProps> = ({ type, fileList, imgLimitParam, rules, extra }) => {
  const [isShowFileLsit, setIsShowFileList] = useState(false);
  // 定义一个类型对照
  const fileTypeContrast: IFileTypeContrast = {
    'audio/mpeg': 'mp3',
    'audio/mp3': 'mp3',
    'video/mp4': 'mp4',
    'application/pdf': 'pdf'
  };

  const normFiles = (e: any) => {
    if (e.file.status === 'uploading') {
      return;
    }
    if (e.file.status === 'done') {
      if (e.file.response.retmsg === 'ok') {
        return e.file.response.retdata.filePath;
      }
      message.error(e.file.response.retmsg);
      throw new Error(e.file.response.retmsg);
    }
  };
  const upLoadOnChangeHandle = (info: any) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功`);
      setIsShowFileList(true);
      return info.fileList;
    } else if (info.file.status === 'error') {
      setIsShowFileList(true);
      message.error(`${info.file.name} 上传失败`);
    }
  };
  const beforeUploadFileHandle = (file: File) => {
    const { type, size } = imgLimitParam;
    const suffix: string[] = type.map((item) => {
      return fileTypeContrast[item as keyof IFileTypeContrast];
    });
    const suffixType = suffix.includes(file.name.split('.')[file.name.split('.').length - 1]);
    const fileType = type.includes(file.type) && suffixType;
    if (!fileType) {
      message.error(`请上传.${suffix[0]}格式的文件`);
    }
    const isSize = file.size / 1024 / 1024 < size;
    if (!isSize) {
      message.error(`文件大小不能超过${size}MB!`);
    }
    return fileType && isSize;
  };
  const onRemoveHandle = () => {
    setIsShowFileList(false);
  };
  useEffect(() => {
    if (fileList.length) {
      setIsShowFileList(true);
    }
  }, []);
  return (
    <>
      <Form.Item
        className={style.fileFormItem}
        label={`上传${type}:`}
        name={'contentUrl'}
        valuePropName="file"
        getValueFromEvent={normFiles}
        rules={rules}
        extra={extra}
      >
        <Upload
          className={style.uploadFile}
          name="file"
          maxCount={1}
          action="/tenacity-admin/api/file/upload"
          data={{ bizKey: type === 'PDF' ? 'pdf' : 'media' }}
          defaultFileList={fileList}
          onChange={upLoadOnChangeHandle}
          beforeUpload={(file) => beforeUploadFileHandle(file)}
          onRemove={onRemoveHandle}
        >
          {isShowFileLsit || (
            <Button className={style.uploadBtn}>
              <Icon className={style.uploadIcon} name="shangchuanwenjian" />
              将文件拖拽至此区域，或<span className={style.uploadText}>点此上传</span>
            </Button>
          )}
        </Upload>
      </Form.Item>
    </>
  );
};
export default UploadFile;
