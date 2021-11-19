/**
 * @name Notice
 * @author Lester
 * @date 2021-11-18 16:50
 */
import React, { useEffect } from 'react';
import { Card, Form, Input, DatePicker, FormProps, Button, message } from 'antd';
import { setTitle } from 'lester-tools';
import moment from 'moment';
import { ImageUpload } from 'src/components';
import style from './style.module.less';

const { Item, useForm } = Form;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const Notice: React.FC = () => {
  const [form] = useForm();

  const formLayout: FormProps = {
    labelAlign: 'right',
    labelCol: { span: 3 },
    wrapperCol: { span: 8 }
  };

  const onSubmit = (values: any) => {
    const { time } = values;
    console.log(values);
    if (time && time.length > 0) {
      if (time[0].valueOf() < moment().add(1, 'hours').valueOf()) {
        return message.error('生效时间请选择一小时以后');
      }
    }
  };

  useEffect(() => {
    setTitle('上新通知');
    console.log(moment().add(1, 'hours').format('YYYY-MM-DD HH:mm:ss'));
  }, []);

  return (
    <Card title="上新通知">
      <Form className={style.formWrap} form={form} onFinish={onSubmit} {...formLayout}>
        <Item name="noticeText" label="公告" rules={[{ required: true, message: '请输入公告' }]}>
          <TextArea placeholder="请输入" showCount maxLength={100} autoSize={{ minRows: 4, maxRows: 6 }} />
        </Item>
        <Item name="imgUrl" label="图片">
          <ImageUpload />
        </Item>
        <Item name="time" label="生效时间">
          <RangePicker
            disabledDate={(date) => date && date < moment().startOf('day')}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
          />
        </Item>
        <div className={style.btnWrap}>
          <Button htmlType="submit" type="primary">
            确认
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default Notice;
