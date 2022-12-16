import React, { useEffect, useState } from 'react';
import { NgModal } from 'src/components';
import { Form, Input, DatePicker, message } from 'antd';
import { requestEditIncentiveTask } from 'src/apis/pointsMall';
import style from './style.module.less';
import moment, { Moment } from 'moment';

export interface IEditModalProps {
  visible: boolean;
  title?: string;
  value?: any;
  onChange?: (value?: any) => void;
  onCancel: () => void;
  okText?: string;
  isView?: boolean; // 是否仅查看模式(不能编辑)
  onSuccess?: () => void;
}

const EditModal: React.FC<IEditModalProps> = ({
  visible,
  title,
  onCancel,
  okText,
  value,
  onChange,
  isView,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [defaultValue, setDefaultValue] = useState(moment());
  const { Item } = Form;
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const { RangePicker } = DatePicker;

  const onCancelHandle = () => {
    onCancel();
    onChange?.();
  };
  const onOkHandle = async () => {
    await form.validateFields();
    setLoading(true);
    const { taskName, taskTime, target, desc } = form.getFieldsValue();
    let startTime = '';
    let endTime = '';
    if (taskTime) {
      startTime = taskTime[0].format('YYYY-MM-DD HH:mm:ss');
      endTime = taskTime[1].format('YYYY-MM-DD HH:mm:ss');
    }
    const res = await requestEditIncentiveTask({ taskId: value?.taskId, taskName, startTime, endTime, target, desc });
    setLoading(false);
    if (res) {
      message.success('成功创建激励任务');
      onSuccess?.();
      onCancelHandle();
    }
  };
  // 禁止选中当前日期之前
  const disabledDate = (current: Moment) => {
    return current < moment().startOf('days');
  };
  const range = (start: number, end: number) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };
  // 选中时间的回调
  const onCalendarChange: (value: any) => void = (value) => {
    if (value && value[0]) {
      setDefaultValue(value[0]);
    }
  };
  // 禁止选中此刻之前的时间
  const disabledDataTime = (date: any, type: string) => {
    if (!date) {
      return {
        disabledHours: () => range(0, 24),
        disabledMinutes: () => range(0, 60),
        disabledSeconds: () => range(0, 60)
      };
    }
    if (type === 'end') {
      if (date.format('YY-MM-DD') === defaultValue.format('YY-MM-DD')) {
        return {
          disabledHours: () => range(0, defaultValue.hours()),
          disabledMinutes: (selectHours: number) => {
            if (selectHours === defaultValue.hours()) {
              return range(0, defaultValue.minutes());
            }
          },
          disabledSeconds: (selectHours: number, selectMinutes: number) => {
            if (selectHours === defaultValue.hours() && selectMinutes === defaultValue.minutes()) {
              return range(0, defaultValue.seconds());
            }
          }
        };
      }
    }
    // 判断日期是否选中的是当前
    if (date.format('YY-MM-DD') === moment().format('YY-MM-DD')) {
      // 判断小时是否选中的当前小时
      if (date.format('YY-MM-DD HH') === moment().format('YY-MM-DD HH')) {
        return {
          disabledHours: () => range(0, moment().hours()),
          disabledMinutes: () => range(0, moment().minutes()),
          disabledSeconds: () => range(0, moment().seconds())
        };
      } else {
        return {
          disabledHours: () => range(0, moment().hours())
        };
      }
    }
  };
  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        taskName: '',
        taskTime: null,
        target: '',
        desc: '',
        ...value
      });
    }
  }, [visible]);
  return (
    <NgModal
      className={style.modalWrap}
      width={600}
      visible={visible}
      title={title || '新增激励任务'}
      okText={okText}
      onCancel={onCancelHandle}
      onOk={onOkHandle}
      okButtonProps={{
        disabled: isView,
        loading
      }}
    >
      <Form form={form} initialValues={value}>
        <Item label="任务名称" name="taskName" rules={[{ required: true, message: '请输入任务名称' }]}>
          <Input placeholder="请输入" className={style.input} readOnly={isView} maxLength={60} showCount allowClear />
        </Item>
        <Item label="任务时间" name="taskTime" rules={[{ required: true, message: '请选择任务时间' }]}>
          <RangePicker
            showTime={{ defaultValue: [moment(), defaultValue] }}
            onCalendarChange={onCalendarChange}
            className={style.rangePicker}
            disabled={isView}
            disabledDate={disabledDate}
            // @ts-ignore
            disabledTime={disabledDataTime}
            allowClear
          />
        </Item>
        <Item label="任务对象" name="target" rules={[{ required: true, message: '请输入任务对象' }]}>
          <Input placeholder="请输入" className={style.input} readOnly={isView} maxLength={60} showCount allowClear />
        </Item>
        <Item label="规则说明" name="desc" rules={[{ required: true, message: '请输入规则说明' }]}>
          <TextArea
            placeholder="请输入"
            className={style.textArea}
            readOnly={isView}
            maxLength={300}
            showCount
            allowClear
          />
        </Item>
      </Form>
    </NgModal>
  );
};
export default EditModal;
