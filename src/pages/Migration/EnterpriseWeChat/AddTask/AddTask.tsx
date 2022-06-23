import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Form, Input, Button, Radio, DatePicker, message } from 'antd';
import { ChoosedStaffList } from './component';
import { ImageUpload } from 'src/components';
import { getQueryParam } from 'tenacity-tools';
import { requestCreateTransferTask, requestGetTaskDetail } from 'src/apis/migration';
import moment, { Moment } from 'moment';
import DetailModal from 'src/pages/Migration/EnterpriseWeChat/components/DetailModal/DetailModal';
import style from './style.module.less';
import classNames from 'classnames';

interface IFormValues {
  taskName: string;
  clientType: number;
  executionTime: Moment[];
  thumbnail: string;
  title: string;
  summary: string;
  speechcraft: string;
  staffList: string;
}

const AddTask: React.FC = () => {
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [detailVisible, setDetailVisible] = useState(false);
  const [defaultValue, setDefaultValue] = useState(moment());
  const [form] = Form.useForm();
  const { Item } = Form;
  const { Group } = Radio;
  const { TextArea } = Input;
  const { RangePicker } = DatePicker;
  const history = useHistory();
  const location = useLocation();
  let noSubmitForm: any = null;
  const displayTypeList = [
    { value: 0, label: '发送待迁移客户' },
    { value: 1, label: '发送迁移成功客户' },
    { value: 2, label: '发送全部客户' }
  ];
  // 禁止选择今天及之前的日期
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
      console.log('value', value);
      setDefaultValue(value[0]);
    }
  };
  // 禁止选中此刻之前的时间
  const disabledDataTime = (date: any, type: string) => {
    if (!date) {
      return {
        disabledHours: () => range(0, 24),
        disabledMinutes: () => range(0, 60)
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
          disabledMinutes: () => range(0, moment().minutes())
        };
      } else {
        return {
          disabledHours: () => range(0, moment().hours())
        };
      }
    }
  };
  const onRemoveHandle = () => {
    form.setFieldsValue({ ...form.getFieldsValue(), thumbnail: '' });
  };
  // 获取任务详情
  const getTaskDetail = async (taskId: string) => {
    const res = await requestGetTaskDetail({ taskId });
    const executionTime = [
      moment(res.startTime || '', 'YYYY年MM月DD日 HH:mm'),
      moment(res.endTime || '', 'YYYY年MM月DD日 HH:mm')
    ];
    form.setFieldsValue({ ...res, executionTime, staffTotalNum: res.staffTotalNum + '人' });
  };
  // 查看任务明细
  const clickTaskDetail = () => {
    setDetailVisible(true);
  };
  const onFinish = async (value: IFormValues) => {
    if (isReadOnly) {
      history.goBack();
    } else {
      const { taskName, clientType, executionTime, thumbnail, title, summary, speechcraft, staffList } = value;
      const startTime = executionTime[0].format('YYYY-MM-DD HH:mm:ss');
      // const startTime = executionTime[0].startOf('minute').format('YYYY-MM-DD HH:mm:ss');
      const endTime = executionTime[1].format('YYYY-MM-DD HH:mm:ss');
      // const endTime = executionTime[1].endOf('minute').format('YYYY-MM-DD HH:mm:ss');
      const res = await requestCreateTransferTask({
        taskName,
        clientType,
        startTime,
        endTime,
        thumbnail,
        title,
        summary,
        speechcraft,
        staffList
      });
      if (res) {
        form.resetFields();
        message.success('创建任务成功');
        history.push('/enterprise');
      }
    }
  };
  useEffect(() => {
    if (location.pathname === '/enterprise/addTask' && getQueryParam().taskId) {
      setIsReadOnly(true);
      noSubmitForm = form.getFieldsValue();
      getTaskDetail(getQueryParam().taskId);
    } else {
      setIsReadOnly(false);
    }
    return () => {
      if (location.pathname === '/enterprise/addTask' && location.search.includes('taskId')) {
        form.setFieldsValue(noSubmitForm);
      }
    };
  }, [location]);
  return (
    <>
      <header className={style.addTask}>{isReadOnly ? '查看' : '新增'}任务</header>
      <div className={style.content}>
        <Form form={form} className={style.form} onFinish={onFinish}>
          <Item name="taskName" className={style.formItem} label="任务名称：">
            <Input className={style.input} showCount={true} maxLength={50} placeholder="请输入任务名称" />
          </Item>
          {isReadOnly
            ? (
            <Item className={style.formItem} label="执行人员：">
              <Item name="staffTotalNum" noStyle>
                <Input className={style.readOnlyInput} readOnly />
              </Item>
              <span className={style.readDetail} onClick={clickTaskDetail}>
                查看明细
              </span>
            </Item>
              )
            : (
            <Item
              name="staffList"
              className={style.formItem}
              label="执行人员："
              rules={[{ required: true, message: '请选择执行人员' }]}
            >
              <ChoosedStaffList />
            </Item>
              )}
          <Item
            name="clientType"
            className={style.formItem}
            label="客户类型"
            rules={[{ required: true, message: '请选择客户类型' }]}
          >
            <Group disabled={isReadOnly}>
              {displayTypeList.map((item) => (
                <Radio key={item.value + item.label} value={item.value}>
                  {item.label}
                </Radio>
              ))}
            </Group>
          </Item>
          <Item
            name="executionTime"
            className={style.formItem}
            label="执行时间"
            rules={[{ required: true, message: '请选择执行时间' }]}
          >
            <RangePicker
              showTime={{ defaultValue: [moment(), defaultValue] }}
              className={style.rangePicker}
              format={'YYYY年MM月DD日 HH:mm'}
              disabledDate={disabledDate}
              // @ts-ignore
              disabledTime={disabledDataTime}
              onCalendarChange={onCalendarChange}
              disabled={isReadOnly}
              order={true}
            />
          </Item>
          <Item
            name="thumbnail"
            className={style.formItem}
            label="缩略图："
            rules={[{ required: true, message: '请上传图片' }]}
          >
            <ImageUpload onRemove={onRemoveHandle} disabled={isReadOnly} />
          </Item>
          <Item
            name="title"
            className={style.formItem}
            label="链接标题："
            rules={[{ required: true, message: '请输入链接标题' }]}
          >
            <Input
              className={classNames(style.input, style.titleInput)}
              showCount={!isReadOnly}
              maxLength={30}
              placeholder="请输入链接标题"
              readOnly={isReadOnly}
            />
          </Item>
          <Item
            name="summary"
            className={style.formItem}
            label="链接摘要："
            rules={[{ required: true, message: '请输入链接摘要' }]}
          >
            <Input
              className={style.input}
              showCount={!isReadOnly}
              maxLength={50}
              placeholder="请输入链接摘要"
              readOnly={isReadOnly}
            />
          </Item>
          <Item
            name="speechcraft"
            className={style.formItem}
            label="群发话术："
            rules={[{ required: true, message: '请输入链接标题' }]}
          >
            <TextArea
              className={style.inputTextArea}
              showCount={!isReadOnly}
              maxLength={300}
              placeholder="请输入群发话术"
              readOnly={isReadOnly}
            />
          </Item>
          <Button htmlType="submit" className={style.btn} type="primary">
            {isReadOnly ? '返回' : '保存'}
          </Button>
        </Form>
      </div>
      <DetailModal
        taskId={getQueryParam().taskId || ''}
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
      />
    </>
  );
};
export default AddTask;
