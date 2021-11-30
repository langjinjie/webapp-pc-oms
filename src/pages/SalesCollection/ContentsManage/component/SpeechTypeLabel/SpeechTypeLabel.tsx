import React from 'react';
import { Form, Input, Upload, message, Button } from 'antd';
import { Icon } from 'src/components';
import style from './style.module.less';

interface ISpeechTypeLabelProps {
  type: number;
  posterImg: string;
  setPosterImg: (param: string) => void;
  fileList: any[];
  setFileList: (param: any[]) => void;
  maxLengthParam: IInputCurrentLength;
  setMaxLengthParam: (param: IInputCurrentLength) => void;
}

interface IInputCurrentLength {
  titleLength: number;
  summaryLength: number;
}

const SpeechTypeLabel: React.FC<ISpeechTypeLabelProps> = ({
  type,
  posterImg,
  setPosterImg,
  fileList,
  setFileList,
  maxLengthParam,
  setMaxLengthParam
}) => {
  // updaload beforeUpload
  const beforeUploadImgHandle = (
    file: File,
    type: string[],
    size: number,
    limitWidth: number,
    limitHeight?: number
  ): Promise<boolean> => {
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
  const beforeUploadFileHandle = (file: File, type: string[], size: number) => {
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
    console.log(suffixType);
    const fileType = type.includes(file.type) && suffixType;
    if (!fileType) {
      message.error(`请上传${suffix[0]}格式的文件`);
    }
    const isSize = file.size / 1024 / 1024 < size;
    console.log(isSize);
    if (!isSize) {
      message.error(`文件大小不能超过${size}MB!`);
    }
    return fileType && isSize;
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
  const normFiles = (e: any) => {
    if (e.file.status === 'uploading') {
      return;
    }
    if (e.file.status === 'done') {
      return e.file.response.retdata.filePath;
    }
  };
  // input onChange
  const inputOnChangeHandle = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    setMaxLengthParam({ ...maxLengthParam, ...{ [type]: e.target.value.length } });
  };
  // voice onChange
  const voiceOnChangeHandle = (info: any) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功`);
      setFileList(info.fileList);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  };
  // video onChange
  const vidoeOnChangeHandle = (info: any) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 视频上传成功`);
      return info.fileList;
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 视频上传失败.`);
    }
  };
  return (
    <>
      {type === 2 && ( // 长图
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
              beforeUpload={(file) => beforeUploadImgHandle(file, ['image/jpeg'], 5, 750, 0)}
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
            <div className={style.card} />
          </Form.Item>
        </>
      )}
      {type === 4 && (
        <>
          <Form.Item className={style.formItem} label="小站样式:">
            <div className={style.station} />
          </Form.Item>
        </>
      )}
      {type === 5 && ( // 图文/文章
        <>
          <Form.Item
            className={style.imgformItem}
            label="上传图片:"
            name={'thumbnail'}
            valuePropName="file"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: '请上传200*200像素的图片，仅支持.jpg格式' }]}
            extra={'为确保最佳展示效果，请上传200*200像素高清图片，仅支持.jpg格式'}
          >
            <Upload
              accept="image/*"
              listType="picture-card"
              action="/tenacity-admin/api/file/upload"
              data={{ bizKey: 'news' }}
              className={style.upload}
              showUploadList={false}
              beforeUpload={(file) => beforeUploadImgHandle(file, ['image/jpeg'], 5, 200, 200)}
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
          <Form.Item className={style.formItem} label="图文标题:" required>
            <Form.Item name="title" rules={[{ required: true, message: '请输入图文标题' }]} noStyle>
              <Input
                className={style.input}
                placeholder={'请输入图文标题'}
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
                placeholder={'请输入图文摘要'}
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
            <Input className={style.input} placeholder={'请输入图文链接'} />
          </Form.Item>
        </>
      )}
      {type === 6 && ( // 单语音
        <>
          <Form.Item
            className={style.imgformItem}
            label="上传图片:"
            name={'thumbnail'}
            valuePropName="file"
            getValueFromEvent={normFile}
            extra={'为确保最佳展示效果，请上传200*200像素高清图片，仅支持.jpg格式'}
          >
            <Upload
              accept="image/*"
              listType="picture-card"
              action="/tenacity-admin/api/file/upload"
              data={{ bizKey: 'news' }}
              className={style.upload}
              showUploadList={false}
              beforeUpload={(file) => beforeUploadImgHandle(file, ['image/jpeg'], 5, 200, 200)}
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
          <Form.Item
            className={style.voiceFormItem}
            label="上传语音:"
            name={'contentUrl'}
            valuePropName="file"
            getValueFromEvent={normFiles}
            rules={[{ required: true, message: '请上传大小不超过20M的MP3语音文件' }]}
          >
            <Upload
              className={style.uploadVoice}
              name="file"
              maxCount={1}
              action="/tenacity-admin/api/file/upload"
              data={{ bizKey: 'media' }}
              defaultFileList={fileList}
              onChange={voiceOnChangeHandle}
              beforeUpload={(file) => beforeUploadFileHandle(file, ['audio/mpeg', 'audio/mp3'], 20)}
            >
              <Button className={style.btn}>
                <Icon className={style.uploadIcon} name="shangchuanwenjian" />
                将文件拖拽至此区域，或<span className={style.uploadText}>点此上传</span>{' '}
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item className={style.formItem} label="语音标题:" required>
            <Form.Item name="title" rules={[{ required: true, message: '请输入语音标题' }]} noStyle>
              <Input
                className={style.input}
                placeholder={'请输入语音标题'}
                maxLength={30}
                onChange={(e) => inputOnChangeHandle(e, 'titleLength')}
              />
            </Form.Item>
            <span className={style.limitLength}>{maxLengthParam.titleLength}/30</span>
          </Form.Item>
          <Form.Item className={style.formItem} label="语音摘要:" required>
            <Form.Item name="summary" rules={[{ required: true, message: '请输入语音摘要' }]} noStyle>
              <Input
                className={style.input}
                placeholder={'请输入语音摘要'}
                maxLength={30}
                onChange={(e) => inputOnChangeHandle(e, 'summaryLength')}
              />
            </Form.Item>
            <span className={style.limitLength}>{maxLengthParam.summaryLength}/30</span>
          </Form.Item>
        </>
      )}
      {type === 7 && ( // 上传视频
        <>
          <Form.Item
            className={style.imgformItem}
            label="上传图片:"
            name={'thumbnail'}
            valuePropName="file"
            getValueFromEvent={normFile}
            extra={'为确保最佳展示效果，请上传200*200像素高清图片，仅支持.jpg格式'}
          >
            <Upload
              accept="image/*"
              listType="picture-card"
              action="/tenacity-admin/api/file/upload"
              data={{ bizKey: 'news' }}
              className={style.upload}
              showUploadList={false}
              beforeUpload={(file) => beforeUploadImgHandle(file, ['image/jpeg'], 5, 200, 200)}
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
          <Form.Item
            className={style.videoFormItem}
            label="上传视频:"
            name={'contentUrl'}
            valuePropName="file"
            getValueFromEvent={normFiles}
            rules={[{ required: true, message: '请上传大小不超过100M的MP4视频文件' }]}
          >
            <Upload
              className={style.uploadVideo}
              name={'file'}
              maxCount={1}
              action="/tenacity-admin/api/file/upload"
              data={{ bizKey: 'media' }}
              defaultFileList={fileList}
              onChange={vidoeOnChangeHandle}
              beforeUpload={(file) => beforeUploadFileHandle(file, ['video/mp4'], 100)}
            >
              <Button className={style.btn}>
                <Icon className={style.uploadIcon} name="shangchuanwenjian" />
                将文件拖拽至此区域，或<span className={style.uploadText}>点此上传</span>
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item className={style.formItem} label="视频标题:" required>
            <Form.Item name="title" rules={[{ required: true, message: '请输入视频标题' }]} noStyle>
              <Input
                className={style.input}
                placeholder={'请输入视频标题'}
                maxLength={30}
                onChange={(e) => inputOnChangeHandle(e, 'titleLength')}
              />
            </Form.Item>
            <span className={style.limitLength}>{maxLengthParam.titleLength}/30</span>
          </Form.Item>
          <Form.Item className={style.formItem} label="视频摘要:" required>
            <Form.Item name="summary" rules={[{ required: true, message: '请输入视频摘要' }]} noStyle>
              <Input
                className={style.input}
                placeholder={'请输入视频摘要'}
                maxLength={30}
                onChange={(e) => inputOnChangeHandle(e, 'summaryLength')}
              />
            </Form.Item>
            <span className={style.limitLength}>{maxLengthParam.summaryLength}/30</span>
          </Form.Item>
        </>
      )}
      {type === 8 && ( // 第三方链接
        <>
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
              beforeUpload={(file) => beforeUploadImgHandle(file, ['image/jpeg'], 5, 200, 200)}
              onRemove={() => console.log(1)}
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
          <Form.Item className={style.formItem} label="标题:" required>
            <Form.Item name="title" rules={[{ required: true, message: '请输入标题' }]} noStyle>
              <Input
                className={style.input}
                placeholder={'请输入标题'}
                maxLength={30}
                onChange={(e) => inputOnChangeHandle(e, 'titleLength')}
              />
            </Form.Item>
            <span className={style.limitLength}>{maxLengthParam.titleLength}/30</span>
          </Form.Item>
          <Form.Item className={style.formItem} label="摘要:" required>
            <Form.Item name="summary" rules={[{ required: true, message: '请输入摘要' }]} noStyle>
              <Input
                className={style.input}
                placeholder={'请输入摘要'}
                maxLength={30}
                onChange={(e) => inputOnChangeHandle(e, 'summaryLength')}
              />
            </Form.Item>
            <span className={style.limitLength}>{maxLengthParam.summaryLength}/30</span>
          </Form.Item>
          <Form.Item
            className={style.formItem}
            label="链接地址:"
            name="contentUrl"
            rules={[{ required: true, message: '请输入第三方链接' }]}
          >
            <Input className={style.input} placeholder={'请输入第三方链接'} />
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
            <Input className={style.modalContentSelect} placeholder="请输入小程序ID" />
          </Form.Item>
          <Form.Item className={style.formItem} label="路径:" name="appPath">
            <Input className={style.input} placeholder={'请输入小程序路径'} />
          </Form.Item>
          <Form.Item
            className={style.imgformItem}
            label="上传图片:"
            name={'thumbnail'}
            valuePropName="file"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: '请上传200*200像素高清图片，仅支持.jpg格式' }]}
            extra={'为确保最佳展示效果，请上传200*200像素高清图片，仅支持.jpg格式'}
          >
            <Upload
              accept="image/*"
              listType="picture-card"
              action="/tenacity-admin/api/file/upload"
              data={{ bizKey: 'news' }}
              className={style.upload}
              showUploadList={false}
              beforeUpload={(file) => beforeUploadImgHandle(file, ['image/jpeg'], 2, 200, 200)}
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
          <Form.Item className={style.formItem} label="小程序标题:" required>
            <Form.Item name="title" rules={[{ required: true, message: '请输入小程序标题' }]} noStyle>
              <Input
                className={style.input}
                placeholder={'请输入小程序标题'}
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
                placeholder={'请输入小程序摘要'}
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
