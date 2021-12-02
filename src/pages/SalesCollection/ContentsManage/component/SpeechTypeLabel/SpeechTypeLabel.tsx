import React from 'react';
import { Form, Input } from 'antd';
import { UploadImg, UploadFile } from 'src/pages/SalesCollection/ContentsManage/component';
import InputShowLength from 'src/pages/SalesCollection/SpeechManage/Components/InputShowLength/InputShowLength';
import style from './style.module.less';

interface ISpeechTypeLabelProps {
  type: number;
  posterImg: string;
  setPosterImg: (param: string) => void;
  fileList: any[];
}

const SpeechTypeLabel: React.FC<ISpeechTypeLabelProps> = ({ type, posterImg, setPosterImg, fileList }) => {
  return (
    <>
      {type === 2 && ( // 图片
        <>
          <UploadImg
            uploadImg={posterImg}
            setUploadImg={setPosterImg}
            imgLimitParam={{ type: ['image/jpeg'], size: 5, limitWidth: 0, limitHeight: 0 }}
            rules={[{ required: true, message: '图片仅支持.jpg格式' }]}
            extra={'图片宽度750px，高度不限，仅支持.jpg格式'}
          />
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
      {type === 5 && ( // 图文链接
        <>
          <UploadImg
            uploadImg={posterImg}
            setUploadImg={setPosterImg}
            imgLimitParam={{ type: ['image/jpeg'], size: 5, limitWidth: 0, limitHeight: 0 }}
            // rules={[{ required: true, message: '图片仅支持.jpg格式' }]}
            extra={'为确保最佳展示效果，请上传200*200像素高清图片，仅支持.jpg格式'}
          />
          <Form.Item
            className={style.formItem}
            name="title"
            label="图文标题:"
            // rules={[{ required: true, message: '请输入图文标题' }]}
          >
            <InputShowLength className={style.input} placeholder={'请输入图文摘要'} maxLength={30} />
          </Form.Item>
          <Form.Item
            className={style.formItem}
            name="summary"
            label="图文摘要:"
            // rules={[{ required: true, message: '请输入图文摘要' }]}
          >
            <InputShowLength className={style.input} placeholder={'请输入图文摘要'} maxLength={30} />
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
      {type === 6 && ( // 音频
        <>
          <UploadImg
            uploadImg={posterImg}
            setUploadImg={setPosterImg}
            imgLimitParam={{ type: ['image/jpeg'], size: 5, limitWidth: 0, limitHeight: 0 }}
            extra={'为确保最佳展示效果，请上传200*200像素高清图片，仅支持.jpg格式'}
          />
          <UploadFile
            fileList={fileList}
            imgLimitParam={{ type: ['audio/mpeg', 'audio/mp3'], size: 20 }}
            rules={[{ required: true, message: '请上传大小不超过20M的MP3语音文件' }]}
            extra={'请上传大小不超过20M的MP3语音文件'}
          />

          <Form.Item
            className={style.formItem}
            label="语音标题:"
            name="title"
            rules={[{ required: true, message: '请输入语音标题' }]}
          >
            <InputShowLength className={style.input} placeholder={'请输入语音标题'} maxLength={30} />
          </Form.Item>
          <Form.Item
            className={style.formItem}
            label="语音摘要:"
            name="summary"
            rules={[{ required: true, message: '请输入语音摘要' }]}
          >
            <InputShowLength className={style.input} placeholder={'请输入语音摘要'} maxLength={30} />
          </Form.Item>
        </>
      )}
      {type === 7 && ( // 视频
        <>
          <UploadImg
            uploadImg={posterImg}
            setUploadImg={setPosterImg}
            imgLimitParam={{ type: ['image/jpeg'], size: 5, limitWidth: 0, limitHeight: 0 }}
            extra={'为确保最佳展示效果，请上传200*200像素高清图片，仅支持.jpg格式'}
          />
          <UploadFile
            fileList={fileList}
            imgLimitParam={{ type: ['video/mp4'], size: 100 }}
            rules={[{ required: true, message: '请上传大小不超过100M的MP4视频文件' }]}
            extra={'请上传大小不超过100M的MP4视频文件'}
          />
          <Form.Item
            className={style.formItem}
            label="视频标题:"
            name="title"
            rules={[{ required: true, message: '请输入视频标题' }]}
          >
            <InputShowLength className={style.input} placeholder={'请输入视频标题'} maxLength={30} />
          </Form.Item>
          <Form.Item
            className={style.formItem}
            label="视频摘要:"
            name="summary"
            rules={[{ required: true, message: '请输入视频摘要' }]}
          >
            <InputShowLength className={style.input} placeholder={'请输入视频摘要'} maxLength={30} />
          </Form.Item>
        </>
      )}
      {type === 8 && ( // 第三方链接
        <>
          <UploadImg
            uploadImg={posterImg}
            setUploadImg={setPosterImg}
            imgLimitParam={{ type: ['image/jpeg'], size: 5, limitWidth: 0, limitHeight: 0 }}
            extra={'为确保最佳展示效果，请上传200*200像素高清图片，仅支持.jpg格式'}
          />
          <Form.Item
            className={style.formItem}
            label="标题:"
            name="title"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <InputShowLength className={style.input} placeholder={'请输入标题'} maxLength={30} />
          </Form.Item>
          <Form.Item
            className={style.formItem}
            label="摘要:"
            name="summary"
            rules={[{ required: true, message: '请输入摘要' }]}
          >
            <InputShowLength className={style.input} placeholder={'请输入摘要'} maxLength={30} />
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
      {type === 9 && ( // 小程序
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
          <UploadImg
            uploadImg={posterImg}
            setUploadImg={setPosterImg}
            imgLimitParam={{ type: ['image/jpeg'], size: 5, limitWidth: 0, limitHeight: 0 }}
            rules={[{ required: true, message: '图片仅支持.jpg格式' }]}
            extra={'为确保最佳展示效果，请上传200*200像素高清图片，仅支持.jpg格式'}
          />
          <Form.Item
            className={style.formItem}
            label="小程序标题:"
            name="title"
            rules={[{ required: true, message: '请输入小程序标题' }]}
          >
            <InputShowLength className={style.input} placeholder={'请输入小程序标题'} maxLength={30} />
          </Form.Item>
          <Form.Item
            className={style.formItem}
            label="小程序摘要:"
            name="summary"
            rules={[{ required: true, message: '请输入小程序摘要' }]}
          >
            <InputShowLength className={style.input} placeholder={'请输入小程序摘要'} maxLength={30} />
          </Form.Item>
        </>
      )}
    </>
  );
};
export default SpeechTypeLabel;
