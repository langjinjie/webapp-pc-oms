import React, { useState } from 'react';
import { Modal, Form, Input, Select, Upload, message } from 'antd';
import { IAddOrEditModalParam } from 'src/utils/interface';
import { Icon } from 'src/components';
import { SpeechTypeLabel } from 'src/pages/SalesCollection/component';
import style from './style.module.less';
import classNames from 'classnames';

interface IAddOrEditContentProps {
  modalParam: IAddOrEditModalParam;
  setModalParam: (param: IAddOrEditModalParam) => void;
}

interface ISpeechParam {
  name: string;
  type: number;
}

const AddOrEditContent: React.FC<IAddOrEditContentProps> = ({ modalParam, setModalParam }) => {
  const [iconImg, setIconImg] = useState('');
  const [speechParam, setSpeechParam] = useState<ISpeechParam>({ name: '', type: 1 });
  const [form] = Form.useForm();
  const speechTypeList = [
    { value: 1, label: '话术' },
    { value: 2, label: '海报' },
    { value: 3, label: '名片' },
    { value: 4, label: '小站' },
    { value: 5, label: '单图文' },
    { value: 6, label: '单语音' },
    { value: 7, label: '单视频' },
    { value: 8, label: '第三方链接' },
    { value: 9, label: '小程序' }
  ];
  // inputOnchang
  const inputOnChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeechParam({ ...speechParam, name: e.target.value.trim() });
  };
  // selectOnchange
  const selectOnchangeHandle = (e: any) => {
    setSpeechParam({ ...speechParam, type: e });
  };
  // modal确认
  const modalOnOkHandle = async () => {
    console.log('确认Modal');
    console.log(form.getFieldsValue());
    const fieldsValue = await form.validateFields();
    console.log(fieldsValue);
    setModalParam({ ...modalParam, visible: false });
  };
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
          if (!(width === 750)) {
            message.error('海报宽度必须为 750px');
          }
          resolve(width === 750 && isJpgOrPng && isLt2M);
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
      setIconImg(e.file.response.retdata.filePath);
      return e.file.response.retdata.filePath;
    }
  };
  const onCancelHandle = () => {
    setModalParam({ ...modalParam, visible: false });
    form.setFieldsValue({});
  };
  return (
    <Modal
      width={modalParam.type === 3 ? 300 : modalParam.islastlevel ? 720 : 320}
      centered
      wrapClassName={classNames(style.modalWrap, {
        [style.noBorderWrap]: !modalParam.islastlevel || modalParam.type === 3
      })}
      closable={false}
      visible={modalParam.visible}
      title={modalParam.title}
      onCancel={onCancelHandle}
      onOk={modalOnOkHandle}
      destroyOnClose
    >
      <Form form={form}>
        {modalParam.type === 3
          ? (
          <div className={style.moadlContent}>{modalParam.content}</div>
            )
          : modalParam.islastlevel
            ? (
          <>
            <Form.Item className={style.modalContentFormItem} label="目录名称:" required>
              <Form.Item name="speechName" rules={[{ required: true, message: '请输入话术名称' }]} noStyle>
                <Input
                  className={style.modalContentInput}
                  placeholder={'请输入'}
                  maxLength={10}
                  onChange={inputOnChangeHandle}
                />
              </Form.Item>
              <span className={style.limitLength}>{speechParam.name.length}/10</span>
            </Form.Item>
            <Form.Item
              className={style.modalContentFormItem}
              label="话术格式:"
              name="speechType"
              rules={[{ required: true, message: '请选择话术格式' }]}
            >
              <Select className={style.modalContentSelect} placeholder={'请选择'} onChange={selectOnchangeHandle}>
                {speechTypeList.map((item) => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <SpeechTypeLabel type={speechParam.type} />
          </>
              )
            : (
          <>
            <Form.Item
              className={style.noLastFormItem}
              name="speechName"
              rules={[{ required: true, message: '请输入目录名称' }]}
            >
              <Input className={style.noLastLevelInput} placeholder={'输入目录名称（文字不超过4个字）'} />
            </Form.Item>
            <Form.Item className={style.noLastFormItem}>
              <div className={style.tip}>该目录需上传icon，请上传40x40像素的图片</div>
              <Form.Item
                name={'contentIcon'}
                valuePropName="file"
                getValueFromEvent={normFile}
                rules={[{ required: true, message: '请上传图片' }]}
                noStyle
              >
                <Upload
                  accept="image/*"
                  maxCount={1}
                  listType="picture-card"
                  action="/tenacity-admin/api/file/upload"
                  data={{ bizKey: 'news' }}
                  className={style.upload}
                  showUploadList={false}
                  beforeUpload={beforeUploadHandle}
                >
                  {iconImg
                    ? (
                    <img src={iconImg} alt="icon" style={{ width: '100%' }} />
                      )
                    : (
                    <div className={style.iconWrap}>
                      <Icon className={style.uploadIcon} name="upload" />
                      <div className={style.uploadTip}>点击上传</div>
                    </div>
                      )}
                </Upload>
              </Form.Item>
            </Form.Item>
          </>
              )}
      </Form>
    </Modal>
  );
};
export default AddOrEditContent;
