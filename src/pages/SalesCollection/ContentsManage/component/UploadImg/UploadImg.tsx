import React from 'react';
import { Upload, message, Form, FormInstance } from 'antd';
import { Icon } from 'src/components/index';

import style from './style.module.less';

interface IUploadImgProps {
  form?: FormInstance<any>;
  setSubmitDisabled: (param: boolean) => void;
  uploadImg: string;
  setUploadImg: (param: string) => void;
  imgLimitParam: { type: string[]; size: number; limitWidth: number; limitHeight?: number };
  rules?: [{ required: boolean; message: string }];
  extra?: string;
}

const UploadImg: React.FC<IUploadImgProps> = ({
  form,
  setSubmitDisabled,
  uploadImg,
  setUploadImg,
  imgLimitParam,
  rules,
  extra
}) => {
  const normFile = (e: any) => {
    if (e.file.status === 'uploading') {
      return;
    }
    if (e.file.status === 'done') {
      setUploadImg(e.file.response.retdata.filePath);
      return e.file.response.retdata.filePath;
    }
  };
  // updaload beforeUpload
  const beforeUploadImgHandle = (file: File): Promise<boolean> | boolean => {
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
    const suffixType = suffix.includes(file.name.split('.')[file.name.split('.').length - 1]);
    const imgType = type.includes(file.type) && suffixType;
    if (!imgType) message.error('请上传.' + suffix[0] + '的图片格式');
    const isSize = file.size / 1024 / 1024 < size;
    if (!isSize) message.error(`图片大小不能超过${size}MB!`);
    // 不限制等宽高
    if (!limitWidth) return imgType && isSize;
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
          const height = image.height;
          // if (limitWidth) {
          if (limitHeight) {
            if (!(width === limitWidth && height === limitHeight)) {
              message.error('请上传正确的图片尺寸');
            }
            resolve(width === limitWidth && height === limitHeight && imgType && isSize);
          } else {
            if (!(width === limitWidth)) {
              message.error('请上传正确的图片尺寸');
            }
            resolve(width === limitWidth && imgType && isSize);
          }
          // } else {
          // 限制等宽高
          //   if (!(width === height)) {
          //     message.error('请上传正方形的图片');
          //   }
          //   resolve(width === height && imgType && isSize);
          // }
        };
      };
      reader.readAsDataURL(file);
    });
  };
  // 点击删除图片icon
  const delIconHandle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    form?.setFieldsValue({ thumbnail: '' });
    setUploadImg('');
    await form?.validateFields();
    setSubmitDisabled(false);
  };
  return (
    <>
      <Form.Item
        className={style.imgformItem}
        label="上传图片:"
        name={'thumbnail'}
        valuePropName="file"
        getValueFromEvent={normFile}
        rules={rules}
        extra={extra}
      >
        <Upload
          accept="image/*"
          listType="picture-card"
          action="/tenacity-admin/api/file/upload"
          data={{ bizKey: 'news' }}
          className={style.uploadWrap}
          showUploadList={false}
          beforeUpload={(file) => beforeUploadImgHandle(file)}
        >
          {uploadImg
            ? (
            <div className={style.imgWrap}>
              <div className={style.iconWrap}>
                <Icon className={style.delIcon} name="shanchu" onClick={(e) => delIconHandle(e)} />
              </div>
              <img src={uploadImg} alt="icon" />
            </div>
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
