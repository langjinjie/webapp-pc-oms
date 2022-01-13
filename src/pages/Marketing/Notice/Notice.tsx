/**
 * @name Notice
 * @author Lester
 * @date 2021-11-18 16:50
 */
import React, { useEffect, useState } from 'react';
import { Card, Form, Input, DatePicker, FormProps, Button, Radio, message } from 'antd';
import { setTitle } from 'lester-tools';
import moment from 'moment';
import { RouteComponentProps } from 'react-router-dom';
import { ImageUpload } from 'src/components';
import { saveNotice, queryNotice } from 'src/apis/notice';
import MessageType from './MessageType';
import style from './style.module.less';

const { Item, useForm } = Form;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Group } = Radio;

const Notice: React.FC<RouteComponentProps> = ({ history, location }) => {
  const [isPush, setIsPush] = useState<number>(0);

  const [form] = useForm();
  const { noticeId, type }: any = location.state || {};

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
    if (noticeId) {
      params.noticeId = noticeId;
    }
    const res: any = await saveNotice(params);
    if (res) {
      message.success('保存成功');
      history.goBack();
    }
  };

  const getNoticeData = async () => {
    const res: any = await queryNotice({ noticeId });
    if (res) {
      const { title, content, imageUrl, pushStatus, newNotice, startTime, endTime } = res;
      form.setFieldsValue({
        title,
        content,
        imageUrl,
        pushStatus,
        newNotice,
        time: startTime && endTime ? [moment(startTime), moment(endTime)] : undefined
      });
      setIsPush(pushStatus);
    }
  };

  useEffect(() => {
    noticeId && getNoticeData();
    setTitle('新增公告');
  }, []);

  return (
    <Card title="新增公告">
      <Form className={style.formWrap} form={form} onFinish={onSubmit} {...formLayout}>
        <Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
          <Input disabled={type === 1} placeholder="请输入" maxLength={60} />
        </Item>
        <Item name="content" label="公告" rules={[{ required: true, message: '请输入公告' }]}>
          <TextArea
            disabled={type === 1}
            placeholder="请输入"
            showCount
            maxLength={100}
            autoSize={{ minRows: 4, maxRows: 6 }}
          />
        </Item>
        <Item name="imageUrl" label="图片">
          <ImageUpload disabled={type === 1} />
        </Item>
        <Item name="time" label="生效时间" rules={[{ required: true, message: '请选择生效时间' }]}>
          <RangePicker
            disabled={type === 1}
            disabledDate={(date) => date && date < moment().startOf('day')}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
          />
        </Item>
        <Item name="pushStatus" label="消息推送" initialValue={0}>
          <Group disabled={type === 1} onChange={(e) => setIsPush(e.target.value)}>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </Group>
        </Item>
        {isPush === 1 && (
          <Item name="newNotice" label="消息类型" rules={[{ required: true, message: '请选择消息类型' }]}>
            <MessageType disabled={type === 1} />
          </Item>
        )}
        {type === 0 && (
          <div className={style.btnWrap}>
            <Button htmlType="submit" type="primary">
              确认
            </Button>
          </div>
        )}
      </Form>
    </Card>
  );
};

export default Notice;
