import React from 'react';
import { Form, Input, message } from 'antd';
import NgUpload from 'src/pages/Marketing/Components/Upload/Upload';

import styles from './styles.module.less';
import InputShowLength from '../InputShowLength/InputShowLength';
import { RcFile } from 'antd/lib/upload';

interface SpeechItemProps {
  type?: number;
}
const SpeechItem: React.FC<SpeechItemProps> = ({ type }) => {
  // 图片校验
  const beforeUpload = (file: RcFile) => {
    const isJpg = file.type === 'image/jpeg';

    if (!isJpg) {
      message.error('你只可以上传 JPG 文件!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('图片大小不能超过 5MB!');
    }
    return isLt5M && isJpg;
    // let isW750 = false;
    // 读取图片数据

    // return new Promise((resolve) => {
    //   const reader = new FileReader();
    //   reader.onload = function (e) {
    //     // @ts-ignore
    //     const data = e.target.result;
    //     // 加载图片获取图片真实宽度和高度
    //     const image = new Image();
    //     // @ts-ignore
    //     image.src = data;
    //     image.onload = function () {
    //       const width = image.width;
    //       // const height = image.height;
    //       isW750 = width === 750;
    //       if (!isW750) {
    //         message.error('海报宽度必须为 750px');
    //       }
    //       resolve(isJpg && isLt5M && isW750);
    //     };
    //   };
    //   reader.readAsDataURL(file);
    // });
  };
  const beforeUploadSmallPic = (file: RcFile) => {
    const isJpg = file.type === 'image/jpeg';

    if (!isJpg) {
      message.error('你只可以上传 JPG 文件!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB!');
    }
    return isJpg && isLt2M;
  };
  const beforeUploadMedia = (file: RcFile, type: number) => {
    if (type === 6) {
      const isAudio = file.type === 'audio/mpeg';

      if (!isAudio) {
        message.error('你只可以上传 MP3 文件!');
      }

      const isLt20M = file.size / 1024 / 1024 < 20;
      if (!isLt20M) {
        message.error('音频大小不能超过 20MB!');
      }
      return isAudio && isLt20M;
    } else {
      const isMp4 = file.type === 'video/mp4';

      if (!isMp4) {
        message.error('你只可以上传 MP4 视频文件!');
      }

      const isLt100M = file.size / 1024 / 1024 < 100;
      if (!isLt100M) {
        message.error('视频大小不能超过 100MB!');
      }
      return isMp4 && isLt100M;
    }
  };
  return (
    <>
      {/* type = 2 长图 */}
      {type === 2 && (
        <Form.Item
          label={'上传图片'}
          name="contentUrl"
          rules={[{ required: true }]}
          extra="图片宽度750px，高度不限，仅支持.jpg格式"
        >
          <NgUpload beforeUpload={beforeUpload}></NgUpload>
        </Form.Item>
      )}

      {/* type = 3 名片 */}
      {type === 3 && (
        <Form.Item label="名片样式" name="pic">
          <div className={styles.posterWrap}>
            <img src={require('src/assets/images/sales/business_demo.jpg')} alt="" />
          </div>
        </Form.Item>
      )}
      {/* type = 4 小站 */}
      {type === 4 && (
        <Form.Item label="小站样式" name="pic">
          <div className={styles.userHomeWrap}>
            <img src={require('src/assets/images/sales/userHome_demo.jpg')} alt="" />
          </div>
        </Form.Item>
      )}
      {/* { id: 5, name: '单图文' } { id: 8, name: '第三方链接' } */}

      {(type === 5 || type === 8) && (
        <>
          <Form.Item
            label={'上传图片'}
            name="thumbnail"
            rules={[{ required: true }]}
            extra="为确保最佳展示效果，请上传200*200像素高清图片，仅支持.jpg格式"
          >
            <NgUpload beforeUpload={beforeUploadSmallPic}></NgUpload>
          </Form.Item>
          <Form.Item label="图文标题" name="title" rules={[{ required: true }, { max: 30 }]}>
            <InputShowLength className="width480" maxLength={30} placeholder={'请输入'} />
          </Form.Item>
          <Form.Item label="图文摘要" name="summary" rules={[{ required: true }, { max: 30 }]}>
            <InputShowLength className="width480" maxLength={30} placeholder={'请输入'} />
          </Form.Item>
          <Form.Item label="图文链接" name="contentUrl" rules={[{ required: true }]}>
            <Input className={'width480'}></Input>
          </Form.Item>
        </>
      )}
      {/* { id: 6, name: '单语音' }{ id: 7, name: '单视频' } */}
      {(type === 6 || type === 7) && (
        <>
          <Form.Item
            label={type === 6 ? '上传语音' : '上传视频'}
            name="contentUrl"
            rules={[{ required: true }]}
            extra={type === 6 ? '仅支持MP3格式，最大20M' : '仅支持MP4格式，最大100M'}
          >
            <NgUpload
              beforeUpload={(file) => beforeUploadMedia(file, type)}
              type={type === 6 ? 'audio' : 'video'}
              btnText={type === 6 ? '上传音频' : '上传视频'}
            />
          </Form.Item>
          <Form.Item
            label={'上传封面'}
            name="thumbnail"
            extra="为确保最佳展示效果，请上传200*200像素高清图片，仅支持.jpg格式"
          >
            <NgUpload beforeUpload={beforeUploadSmallPic}></NgUpload>
          </Form.Item>
          <Form.Item
            name="title"
            label={type === 6 ? '音频标题' : '视频标题'}
            rules={[{ required: true }, { max: 30 }]}
          >
            <InputShowLength className="width480" maxLength={30} placeholder={'请输入'} />
          </Form.Item>
          <Form.Item label="摘要" name="summary" rules={[{ required: true }, { max: 30 }]}>
            <InputShowLength className="width480" maxLength={30} placeholder={'请输入'} />
          </Form.Item>
        </>
      )}
      {/* { id: 9, name: '小程序链接' } */}
      {type === 9 && (
        <>
          <Form.Item name="appId" label="小程序Id" rules={[{ required: true }, { max: 40 }]}>
            <Input className="width480" placeholder={'请输入'} />
          </Form.Item>
          <Form.Item name="appPath" label="路径">
            <Input className="width480" placeholder={'请输入'} />
          </Form.Item>
          <Form.Item
            label={'上传图片'}
            name="thumbnail"
            rules={[{ required: true }]}
            extra="为确保最佳展示效果，请上传200*200像素高清图片，仅支持.jpg格式"
          >
            <NgUpload beforeUpload={beforeUploadSmallPic}></NgUpload>
          </Form.Item>
          <Form.Item name="title" label="小程序标题" rules={[{ required: true }, { max: 30 }]}>
            <InputShowLength className="width480" maxLength={30} placeholder={'请输入'} />
          </Form.Item>
          <Form.Item name="summary" label="小程序摘要" rules={[{ required: true }, { max: 30 }]}>
            <InputShowLength className="width480" maxLength={30} placeholder={'请输入'} />
          </Form.Item>
        </>
      )}
    </>
  );
};

export default SpeechItem;
