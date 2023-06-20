import { Button, TimePicker, Form, Input, Radio } from 'antd';
import { Moment } from 'moment';
import React, { useState } from 'react';
import { BreadCrumbs } from 'src/components';
import { SelectOrg } from 'src/pages/CustomerManage/components';
import CustomTime from './component/CustomTime';
import { editChatTimeoutRule } from 'src/apis/exception';

const ChatNoResponseDetail: React.FC = () => {
  const [editForm] = Form.useForm();
  const [formValues, setFormValues] = useState<any>({});

  const onFinish = async (values: any) => {
    const { remind } = values as { remind: [Moment, Moment] };
    let remindBeginTime = '';
    let remindEndTime = '';
    if (remind) {
      remindBeginTime = remind[0].format('HH:mm');
      remindEndTime = remind[1].format('HH:mm');
    }

    const res = await editChatTimeoutRule({ remindBeginTime, remindEndTime });
    console.log(values);
    console.log(res);
  };
  return (
    <div className="container">
      <BreadCrumbs
        navList={[
          {
            name: '超时未回复'
          },
          { name: '新建规则' }
        ]}
      />

      <Form
        form={editForm}
        className="edit mt40"
        onValuesChange={(_, values) => setFormValues(values)}
        onFinish={onFinish}
        initialValues={{ workDayRemindUpdate: 0 }}
      >
        <Form.Item label="规则名称" name="ruleName" rules={[{ required: true }]}>
          <Input className="width480" placeholder="请输入"></Input>
        </Form.Item>
        <Form.Item label="超时提醒时间段" name="remind" rules={[{ required: true }]}>
          <TimePicker.RangePicker format={'HH:mm'} />
        </Form.Item>
        <Form.Item
          label="超时时间"
          name="replyTimeout"
          rules={[{ required: true, message: '超时时间提示时间不可以为空' }]}
        >
          <CustomTime />
        </Form.Item>
        <Form.Item
          label="超时提醒接收人"
          rules={[{ required: true, message: '请选择超时提醒接收人' }]}
          style={{ width: '780px' }}
          name="receiver"
        >
          <SelectOrg key={1} />
        </Form.Item>
        <Form.Item
          label="管理范围"
          rules={[{ required: true, message: '请选择管理范围' }]}
          name="manScopeFull"
          style={{ width: '780px' }}
        >
          <SelectOrg key={2} type="dept" />
        </Form.Item>
        <Form.Item label="工作日提醒升级" name={'workDayRemindUpdate'}>
          <Radio.Group>
            <Radio value={0}>否</Radio>
            <Radio value={1}>是</Radio>
          </Radio.Group>
        </Form.Item>
        {!!formValues.workDayRemindUpdate && (
          <>
            <Form.Item label="升级提醒时间" name="updateTimeout" rules={[{ required: true }]}>
              <CustomTime />
            </Form.Item>
            <Form.Item
              label="升级提醒接收人"
              style={{ width: '780px' }}
              name="remindReceiver"
              rules={[{ required: true, message: '请选择提醒接收人' }]}
            >
              <SelectOrg key={1} />
            </Form.Item>
          </>
        )}

        <Form.Item className="formFooter text-center" style={{ width: '1000px' }}>
          <Button type="primary" shape="round" htmlType="submit">
            创建规则
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChatNoResponseDetail;
