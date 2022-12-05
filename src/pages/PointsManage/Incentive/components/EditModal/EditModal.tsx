import React from 'react';
import { NgModal } from 'src/components';
import { Form, Input, DatePicker } from 'antd';
import { getUrlQueryParam } from 'src/utils/base';
import { requestEditIncentiveTask } from 'src/apis/pointsMall';
import style from './style.module.less';

export interface IEditModalProps {
  visible: boolean;
  title?: string;
  value?: any;
  onCancel: () => void;
  okText?: string;
  isView?: boolean; // 是否仅查看模式(不能编辑)
}

const EditModal: React.FC<IEditModalProps> = ({ visible, title, onCancel, okText, value }) => {
  const { Item } = Form;
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const { RangePicker } = DatePicker;

  const onCancelHandle = () => {
    onCancel();
  };
  const onOkHandle = async () => {
    await form.validateFields();
    const taskId = getUrlQueryParam('taskId');
    console.log('taskId', taskId);
    const { taskName, taskTime, target, desc } = form.getFieldsValue();
    let startTime = '';
    let endTime = '';
    if (taskTime) {
      startTime = taskTime[0].startOf('day').format('YYYY-MM-DD HH:mm:ss');
      endTime = taskTime[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');
    }
    console.log('param', { taskName, startTime, endTime, target, desc });
    const res = await requestEditIncentiveTask({ taskId, taskName, startTime, endTime, target, desc });
    console.log('res', res);
  };
  return (
    <NgModal
      className={style.modalWrap}
      width={600}
      visible={visible}
      title={'创建激励任务' || title}
      okText={'' || okText}
      onCancel={onCancelHandle}
      onOk={onOkHandle}
      destroyOnClose
    >
      <Form form={form} initialValues={value}>
        <Item label="任务名称" name="taskName" rules={[{ required: true, message: '请输入任务名称' }]}>
          <Input placeholder="请输入" />
        </Item>
        <Item label="任务时间" name="taskTime" rules={[{ required: true, message: '请选择任务时间' }]}>
          <RangePicker className={style.rangePicker} />
        </Item>
        <Item label="任务对象" name="target" rules={[{ required: true, message: '请输入任务对象' }]}>
          <Input placeholder="请输入" className={style.smallInput} />
        </Item>
        <Item label="规则说明" name="desc" rules={[{ required: true, message: '请输入规则说明' }]}>
          <TextArea placeholder="请输入" className={style.textArea} />
        </Item>
      </Form>
    </NgModal>
  );
};
export default EditModal;
