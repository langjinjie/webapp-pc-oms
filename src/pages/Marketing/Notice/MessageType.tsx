/**
 * @name MessageType
 * @author Lester
 * @date 2021-12-07 17:31
 */
import { Form, FormInstance } from 'antd';
import classNames from 'classnames';
import React from 'react';
import style from './style.module.less';
import { ImageUpload } from 'src/components';

interface MessageTypeProps {
  disabled?: boolean;
  value?: number;
  onChange?: (val: number) => void;
  form: FormInstance;
}

const MessageType: React.FC<MessageTypeProps> = ({ value, onChange, disabled, form }) => {
  const noticeUrl = 'https://insure-prod-server-1305111576.cos.ap-guangzhou.myqcloud.com/img/common/market/news1.png';
  const newsUrl = ' https://insure-prod-server-1305111576.cos.ap-guangzhou.myqcloud.com/img/common/market/notice1.png';
  const handleChange = (val: number) => {
    onChange?.(val);
    if (val) {
      form.setFieldsValue({
        coverImg: undefined
      });
    }
  };
  return (
    <ul className={style.msgTypeWrap}>
      <li
        className={classNames(style.msgTypeItem, { [style.active]: value === 1 })}
        onClick={() => !disabled && handleChange(1)}
      >
        <div className={style.msgDesc}>上新</div>
        <img className={style.msgImg} src={newsUrl} alt="" />
      </li>
      <li
        className={classNames(style.msgTypeItem, { [style.active]: value === 2 })}
        onClick={() => !disabled && handleChange(2)}
      >
        <div className={style.msgDesc}>通知</div>
        <img className={style.msgImg} src={noticeUrl} alt="" />
      </li>
      <li
        className={classNames(style.msgTypeItem, { [style.active]: value === 3 })}
        onClick={() => !disabled && handleChange(3)}
      >
        <div className={style.msgDesc}>其他</div>
        <Form.Item name={'coverImg'} rules={[{ required: value === 3, message: '消息图片为其他类型时需要上传图片' }]}>
          <ImageUpload
            disabled={value !== 3 || disabled}
            className={style.upload}
            uploadBtnStyle={{ width: '270px', height: '115px' }}
          ></ImageUpload>
        </Form.Item>
      </li>
    </ul>
  );
};

export default MessageType;
