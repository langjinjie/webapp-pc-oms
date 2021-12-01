import React from 'react';
import { Form, Input } from 'antd';
import { UploadImg, UploadFile } from 'src/pages/SalesCollection/ContentsManage/component';
import style from './style.module.less';

interface ISpeechTypeLabelProps {
  type: number;
  posterImg: string;
  setPosterImg: (param: string) => void;
  fileList: any[];
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
  maxLengthParam,
  setMaxLengthParam
}) => {
  // input onChange
  const inputOnChangeHandle = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    setMaxLengthParam({ ...maxLengthParam, ...{ [type]: e.target.value.length } });
  };
  return (
    <>
      {type === 2 && ( // 长图
        <>
          <UploadImg
            uploadImg={posterImg}
            setUploadImg={setPosterImg}
            imgLimitParam={{ type: ['image/jpeg'], size: 5, limitWidth: 750, limitHeight: 0 }}
            rules={[{ required: true, message: '请上传宽度为750像素的图片，仅支持.jpg格式' }]}
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
      {type === 5 && ( // 图文/文章
        <>
          <UploadImg
            uploadImg={posterImg}
            setUploadImg={setPosterImg}
            imgLimitParam={{ type: ['image/jpeg'], size: 5, limitWidth: 200, limitHeight: 200 }}
            rules={[{ required: true, message: '请上传200*200像素的图片，仅支持.jpg格式' }]}
            extra={'为确保最佳展示效果，请上传200*200像素高清图片，仅支持.jpg格式'}
          />
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
                onChange={(e) => inputOnChangeHandle(e, 'summaryLength')}
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
          <UploadImg
            uploadImg={posterImg}
            setUploadImg={setPosterImg}
            imgLimitParam={{ type: ['image/jpeg'], size: 5, limitWidth: 200, limitHeight: 200 }}
            extra={'为确保最佳展示效果，请上传200*200像素高清图片，仅支持.jpg格式'}
          />
          <UploadFile
            fileList={fileList}
            imgLimitParam={{ type: ['audio/mpeg', 'audio/mp3'], size: 20 }}
            rules={[{ required: true, message: '请上传大小不超过20M的MP3语音文件' }]}
            extra={'请上传大小不超过20M的MP3语音文件'}
          />

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
          <UploadImg
            uploadImg={posterImg}
            setUploadImg={setPosterImg}
            imgLimitParam={{ type: ['image/jpeg'], size: 5, limitWidth: 200, limitHeight: 200 }}
            extra={'为确保最佳展示效果，请上传200*200像素高清图片，仅支持.jpg格式'}
          />
          <UploadFile
            fileList={fileList}
            imgLimitParam={{ type: ['video/mp4'], size: 100 }}
            rules={[{ required: true, message: '请上传大小不超过100M的MP4视频文件' }]}
            extra={'请上传大小不超过100M的MP4视频文件'}
          />
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
          <UploadImg
            uploadImg={posterImg}
            setUploadImg={setPosterImg}
            imgLimitParam={{ type: ['image/jpeg'], size: 5, limitWidth: 200, limitHeight: 200 }}
            extra={'为确保最佳展示效果，请上传200*200像素高清图片，仅支持.jpg格式'}
          />
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
          <UploadImg
            uploadImg={posterImg}
            setUploadImg={setPosterImg}
            imgLimitParam={{ type: ['image/jpeg'], size: 5, limitWidth: 200, limitHeight: 200 }}
            rules={[{ required: true, message: '请上传200*200像素高清图片，仅支持.jpg格式' }]}
            extra={'为确保最佳展示效果，请上传200*200像素高清图片，仅支持.jpg格式'}
          />
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
