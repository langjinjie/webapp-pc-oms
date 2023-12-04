import { Button, TimePicker, Form, Input, Radio, message } from 'antd';
import moment, { Moment } from 'moment';
import React, { useEffect, useState } from 'react';
import { BreadCrumbs, SelectOrg } from 'src/components';
import CustomTime from './component/CustomTime';
import { editChatTimeoutRule } from 'src/apis/exception';
import { RouteComponentProps } from 'react-router-dom';

const ChatNoResponseDetail: React.FC<RouteComponentProps<any, any, { record: any }>> = ({ history, location }) => {
  const [editForm] = Form.useForm();
  const [formValues, setFormValues] = useState<any>({});

  const getDetail = () => {
    const record = location.state?.record;
    console.log(record);

    if (record) {
      const { remindBeginTime, remindEndTime, ...otherValues } = record;
      setFormValues(record);
      editForm.setFieldsValue({
        ...otherValues,
        remind: [moment(remindBeginTime, 'HH:mm'), moment(remindEndTime, 'HH:mm')]
      });
    }
  };
  const onFinish = async (values: any) => {
    const { remind, timeoutRemindReceivers, manScopes, workDayRemindUpdate, updateRemindReceivers, ...otherValues } =
      values;
    let remindBeginTime = '';
    let remindEndTime = '';
    if (remind as [Moment, Moment]) {
      remindBeginTime = remind[0].format('HH:mm');
      remindEndTime = remind[1].format('HH:mm');
    }

    const res = await editChatTimeoutRule({
      remindBeginTime,
      remindEndTime,
      ruleId: formValues.ruleId || '',
      timeoutRemindReceivers: timeoutRemindReceivers.map((item: any) => ({
        staffId: item.staffId,
        staffName: item.staffName
      })),
      manScopes: manScopes.map((item: any) => ({ fullDeptId: item.fullDeptId, deptName: item.deptName })),
      updateRemindReceivers:
        workDayRemindUpdate === 1
          ? updateRemindReceivers.map((item: any) => ({ staffId: item.staffId, staffName: item.staffName }))
          : undefined, // 升级提醒接收人
      workDayRemindUpdate,
      ...otherValues
    });
    if (res) {
      message.success('添加成功！');
      // 传参触发缓存页面刷新
      history.push('/chatNR?pageNum=1');
    }
  };

  useEffect(() => {
    getDetail();
  }, []);
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
        onValuesChange={(_, values) => setFormValues((formValues: any) => ({ ...formValues, ...values }))}
        onFinish={onFinish}
        initialValues={{ workDayRemindUpdate: 0 }}
      >
        <Form.Item label="规则名称" name="ruleName" rules={[{ required: true }]}>
          <Input className="width480" placeholder="请输入" maxLength={40}></Input>
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
          name="timeoutRemindReceivers"
        >
          <SelectOrg key={1} />
        </Form.Item>
        <Form.Item
          label="管理范围"
          rules={[{ required: true, message: '请选择管理范围' }]}
          name="manScopes"
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
              name="updateRemindReceivers"
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
