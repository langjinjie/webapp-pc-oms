import React from 'react';
import { NgModal } from 'src/components';
import { Form, Input, DatePicker } from 'antd';
import style from './style.module.less';

export interface IEditAddExcitationProps {
  visible: boolean;
  title?: string;
  value?: any;
  onCancel: () => void;
  okText?: string;
  isView?: boolean; // 是否仅查看模式(不能编辑)
}

const EditAddExcitation: React.FC<IEditAddExcitationProps> = ({ visible, title, onCancel, okText, value }) => {
  const { Item } = Form;
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const { RangePicker } = DatePicker;

  const onCancelHandle = () => {
    onCancel();
  };
  return (
    <NgModal
      className={style.modalWrap}
      width={600}
      visible={visible}
      title={'创建激励任务' || title}
      okText={'' || okText}
      onCancel={onCancelHandle}
      destroyOnClose
    >
      <Form form={form} initialValues={value}>
        <Item label="任务名称" required rules={[{ required: true, message: '请输入任务名称' }]}>
          <Input placeholder="请输入" />
        </Item>
        <Item label="任务时间" required rules={[{ required: true, message: '请选择任务时间' }]}>
          <RangePicker className={style.rangePicker} />
        </Item>
        <Item label="任务对象" required rules={[{ required: true, message: '请输入任务对象' }]}>
          <Input placeholder="请输入" className={style.smallInput} />
        </Item>
        <Item label="规则说明" required rules={[{ required: true, message: '请输入规则说明' }]}>
          <TextArea placeholder="请输入" className={style.textArea} />
        </Item>
      </Form>
    </NgModal>
  );
};
export default EditAddExcitation;
