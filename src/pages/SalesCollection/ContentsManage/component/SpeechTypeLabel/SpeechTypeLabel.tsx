import React, { useState } from 'react';
import { Form, Select, Input, Upload, message, Button } from 'antd';
import { Icon } from 'src/components';
import style from './style.module.less';

interface ISpeechTypeLabelProps {
  type: number;
}

interface IInputCurrentLength {
  articleTitleLength: number;
  articleSummaryLength: number;
  voiceTitleLength: number;
  videoTitleLength: number;
  miniProgramTitleLength: number;
  miniProgramSummaryLength: number;
}

const SpeechTypeLabel: React.FC<ISpeechTypeLabelProps> = ({ type }) => {
  const [posterImg, setPosterImg] = useState('');
  const [maxLengthParam, setMaxLengthParam] = useState<IInputCurrentLength>({
    articleTitleLength: 0, //
    articleSummaryLength: 0,
    voiceTitleLength: 0,
    videoTitleLength: 0,
    miniProgramTitleLength: 0,
    miniProgramSummaryLength: 0
  });
  // updaload beforeUpload
  const beforeUploadHandle = (file: File): Promise<boolean> => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只允许上传JPG/PNG文件!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过2MB!');
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
          const height = image.height;
          if (!(width === 40 && height === 40)) {
            message.error('图标尺寸必须为');
          }
          resolve(width === 40 && height === 40 && isJpgOrPng && isLt2M);
          resolve(true);
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
      {type === 2 && ( // 海报
        <>
          <Form.Item className={style.formItem} label="海报ID:" name="posterId">
            {/* <Select className={style.modalContentSelect} placeholder={'请选择'}>
              <Select.Option value="demo">Demo</Select.Option>
            </Select> */}
            <Input className={style.modalContentSelect} placeholder="请输入海报ID" />
          </Form.Item>
          <Form.Item
            className={style.imgformItem}
            label="上传海报:"
            name={'posterImg'}
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
              beforeUpload={beforeUploadHandle}
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
            <Select className={style.modalContentSelect} placeholder={'请选择'}>
              <Select.Option value="demo">Demo</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            className={style.imgformItem}
            label="上传图片:"
            name={'articleImg'}
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
              beforeUpload={beforeUploadHandle}
            >
              <div className={style.iconWrap}>
                <Icon className={style.uploadIcon} name="upload" />
                <div className={style.uploadTip}>点击上传</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item className={style.formItem} label="图文标题:" required>
            <Form.Item name="aricleTitle" rules={[{ required: true, message: '请输入图文标题' }]} noStyle>
              <Input
                className={style.input}
                placeholder={'请输入'}
                maxLength={30}
                onChange={(e) => inputOnChangeHandle(e, 'articleTitleLength')}
              />
            </Form.Item>
            <span className={style.limitLength}>{maxLengthParam.articleTitleLength}/30</span>
          </Form.Item>
          <Form.Item className={style.formItem} label="图文摘要:" required>
            <Form.Item name="aricleSummary" rules={[{ required: true, message: '请输入图文摘要' }]} noStyle>
              <Input
                className={style.input}
                placeholder={'请输入'}
                maxLength={30}
                onChange={(e) => inputOnChangeHandle(e, 'articleSummaryLength')}
              />
            </Form.Item>
            <span className={style.limitLength}>{maxLengthParam.articleSummaryLength}/30</span>
          </Form.Item>
          <Form.Item
            className={style.formItem}
            name="aricleLink"
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
            name={'voiceFile'}
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
          <Form.Item className={style.formItem} label="语音标题:" required>
            <Form.Item name="voice" rules={[{ required: true, message: '请输入语音标题' }]} noStyle>
              <Input
                className={style.input}
                placeholder={'请输入'}
                maxLength={30}
                onChange={(e) => inputOnChangeHandle(e, 'voiceTitleLength')}
              />
            </Form.Item>
            <span className={style.limitLength}>{maxLengthParam.voiceTitleLength}/30</span>
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
            <Form.Item name="video" rules={[{ required: true, message: '请输入视频标题' }]} noStyle>
              <Input
                className={style.input}
                placeholder={'请输入'}
                maxLength={30}
                onChange={(e) => inputOnChangeHandle(e, 'videoTitleLength')}
              />
            </Form.Item>
            <span className={style.limitLength}>{maxLengthParam.videoTitleLength}/30</span>
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
          <Form.Item className={style.formItem} label="小程序ID:" name="miniProgramId">
            <Select className={style.modalContentSelect} placeholder={'请选择'}>
              <Select.Option value="demo">Demo</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item className={style.formItem} label="路径:" name="miniProgramLink">
            <Input className={style.input} placeholder={'请输入'} />
          </Form.Item>
          <Form.Item
            className={style.imgformItem}
            label="上传图片:"
            name={'miniProgramImg'}
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
              beforeUpload={beforeUploadHandle}
            >
              <div className={style.iconWrap}>
                <Icon className={style.uploadIcon} name="upload" />
                <div className={style.uploadTip}>点击上传</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item className={style.formItem} label="小程序标题:" required>
            <Form.Item name="miniProgramTitle" rules={[{ required: true, message: '请输入小程序标题' }]} noStyle>
              <Input
                className={style.input}
                placeholder={'请输入'}
                maxLength={30}
                onChange={(e) => inputOnChangeHandle(e, 'miniProgramTitleLength')}
              />
            </Form.Item>
            <span className={style.limitLength}>{maxLengthParam.miniProgramTitleLength}/30</span>
          </Form.Item>
          <Form.Item className={style.formItem} label="小程序摘要:" required>
            <Form.Item name="miniProgramSummary" rules={[{ required: true, message: '请输入小程序摘要' }]} noStyle>
              <Input
                className={style.input}
                placeholder={'请输入'}
                maxLength={30}
                onChange={(e) => inputOnChangeHandle(e, 'miniProgramSummaryLength')}
              />
            </Form.Item>
            <span className={style.limitLength}>{maxLengthParam.miniProgramSummaryLength}/30</span>
          </Form.Item>
        </>
      )}
    </>
  );
};
export default SpeechTypeLabel;
