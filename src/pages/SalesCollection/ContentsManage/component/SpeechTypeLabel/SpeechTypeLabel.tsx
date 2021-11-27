import React, { useState } from 'react';
import { Form, Input, Upload, message, Button } from 'antd';
import { Icon } from 'src/components';
import style from './style.module.less';

interface ISpeechTypeLabelProps {
  type: number;
  posterImg: string;
  setPosterImg: (param: string) => void;
}

interface IInputCurrentLength {
  titleLength: number;
  summaryLength: number;
}

const SpeechTypeLabel: React.FC<ISpeechTypeLabelProps> = ({ type, posterImg, setPosterImg }) => {
  const [maxLengthParam, setMaxLengthParam] = useState<IInputCurrentLength>({
    titleLength: 0,
    summaryLength: 0
  });
  // updaload beforeUpload
  const beforeUploadImgHandle = (
    file: File,
    type: string[],
    size: number,
    limitWidth: number,
    limitHeight?: number
  ): Promise<boolean> => {
    const imgType = type.includes(file.type);
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
  const normFile = (e: any) => {
    if (e.file.status === 'uploading') {
      return;
    }
    if (e.file.status === 'done') {
      setPosterImg(e.file.response.retdata.filePath);
      return e.file.response.retdata.filePath;
    }
  };
  // input onChange
  const inputOnChangeHandle = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    setMaxLengthParam({ ...maxLengthParam, ...{ [type]: e.target.value.length } });
  };
  // voice onChange
  const voiceOnChangeHandle = (info: any) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };
  // video onChange
  const vidoeOnChangeHandle = (info: any) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 视频上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 视频上传失败.`);
    }
  };
  return (
    <>
      {type === 2 && ( // 长图
        <>
          <Form.Item className={style.formItem} label="图片ID:" name="posterId">
            {/* <Select className={style.modalContentSelect} placeholder={'请选择'}>
              <Select.Option value="demo">Demo</Select.Option>
            </Select> */}
            <Input className={style.modalContentSelect} placeholder="请输入图片ID" />
          </Form.Item>
          <Form.Item
            className={style.imgformItem}
            label="上传图片:"
            name={'contentUrl'}
            valuePropName="file"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: '请上传图片' }]}
            extra={'图片宽度750px，高度不限，仅支持.jpg格式'}
          >
            <Upload
              accept="image/*"
              listType="picture-card"
              action="/tenacity-admin/api/file/upload"
              data={{ bizKey: 'news' }}
              className={style.upload}
              showUploadList={false}
              beforeUpload={(file) => beforeUploadImgHandle(file, ['image/jpge,image/png'], 2, 750, 0)}
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
      )}
      {type === 3 && ( // 名片
        <>
          <Form.Item className={style.formItem} label="名片样式:">
            <div className={style.card}></div>
          </Form.Item>
        </>
      )}
      {type === 4 && (
        <>
          <Form.Item className={style.formItem} label="小站样式:">
            <div className={style.station}>
              <div className={style.name}>我的小站</div>
              <div className={style.stationContent}>
                <div className={style.content}>小站介绍文字描述</div>
                <img className={style.img} src={require('src/assets/images/artImg.png')} alt="station" />
              </div>
            </div>
          </Form.Item>
        </>
      )}
      {type === 5 && ( // 图文/文章
        <>
          <Form.Item className={style.formItem} label="文章ID:" name="articleId">
            {/* <Select className={style.modalContentSelect} placeholder={'请选择'}>
              <Select.Option value="demo">Demo</Select.Option>
            </Select> */}
            <Input className={style.modalContentSelect} placeholder="请输入文章ID" />
          </Form.Item>
          <Form.Item
            className={style.imgformItem}
            label="上传图片:"
            name={'thumbnail'}
            valuePropName="file"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: '请上传图片' }]}
            extra={'为确保最佳展示效果，请上传200*200像素高清图片，仅支持.jpg格式'}
          >
            <Upload
              accept="image/*"
              listType="picture-card"
              action="/tenacity-admin/api/file/upload"
              data={{ bizKey: 'news' }}
              className={style.upload}
              showUploadList={false}
              beforeUpload={(file) => beforeUploadImgHandle(file, ['image/jpge'], 2, 200, 200)}
            >
              <div className={style.iconWrap}>
                <Icon className={style.uploadIcon} name="upload" />
                <div className={style.uploadTip}>点击上传</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item className={style.formItem} label="图文标题:" required>
            <Form.Item name="title" rules={[{ required: true, message: '请输入图文标题' }]} noStyle>
              <Input
                className={style.input}
                placeholder={'请输入'}
                maxLength={30}
                onChange={(e) => inputOnChangeHandle(e, 'titleLength')}
              />
            </Form.Item>
            <span className={style.limitLength}>{maxLengthParam.titleLength}/30</span>
          </Form.Item>
          <Form.Item className={style.formItem} label="图文摘要:" required>
            <Form.Item name="summary" rules={[{ required: true, message: '请输入图文摘要' }]} noStyle>
              <Input
                className={style.input}
                placeholder={'请输入'}
                maxLength={30}
                onChange={(e) => inputOnChangeHandle(e, 'summary')}
              />
            </Form.Item>
            <span className={style.limitLength}>{maxLengthParam.summaryLength}/30</span>
          </Form.Item>
          <Form.Item
            className={style.formItem}
            name="contentUrl"
            label="图文链接:"
            rules={[{ required: true, message: '请输入图文链接' }]}
          >
            <Input className={style.input} placeholder={'请输入'} />
          </Form.Item>
        </>
      )}
      {type === 6 && ( // 单语音
        <>
          <Form.Item
            className={style.voiceFormItem}
            label="上传语音:"
            name={'contentUrl'}
            valuePropName="file"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: '请上传语音图片' }]}
          >
            <Upload
              className={style.uploadVoice}
              name="file"
              action="/tenacity-admin/api/file/upload"
              data={{ bizKey: 'news' }}
              onChange={voiceOnChangeHandle}
            >
              <Button className={style.btn}>
                <Icon name="icon_daohang_28_jiahaoyou" />
                将文件拖拽至此区域，或<span className={style.uploadText}>点此上传</span>{' '}
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item
            className={style.imgformItem}
            label="上传图片:"
            name={'thumbnail'}
            valuePropName="file"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: '请上传图片' }]}
            extra={'为确保最佳展示效果，请上传200*200像素高清图片，仅支持.jpg格式'}
          >
            <Upload
              accept="image/*"
              listType="picture-card"
              action="/tenacity-admin/api/file/upload"
              data={{ bizKey: 'news' }}
              className={style.upload}
              showUploadList={false}
              beforeUpload={(file) => beforeUploadImgHandle(file, ['image/jpge'], 2, 200, 200)}
            >
              <div className={style.iconWrap}>
                <Icon className={style.uploadIcon} name="upload" />
                <div className={style.uploadTip}>点击上传</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item className={style.formItem} label="语音标题:" required>
            <Form.Item name="title" rules={[{ required: true, message: '请输入语音标题' }]} noStyle>
              <Input
                className={style.input}
                placeholder={'请输入'}
                maxLength={30}
                onChange={(e) => inputOnChangeHandle(e, 'titleLength')}
              />
            </Form.Item>
            <span className={style.limitLength}>{maxLengthParam.titleLength}/30</span>
          </Form.Item>
        </>
      )}
      {type === 7 && ( // 上传视频
        <>
          <Form.Item
            className={style.videoFormItem}
            label="上传视频:"
            name="videoFile"
            valuePropName="file"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: '请上传视频' }]}
          >
            <Upload
              className={style.uploadVideo}
              name="file"
              action="/tenacity-admin/api/file/upload"
              data={{ bizKey: 'news' }}
              onChange={vidoeOnChangeHandle}
              beforeUpload={(e) => console.log(e)}
            >
              <Button className={style.btn}>
                <Icon name="icon_daohang_28_jiahaoyou" />
                将文件拖拽至此区域，或<span className={style.uploadText}>点此上传</span>{' '}
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item className={style.formItem} label="视频标题:" required>
            <Form.Item name="title" rules={[{ required: true, message: '请输入视频标题' }]} noStyle>
              <Input
                className={style.input}
                placeholder={'请输入'}
                maxLength={30}
                onChange={(e) => inputOnChangeHandle(e, 'titleLength')}
              />
            </Form.Item>
            <span className={style.limitLength}>{maxLengthParam.titleLength}/30</span>
          </Form.Item>
        </>
      )}
      {type === 8 && ( // 第三方链接
        <>
          <Form.Item
            className={style.formItem}
            label="链接地址:"
            name="link"
            rules={[{ required: true, message: '请输入第三方链接' }]}
          >
            <Input className={style.input} placeholder={'请输入'} />
          </Form.Item>
        </>
      )}
      {type === 9 && (
        <>
          <Form.Item
            className={style.formItem}
            label="小程序ID:"
            name="appId"
            rules={[{ required: true, message: '请输入小程序ID' }]}
          >
            <Input className={style.modalContentSelect} placeholder="请输入文章ID" />
          </Form.Item>
          <Form.Item className={style.formItem} label="路径:" name="appPath">
            <Input className={style.input} placeholder={'请输入'} />
          </Form.Item>
          <Form.Item
            className={style.imgformItem}
            label="上传图片:"
            name={'thumbnail'}
            valuePropName="file"
            getValueFromEvent={normFile}
            // rules={[{ required: true, message: '请上传图片' }]}
            extra={'为确保最佳展示效果，请上传200*200像素高清图片，仅支持.jpg格式'}
          >
            <Upload
              accept="image/*"
              listType="picture-card"
              action="/tenacity-admin/api/file/upload"
              data={{ bizKey: 'news' }}
              className={style.upload}
              showUploadList={false}
              beforeUpload={(file) => beforeUploadImgHandle(file, ['image/jpge'], 2, 200, 200)}
            >
              <div className={style.iconWrap}>
                <Icon className={style.uploadIcon} name="upload" />
                <div className={style.uploadTip}>点击上传</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item className={style.formItem} label="小程序标题:" required>
            <Form.Item name="title" rules={[{ required: true, message: '请输入小程序标题' }]} noStyle>
              <Input
                className={style.input}
                placeholder={'请输入'}
                maxLength={30}
                onChange={(e) => inputOnChangeHandle(e, 'titleLength')}
              />
            </Form.Item>
            <span className={style.limitLength}>{maxLengthParam.titleLength}/30</span>
          </Form.Item>
          <Form.Item className={style.formItem} label="小程序摘要:" required>
            <Form.Item name="summary" rules={[{ required: true, message: '请输入小程序摘要' }]} noStyle>
              <Input
                className={style.input}
                placeholder={'请输入'}
                maxLength={30}
                onChange={(e) => inputOnChangeHandle(e, 'summaryLength')}
              />
            </Form.Item>
            <span className={style.limitLength}>{maxLengthParam.summaryLength}/30</span>
          </Form.Item>
        </>
      )}
    </>
  );
};
export default SpeechTypeLabel;
