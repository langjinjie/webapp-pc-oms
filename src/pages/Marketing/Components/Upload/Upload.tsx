import React, { useState, useEffect } from 'react';

import { Upload } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { RcFile } from 'antd/es/upload/interface';
import { Icon } from 'src/components';
import { uploadImage } from 'src/apis/marketing';

interface NgUploadProps {
  onChange?: (imgUrl: string) => void;
  value?: string;
  beforeUpload?: (file: RcFile) => void;
}

const getBase64 = (img: any, callback: (str: any) => void) => {
  console.log('a');
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};
const NgUpload: React.FC<NgUploadProps> = ({ onChange, value, beforeUpload }) => {
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
    <div>
      {states.loading ? <LoadingOutlined /> : <Icon className={'font36'} name="upload" />}
      <div style={{ marginTop: 8 }} className={'color-text-regular'}>
        上传图片
      </div>
    </div>
  );
  // const handleBeforeUpload = async (file: RcFile) => {
  //   if (beforeUpload) {
  //     const res = await beforeUpload?.(file);
  //     return res;
  //   }
  //   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  //   if (!isJpgOrPng) {
  //     message.error('你只可以上传 JPG/PNG 文件!');
  //   }
  //   const isLt2M = file.size / 1024 / 1024 < 2;
  //   if (!isLt2M) {
  //     message.error('图片大小不能超过 2MB!');
  //   }
  //   return isJpgOrPng && isLt2M;
  // };
  const handleChange = (info: UploadChangeParam<UploadFile<any>>) => {
    if (info.file.status === 'uploading') {
      setStates((states) => ({ ...states, loading: true }));
      return;
    }
    console.log(info.file.status);
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
    uploadData.append('bizKey', 'news');
    const res: any = await uploadImage(uploadData);
    if (res) {
      onChange?.(res.filePath);
      setStates((states) => ({ ...states, loading: false, imageUrl: res.filePath || '' }));
    }
  };

  return (
    <Upload
      onChange={handleChange}
      listType="picture-card"
      beforeUpload={beforeUpload}
      showUploadList={false}
      className="avatar-uploader"
      customRequest={posterUploadFile}
    >
      {states.imageUrl ? <img src={states.imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
    </Upload>
  );
};

export default NgUpload;
