import React from 'react';
import { Form, Input, FormInstance } from 'antd';
import { UploadImg, UploadFile } from 'src/pages/SalesCollection/ContentsManage/component';
import { IContentParam } from 'src/utils/interface';
import InputShowLength from 'src/components/InputShowLength/InputShowLength';
import style from './style.module.less';

interface ISpeechTypeLabelProps {
  form: FormInstance<any>;
  type: IContentParam;
  uploadImg: string;
  setUploadImg: (param: string) => void;
  fileList: any[];
  setSubmitDisabled: (param: boolean) => void;
}

const SpeechTypeLabel: React.FC<ISpeechTypeLabelProps> = ({
  form,
  type,
  uploadImg,
  setUploadImg,
  fileList,
  setSubmitDisabled
}) => {
  return (
    <>
      {type.contentType === 2 && ( // 图片
        <>
          <UploadImg
            form={form}
            setSubmitDisabled={setSubmitDisabled}
            uploadImg={uploadImg}
            setUploadImg={setUploadImg}
            imgLimitParam={{ type: ['image/jpeg'], size: 5, limitWidth: 750, limitHeight: 0 }}
            rules={[{ required: true, message: '请上传宽度为750像素，格式为.jpg的图片' }]}
            extra={'图片宽度750像素，高度不限，仅支持.jpg格式'}
          />
        </>
      )}
      {type.contentType === 3 && ( // 名片
        <>
          <Form.Item className={style.formItem} label="名片样式:">
            <div className={style.card} />
          </Form.Item>
        </>
      )}
      {type.contentType === 4 && (
        <>
          <Form.Item className={style.formItem} label="小站样式:">
            <div className={style.station} />
          </Form.Item>
        </>
      )}
      {type.contentType === 5 && ( // 图文链接
        <>
          <UploadImg
            form={form}
            setSubmitDisabled={setSubmitDisabled}
            uploadImg={uploadImg}
            setUploadImg={setUploadImg}
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
      {type.contentType === 6 && ( // 音频
        <>
          <UploadImg
            form={form}
            setSubmitDisabled={setSubmitDisabled}
            uploadImg={uploadImg}
            setUploadImg={setUploadImg}
            imgLimitParam={{ type: ['image/jpeg'], size: 5, limitWidth: 0, limitHeight: 0 }}
            extra={'为确保最佳展示效果，请上传200*200像素高清图片，仅支持.jpg格式'}
          />
          <UploadFile
            type={'音频'}
            fileList={fileList}
            imgLimitParam={{ type: ['audio/mpeg', 'audio/mp3'], size: 20 }}
            rules={[{ required: true, message: '请上传大小不超过20MB的mp3音频文件' }]}
            extra={'仅支持.mp3格式，最大20MB'}
          />

          <Form.Item
            className={style.formItem}
            label="音频标题:"
            name="title"
            rules={[{ required: true, message: '请输入音频标题' }]}
          >
            <InputShowLength className={style.input} placeholder={'请输入音频标题'} maxLength={30} />
          </Form.Item>
          <Form.Item
            className={style.formItem}
            label="音频摘要:"
            name="summary"
            rules={[{ required: true, message: '请输入音频摘要' }]}
          >
            <InputShowLength className={style.input} placeholder={'请输入音频摘要'} maxLength={30} />
          </Form.Item>
        </>
      )}
      {type.contentType === 7 && ( // 视频
        <>
          <UploadImg
            form={form}
            setSubmitDisabled={setSubmitDisabled}
            uploadImg={uploadImg}
            setUploadImg={setUploadImg}
            imgLimitParam={{ type: ['image/jpeg'], size: 5, limitWidth: 0, limitHeight: 0 }}
            extra={'为确保最佳展示效果，请上传200*200像素高清图片，仅支持.jpg格式'}
          />
          <UploadFile
            type={'视频'}
            fileList={fileList}
            imgLimitParam={{ type: ['video/mp4'], size: 100 }}
            rules={[{ required: true, message: '请上传大小不超过100MB的mp4视频文件' }]}
            extra={'仅支持.mp4格式，最大100MB'}
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
      {type.contentType === 8 && ( // 第三方链接
        <>
          <UploadImg
            form={form}
            setSubmitDisabled={setSubmitDisabled}
            uploadImg={uploadImg}
            setUploadImg={setUploadImg}
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
      {type.contentType === 9 && ( // 小程序
        <>
          <Form.Item
            className={style.formItem}
            label="小程序ID:"
            name="appId"
            rules={[{ required: true, message: '请输入小程序ID' }]}
          >
            <Input className={style.miniProgressInput} placeholder="请输入小程序ID" />
          </Form.Item>
          <Form.Item className={style.formItem} label="路径:" name="appPath">
            <Input className={style.input} placeholder={'请输入小程序路径'} />
          </Form.Item>
          <UploadImg
            form={form}
            setSubmitDisabled={setSubmitDisabled}
            uploadImg={uploadImg}
            setUploadImg={setUploadImg}
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
      {type.contentType === 10 && ( // PDF
        <>
          <UploadImg
            form={form}
            setSubmitDisabled={setSubmitDisabled}
            uploadImg={uploadImg}
            setUploadImg={setUploadImg}
            imgLimitParam={{ type: ['image/jpeg'], size: 5, limitWidth: 0, limitHeight: 0 }}
            extra={'为确保最佳展示效果，请上传200*200像素高清图片，仅支持.jpg格式'}
          />
          <UploadFile
            type={'PDF'}
            fileList={fileList}
            imgLimitParam={{ type: ['application/pdf'], size: 50 }}
            rules={[{ required: true, message: '请上传大小不超过50MB的.pdf文件' }]}
            extra={'仅支持.pdf格式，最大50MB'}
          />
          <Form.Item
            className={style.formItem}
            label="PDF标题:"
            name="title"
            rules={[{ required: true, message: '请输入PDF标题' }]}
          >
            <InputShowLength className={style.input} placeholder={'请输入PDF标题'} maxLength={30} />
          </Form.Item>
          <Form.Item
            className={style.formItem}
            label="PDF摘要:"
            name="summary"
            rules={[{ required: true, message: '请输入PDF摘要' }]}
          >
            <InputShowLength className={style.input} placeholder={'请输入PDF摘要'} maxLength={30} />
          </Form.Item>
        </>
      )}
    </>
  );
};
export default SpeechTypeLabel;
