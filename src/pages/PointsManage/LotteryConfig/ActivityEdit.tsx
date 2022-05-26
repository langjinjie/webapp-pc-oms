/**
 * @name ActivityEdit
 * @author Lester
 * @date 2022-05-26 14:25
 */
import React, { useEffect } from 'react';
import { Modal } from 'src/components';
import moment, { Moment } from 'moment';
import { Form, Input, DatePicker, FormProps, message } from 'antd';
import { editActivity } from 'src/apis/pointsMall';
import { ActivityItem } from './ActivityList';
import style from './style.module.less';

const { Item, useForm } = Form;
const RangePicker: any = DatePicker.RangePicker;

interface ActivityEditProps {
  visible: boolean;
  onClose: () => void;
  onOk: () => void;
  type: number;
  data: ActivityItem | null;
}

const ActivityEdit: React.FC<ActivityEditProps> = ({ visible, onClose, onOk, type, data }) => {
  const [form] = useForm();

  const title = `${type === 1 ? '编辑' : '新增'}抽奖活动`;
  const formLayout: FormProps = {
    labelAlign: 'right',
    labelCol: { span: 4 },
    wrapperCol: { span: 18 }
  };

  const onFinish = async (values: any) => {
    console.log(values);
    const { activityName, time } = values;
    const param: any = {
      activityName,
      startTime: time[0].format('YYYY-MM-DD HH:mm:ss'),
      endTime: time[1].format('YYYY-MM-DD HH:mm:ss')
    };
    if (data?.activityId) {
      param.activityId = data?.activityId;
    }
    const res: any = await editActivity(param);
    if (res) {
      message.success(`${title}成功`);
      onClose();
      onOk();
    }
  };

  useEffect(() => {
    if (visible) {
      if (data) {
        const { activityName, startTime, endTime } = data;
        form.setFieldsValue({
          activityName,
          time: [moment(startTime), moment(endTime)]
        });
      }
    } else {
      form.resetFields();
    }
  }, [visible]);

  return (
    <Modal className={style.activityEdit} title={title} visible={visible} onClose={onClose} onOk={() => form.submit()}>
      <Form form={form} onFinish={onFinish} {...formLayout}>
        <Item name="activityName" label="活动名称" rules={[{ required: true, message: '请输入活动名称' }]}>
          <Input placeholder="请输入活动名称" allowClear />
        </Item>
        <Item name="time" label="活动时间" rules={[{ required: true, message: '请选择活动时间' }]}>
          <RangePicker
            disabledDate={(date: Moment) => date && date < moment().startOf('day')}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
          />
        </Item>
      </Form>
    </Modal>
  );
};

export default ActivityEdit;
