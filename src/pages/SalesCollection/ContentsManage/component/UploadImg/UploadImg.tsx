import React from 'react';
import { Upload, message, Form } from 'antd';
import { Icon } from 'src/components/index';
import style from './style.module.less';

interface IUploadImgProps {
  posterImg: string;
  setPosterImg: (param: string) => void;
  imgLimitParam: { type: string[]; size: number; limitWidth: number; limitHeight?: number };
}

const UploadImg: React.FC<IUploadImgProps> = ({ posterImg, setPosterImg, imgLimitParam }) => {
  const normFile = (e: any) => {
    if (e.file.status === 'uploading') {
      return;
    }
    if (e.file.status === 'done') {
      setPosterImg(e.file.response.retdata.filePath);
      return e.file.response.retdata.filePath;
    }
  };
  // updaload beforeUpload
  const beforeUploadImgHandle = (file: File): Promise<boolean> => {
    const { type, size, limitWidth, limitHeight } = imgLimitParam;
    const suffix: string[] = type.map((item) => {
      if (item === 'image/jpeg') {
        return 'jpg';
      } else if (item === 'image/png') {
        return 'png';
      } else {
        return '';
      }
    });
    const suffixType = suffix.includes(file.name.split('.')[1]);
    const imgType = type.includes(file.type) && suffixType;
    if (!imgType) {
      message.error('请上传正确的图片格式');
    }
    const isSize = file.size / 1024 / 1024 < size;
    if (!isSize) {
      message.error(`图片大小不能超过${size}MB!`);
    }
    // 获取图片的真实尺寸
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        // @ts-ignore
        const data = e.target.result;
        // 加载图片获取图片真实宽度和高度
        const image = new Image();
        // @ts-ignore
        image.src = data;
        image.onload = function () {
          const width = image.width;
          if (limitHeight) {
            const height = image.height;
            if (!(width === limitWidth && height === limitHeight)) {
              message.error('请上传正确的图片尺寸');
            }
            resolve(width === limitWidth && height === limitHeight && imgType && isSize);
          } else {
            resolve(width === limitWidth && imgType && isSize);
          }
        };
      };
      reader.readAsDataURL(file);
    });
  };
  return (
    <>
      <Form.Item
        className={style.imgformItem}
        label="上传图片:"
        name={'thumbnail'}
        valuePropName="file"
        getValueFromEvent={normFile}
        rules={[{ required: true, message: '请上传宽度为750像素的图片，仅支持.jpg格式' }]}
        extra={'图片宽度750px，高度不限，仅支持.jpg格式'}
      >
        <Upload
          accept="image/*"
          listType="picture-card"
          action="/tenacity-admin/api/file/upload"
          data={{ bizKey: 'news' }}
          className={style.upload}
          showUploadList={false}
          beforeUpload={(file) => beforeUploadImgHandle(file)}
        >
          {posterImg
            ? (
            <img src={posterImg} alt="icon" style={{ width: '100%' }} />
              )
            : (
            <div className={style.iconWrap}>
              <Icon className={style.uploadIcon} name="upload" />
              <div className={style.uploadTip}>点击上传</div>
            </div>
              )}
        </Upload>
      </Form.Item>
    </>
  );
};
export default UploadImg;
