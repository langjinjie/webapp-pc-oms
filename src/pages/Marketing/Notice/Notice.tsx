/**
 * @name Notice
 * @author Lester
 * @date 2021-11-18 16:50
 */
import React, { useEffect, useState } from 'react';
import { Card, Form, Input, DatePicker, FormProps, Button, Radio, message } from 'antd';
import { setTitle } from 'lester-tools';
import moment from 'moment';
import { ImageUpload } from 'src/components';
import { saveNotice, queryNotice } from 'src/apis/notice';
import MessageType from './MessageType';
import style from './style.module.less';

const { Item, useForm } = Form;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Group } = Radio;

const Notice: React.FC = () => {
  const [isPush, setIsPush] = useState<number>(0);

  const [form] = useForm();

  const formLayout: FormProps = {
    labelAlign: 'right',
    labelCol: { span: 3 },
    wrapperCol: { span: 8 }
  };

  const onSubmit = async (values: any) => {
    return console.log(values);
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
    setTitle('新增公告');
  }, []);

  return (
    <Card title="新增公告">
      <Form className={style.formWrap} form={form} onFinish={onSubmit} {...formLayout}>
        <Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
          <Input placeholder="请输入" maxLength={60} />
        </Item>
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
        <Item name="isPush" label="消息推送" initialValue={0}>
          <Group onChange={(e) => setIsPush(e.target.value)}>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </Group>
        </Item>
        {isPush === 1 && (
          <Item name="messageType" label="消息类型" rules={[{ required: true, message: '请选择消息类型' }]}>
            <MessageType />
          </Item>
        )}
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
