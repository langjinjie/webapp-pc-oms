/**
 * @name Notice
 * @author Lester
 * @date 2021-11-18 16:50
 */
import React, { useEffect, useState } from 'react';
import { Card, Form, Input, DatePicker, FormProps, Button, Radio, message, Select } from 'antd';
import { setTitle } from 'tenacity-tools';
import moment, { Moment } from 'moment';
import { RouteComponentProps } from 'react-router-dom';
import { ImageUpload } from 'src/components';
import { saveNotice, queryNotice } from 'src/apis/notice';
import { queryFuncList } from 'src/apis';
import MessageType from './MessageType';
import style from './style.module.less';

const { Item, useForm } = Form;
const { TextArea } = Input;
const { Group } = Radio;
const { Option } = Select;

interface FunctionItem {
  funcId: string;
  funcName: string;
}

const Notice: React.FC<RouteComponentProps> = ({ history, location }) => {
  const [isPush, setIsPush] = useState<number>(1);
  const [jumpType, setJumpType] = useState<number>(0);
  const [funcList, setFuncList] = useState<FunctionItem[]>([]);

  const [form] = useForm();
  const { noticeId, type }: any = location.state || {};

  const formLayout: FormProps = {
    labelAlign: 'right',
    labelCol: { span: 3 },
    wrapperCol: { span: 8 }
  };

  const typeName = () => {
    let name = '';
    if (noticeId) {
      name = type === 0 ? '编辑' : '查看';
    } else {
      name = '新增';
    }
    return name;
  };

  const onSubmit = async (values: any) => {
    const { time, ...others } = values;
    const params: any = { ...others };
    if (time.valueOf() < moment().add(20, 'minutes').valueOf()) {
      return message.error('生效时间请选择20分钟以后');
    } else {
      params.startTime = time.format('YYYY-MM-DD HH:mm:ss');
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
      const { startTime, pushStatus, jumpType, ...others } = res;
      form.setFieldsValue({
        pushStatus,
        time: startTime ? moment(startTime) : undefined,
        jumpType,
        ...others
      });
      setIsPush(pushStatus);
      setJumpType(jumpType);
    }
  };

  const getFuncList = async () => {
    const res: any = await queryFuncList();
    if (res) {
      setFuncList(res);
    }
  };

  const getInitTime = (): Moment => {
    const today = moment(`${moment().format('YYYY-MM-DD')} 09:00:00`);
    return new Date().getHours() < 9 ? today : today.add(1, 'days');
  };

  useEffect(() => {
    if (noticeId) {
      getNoticeData();
    }
    getFuncList();
    setTitle(`${typeName()}公告`);
  }, []);

  const onJumpTypeChange = (val: number) => {
    setJumpType(val);

    if (val === 3) {
      form.setFieldsValue({ pushStatus: 1 });
      setIsPush(1);
    }
  };
  return (
    <Card title={`${typeName()}公告`}>
      <Form className={style.formWrap} form={form} onFinish={onSubmit} {...formLayout}>
        <Item name="jumpType" label="跳转方式" initialValue={0} rules={[{ required: true, message: '请选择跳转方式' }]}>
          <Group disabled={type === 1} onChange={(e) => onJumpTypeChange(e.target.value)}>
            <Radio value={0}>无需跳转到功能模块</Radio>
            <Radio value={1}>需跳转到功能模块</Radio>
            <Radio value={3}>外部链接</Radio>
          </Group>
        </Item>
        {/* 跳转链接为外部链接时才显示 */}
        {jumpType === 3 && (
          <Item
            label="URL"
            name="linkUrl"
            rules={[
              { required: true, message: '请输入URL' },
              { type: 'url', message: '请输入正确的外部链接' }
            ]}
          >
            <Input disabled={type === 1} placeholder="请输入" maxLength={250} />
          </Item>
        )}

        <Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
          <Input disabled={type === 1} placeholder="请输入" maxLength={60} />
        </Item>
        <Item name="content" label="内容" rules={[{ required: true, message: '请输入公告' }]}>
          <TextArea
            disabled={type === 1}
            placeholder="请输入"
            showCount
            maxLength={300}
            autoSize={{ minRows: 4, maxRows: 8 }}
          />
        </Item>
        <Item name="imageUrl" label="图片">
          <ImageUpload disabled={type === 1} />
        </Item>
        {jumpType === 1 && (
          <Item name="jumpFuncId" label="跳转模块" rules={[{ required: true, message: '请选择跳转模块' }]}>
            <Select placeholder="请选择跳转模块" disabled={type === 1} style={{ width: 300 }}>
              {funcList.map((item) => (
                <Option key={item.funcId} value={item.funcId}>
                  {item.funcName}
                </Option>
              ))}
            </Select>
          </Item>
        )}
        <Item
          name="time"
          label="生效时间"
          rules={[{ required: true, message: '请选择生效时间' }]}
          initialValue={getInitTime()}
        >
          <DatePicker
            style={{ width: 300 }}
            placeholder="请选择时间"
            disabled={type === 1}
            disabledDate={(date) => date && date < moment().startOf('day')}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
          />
        </Item>
        <Item name="pushStatus" label="消息推送" initialValue={1}>
          <Group disabled={type === 1 || jumpType === 3} onChange={(e) => setIsPush(e.target.value)}>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </Group>
        </Item>
        {isPush === 1 && (
          <Item name="newNotice" label="消息图片" rules={[{ required: true, message: '请选择消息图片' }]}>
            <MessageType form={form} disabled={type === 1} />
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
