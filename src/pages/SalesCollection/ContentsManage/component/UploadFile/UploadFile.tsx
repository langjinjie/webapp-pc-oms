import React from 'react';
import { Form, Upload, message, Button } from 'antd';
import { Icon } from 'src/components';
import style from './style.module.less';

interface IUploadFileProps {
  fileList: any[];
  imgLimitParam: { type: string[]; size: number };
  rules: [{ required: boolean; message: string }];
  extra: string;
}

const UploadFile: React.FC<IUploadFileProps> = ({ fileList, imgLimitParam, rules, extra }) => {
  const normFiles = (e: any) => {
    if (e.file.status === 'uploading') {
      return;
    }
    if (e.file.status === 'done') {
      return e.file.response.retdata.filePath;
    }
  };
  const upLoadOnChangeHandle = (info: any) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功`);
      return info.fileList;
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败.`);
    }
  };
  const beforeUploadFileHandle = (file: File) => {
    const { type, size } = imgLimitParam;
    const suffix: string[] = type.map((item) => {
      if (item === 'audio/mpeg' || item === 'audio/mp3') {
        return 'mp3';
      } else if (item === 'video/mp4') {
        return 'mp4';
      } else {
        return '';
      }
    });
    const suffixType = suffix.includes(file.name.split('.')[1]);
    const fileType = type.includes(file.type) && suffixType;
    if (!fileType) {
      message.error(`请上传${suffix[0]}格式的文件`);
    }
    const isSize = file.size / 1024 / 1024 < size;
    if (!isSize) {
      message.error(`文件大小不能超过${size}MB!`);
    }
    return fileType && isSize;
  };
  return (
    <>
      <Form.Item
        className={style.voiceFormItem}
        label="上传语音:"
        name={'contentUrl'}
        valuePropName="file"
        getValueFromEvent={normFiles}
        rules={rules}
        extra={extra}
      >
        <Upload
          className={style.uploadVoice}
          name="file"
          maxCount={1}
          action="/tenacity-admin/api/file/upload"
          data={{ bizKey: 'media' }}
          defaultFileList={fileList}
          onChange={upLoadOnChangeHandle}
          beforeUpload={(file) => beforeUploadFileHandle(file)}
        >
          <Button className={style.btn}>
            <Icon className={style.uploadIcon} name="shangchuanwenjian" />
            将文件拖拽至此区域，或<span className={style.uploadText}>点此上传</span>{' '}
          </Button>
        </Upload>
      </Form.Item>
    </>
  );
};
export default UploadFile;
