import React, { useState, useEffect } from 'react';

import { message, Upload } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { RcFile } from 'antd/es/upload/interface';
import { Icon } from 'src/components';
import { uploadImage } from 'src/apis/marketing';

import styles from './style.module.less';

interface NgUploadProps {
  onChange?: (imgUrl: string) => void;
  value?: string;
  beforeUpload?: (file: RcFile) => void;
  btnText?: string;
  showDeleteBtn?: boolean;
  bizKey?: string;
}

const getBase64 = (img: any, callback: (str: any) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};
const NgUploadFile: React.FC<NgUploadProps> = ({ onChange, value, beforeUpload, bizKey = 'pdf' }) => {
  const [states, setStates] = useState({
    loading: false,
    imageUrl: ''
  });
  useEffect(() => {
    if (value) {
      setStates((states) => ({ ...states, imageUrl: value }));
    }
  }, [value]);
  const uploadButton = (
    <div className={styles.uploadBtn}>
      {states.loading ? <LoadingOutlined /> : <Icon className="text-primary font18" name="shangchuanwenjian" />}
      <span className="ml10">
        将文件拖拽至此区域，或<span className="text-primary ml10">点此上传</span>
      </span>
    </div>
  );
  const handleBeforeUpload = async (file: RcFile) => {
    if (beforeUpload) {
      const res = await beforeUpload?.(file);
      return res;
    }
    console.log(file.type);
    const isPdf = file.type === 'application/pdf';
    if (!isPdf) {
      message.error('你只可以上传 PDF 文件!');
    }
    const isLt100M = file.size / 1024 / 1024 < 100;
    if (!isLt100M) {
      message.error('文件大小不能超过 100MB!');
    }
    return isPdf && isLt100M;
  };
  const handleChange = (info: UploadChangeParam<UploadFile<any>>) => {
    if (info.file.status === 'uploading') {
      setStates((states) => ({ ...states, loading: true }));
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl: string) => {
        setStates({
          imageUrl,
          loading: false
        });
      });
    }
  };

  const posterUploadFile = async (options: any) => {
    // 创建一个空对象实例
    const uploadData = new FormData();
    // 调用append()方法来添加数据
    uploadData.append('file', options.file);
    uploadData.append('bizKey', bizKey);
    const res: any = await uploadImage(uploadData);
    if (res) {
      onChange?.(res.filePath);
      setStates((states) => ({ ...states, loading: false, imageUrl: res.filePath || '' }));
    } else {
      message.error('长传失败');
      setStates((states) => ({ ...states, loading: false }));
    }
  };

  const deletePic: React.MouseEventHandler<Element> = (e) => {
    e.stopPropagation();
    onChange?.('');
    setStates((states) => ({ ...states, imageUrl: '' }));
  };

  return (
    <>
      {value
        ? (
        <div>
          <a href={value} target="_blank" rel="noreferrer">
            {value.split('/pdf/')[1].split('?')[0]}
          </a>
          <Icon onClick={deletePic} className={styles.delIcon} name="icon_common_16_inputclean"></Icon>
        </div>
          )
        : (
        <div className={styles.uploadWrap}>
          <Upload.Dragger
            onChange={handleChange}
            listType="picture-card"
            maxCount={1}
            beforeUpload={handleBeforeUpload}
            showUploadList={false}
            customRequest={posterUploadFile}
          >
            {uploadButton}
          </Upload.Dragger>
        </div>
          )}
    </>
  );
};

export default NgUploadFile;
