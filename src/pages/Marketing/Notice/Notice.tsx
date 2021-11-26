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
import { saveNotice, queryNotice } from 'src/apis/notice';
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

  const onSubmit = async (values: any) => {
    const { time, ...others } = values;
    const params: any = { ...others };
    if (time && time.length > 0) {
      if (time[0].valueOf() < moment().add(1, 'hours').valueOf()) {
        return message.error('生效时间请选择一小时以后');
      } else {
        params.startTime = time[0].format('YYYY-MM-DD HH:mm:ss');
        params.endTime = time[1].format('YYYY-MM-DD HH:mm:ss');
      }
    }
    const res: any = await saveNotice(params);
    if (res) {
      message.success('保存成功');
    }
  };

  const getNoticeData = async () => {
    const res: any = await queryNotice();
    if (res && res.noticeId) {
      const { content, imageUrl, startTime, endTime } = res;
      form.setFieldsValue({
        content,
        imageUrl,
        time: startTime && endTime ? [moment(startTime), moment(endTime)] : undefined
      });
    }
  };

  useEffect(() => {
    getNoticeData();
    setTitle('上新通知');
  }, []);

  return (
    <Card title="上新通知">
      <Form className={style.formWrap} form={form} onFinish={onSubmit} {...formLayout}>
        <Item name="content" label="公告" rules={[{ required: true, message: '请输入公告' }]}>
          <TextArea placeholder="请输入" showCount maxLength={100} autoSize={{ minRows: 4, maxRows: 6 }} />
        </Item>
        <Item name="imageUrl" label="图片">
          <ImageUpload />
        </Item>
        <Item name="time" label="生效时间" rules={[{ required: true, message: '请选择生效时间' }]}>
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
