/**
 * @name ImageUpload
 * @author Lester
 * @date 2021-11-13 09:57
 */
import React, { useState } from 'react';
import { message, Upload } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { UploadChangeParam } from 'antd/lib/upload/interface';
import { Icon } from 'src/components';
import style from './style.module.less';

interface ImageUploadProps {
  value?: string;
  onChange?: (val: string) => void;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, disabled }) => {
  const [loading, setLoading] = useState(false);

  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只允许上传JPG/PNG文件!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

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
          <div className={style.uploadCircle}>
            <Icon className={style.uploadIcon} name="icon_daohang_28_jiahaoyou" />
          </div>
          <div className={style.gray}>上传图片</div>
        </>
          )}
    </div>
  );

  return (
    <Upload
      accept="image/*"
      disabled={disabled}
      listType="picture-card"
      showUploadList={false}
      action="/tenacity-admin/api/file/upload"
      data={{ bizKey: 'news' }}
      beforeUpload={beforeUpload}
      onChange={fileChange}
    >
      {value ? <img className={style.img} src={value} alt="加载中..." /> : uploadButton}
    </Upload>
  );
};

export default ImageUpload;
