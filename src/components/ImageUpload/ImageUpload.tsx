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
import classNames from 'classnames';
import { uploadImage } from 'src/apis/marketing';

interface ImageUploadProps {
  value?: string;
  onChange?: (val: string) => void;
  disabled?: boolean;
  beforeUpload?: (file: any) => void;
  className?: string;
  uploadBtnStyle?: any;
  id?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  disabled,
  beforeUpload,
  className,
  uploadBtnStyle,
  id
}) => {
  const [loading, setLoading] = useState(false);

  const beforeUploadHandle = (file: any) => {
    // 自定义beforeUpload
    if (beforeUpload) {
      return beforeUpload(file);
    }
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
  const getBase64 = (img: any, callback: (str: any) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  const fileChange = (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
      return setLoading(true);
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl: string) => {
        console.log(imageUrl);
        return setLoading(false);
      });
    }
  };

  const uploadButton = (
    <div className={style.uploadBtn} style={uploadBtnStyle}>
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

  // 点击删除文件
  const onRemoveHandle = (e: React.MouseEvent) => {
    if (disabled) return;
    e.stopPropagation();
    onChange?.('');
  };
  const uploadImg = (
    <div className={style.imgWrap} style={uploadBtnStyle}>
      {loading
        ? (
        <LoadingOutlined />
          )
        : (
        <>
          {!disabled && (
            <div className={style.iconWrap}>
              <span className={style.delIcon}>
                <Icon name="shanchu" onClick={onRemoveHandle} />
                <span>删除</span>
              </span>
            </div>
          )}
          <img className={style.img} src={value} alt="缩略图" />
        </>
          )}
    </div>
  );

  const uploadFile = async (options: any) => {
    // 创建一个空对象实例
    const uploadData = new FormData();
    // 调用append()方法来添加数据
    uploadData.append('file', options.file);
    uploadData.append('bizKey', 'news');
    const res: any = await uploadImage(uploadData);
    setLoading(false);
    if (res) {
      onChange?.(res.filePath);
    } else {
      message.error('长传失败');
    }
  };

  return (
    <div id={id}>
      <Upload
        accept="image/*"
        disabled={disabled}
        listType="picture-card"
        showUploadList={false}
        // action="/tenacity-admin/api/file/upload"
        customRequest={uploadFile}
        data={{ bizKey: 'news' }}
        beforeUpload={beforeUploadHandle}
        onChange={fileChange}
        className={classNames(style.imageUpload, className)}
      >
        {value ? uploadImg : uploadButton}
      </Upload>
    </div>
  );
};

export default ImageUpload;
