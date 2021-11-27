import React from 'react';
import { Form, Input } from 'antd';
import NgUpload from 'src/pages/Marketing/Components/Upload/Upload';

import styles from './styles.module.less';

interface SpeechItemProps {
  type?: number;
}
const SpeechItem: React.FC<SpeechItemProps> = ({ type }) => {
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
          <NgUpload></NgUpload>
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
            extra="图片宽度750px，高度不限，仅支持.jpg格式"
          >
            <NgUpload></NgUpload>
          </Form.Item>
          <Form.Item label="图文标题" name="title" rules={[{ required: true }, { max: 30 }]}>
            <Input className={'width480'}></Input>
          </Form.Item>
          <Form.Item label="图文摘要" name="summary" rules={[{ required: true }, { max: 30 }]}>
            <Input className={'width480'}></Input>
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
            <NgUpload type={type === 6 ? 'audio' : 'video'} btnText={type === 6 ? '上传音频' : '上传视频'} />
          </Form.Item>
          <Form.Item
            name="title"
            label={type === 6 ? '音频标题' : '视频标题'}
            rules={[{ required: true }, { max: 30 }]}
          >
            <Input className={'width480'}></Input>
          </Form.Item>
          <Form.Item
            label={'上传封面'}
            name="thumbnail"
            rules={[{ required: true }]}
            extra="为确保最佳展示效果，请上传200*200像素高清图片，仅支持.jpg格式"
          >
            <NgUpload></NgUpload>
          </Form.Item>
        </>
      )}
      {/* { id: 9, name: '小程序链接' } */}
      {type === 9 && (
        <>
          <Form.Item
            label={'上传图片'}
            name="pic"
            rules={[{ required: true }]}
            extra="为确保最佳展示效果，请上传200*200像素高清图片，仅支持.jpg格式"
          >
            <NgUpload></NgUpload>
          </Form.Item>
          <Form.Item label="图文标题" rules={[{ required: true }, { max: 30 }]}>
            <Input></Input>
          </Form.Item>
          <Form.Item label="图文摘要" rules={[{ required: true }, { max: 30 }]}>
            <Input></Input>
          </Form.Item>
        </>
      )}
    </>
  );
};

export default SpeechItem;
