import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Input, Button, Radio, DatePicker } from 'antd';
import { ChoosedStaffList } from './component';
import { ImageUpload } from 'src/components';
import { getQueryParam } from 'lester-tools';
import moment, { Moment } from 'moment';
import DetailModal from 'src/pages/Migration/EnterpriseWeChat/components/DetailModal/DetailModal';
import style from './style.module.less';
import classNames from 'classnames';

// interface ITaskDetail {
//   taskName: string;
//   staffTotalNum: number;
//   clientType: number;
//   startTime: string;
//   endTime: string;
//   thumbnail: string;
//   title: string;
//   summary: string;
//   speechcraft: string;
// }

const AddTask: React.FC = () => {
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [form] = Form.useForm();
  const { Item } = Form;
  const { Group } = Radio;
  const { TextArea } = Input;
  const { RangePicker } = DatePicker;
  const history = useHistory();
  const displayTypeList = [
    { value: 0, label: '待迁移' },
    { value: 1, label: '迁移成功' },
    { value: 2, label: '全部' }
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
  // 禁止选中此刻之前的时间
  const disabledDataTime = (date: any, type: string) => {
    if (type === 'start') {
      if (date && date.format('YY-MM-DD') === moment().format('YY-MM-DD')) {
        return {
          disabledHours: () => range(0, moment().hours()),
          disabledMinutes: () => range(0, moment().minutes())
        };
      }
    }
  };
  const onRemoveHandle = () => {
    form.setFieldsValue({ ...form.getFieldsValue(), thumbnail: '' });
  };
  // 获取任务详情
  const getTaskDetail = () => {
    setTimeout(() => {
      const res = {
        taskName: '理赔客户第一次迁移',
        staffTotalNum: 9999,
        clientType: 1,
        startTime: '2022年3月16日 10:00',
        endTime: '2022年3月18 24:00',
        thumbnail:
          'https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng01cbe22331317bc8ab6cb16e669d58876a01e744c78f1fefb4bdf567b44a283f',
        title: '点我有惊喜',
        summary: '加我好友可以吗？有奖励哦',
        speechcraft: '为了更好地为您服务，请添加我的好友'
      };
      const executionTime = [
        moment(res.startTime, 'YYYY年MM月DD日 HH:mm'),
        moment(res.endTime, 'YYYY年MM月DD日 HH:mm')
      ];
      form.setFieldsValue({ ...res, executionTime, staffTotalNum: res.staffTotalNum + '人' });
    }, 100);
  };
  // 查看任务明细
  const clickTaskDetail = () => {
    setDetailVisible(true);
  };
  const onFinish = (value: any) => {
    console.log(value);
    if (isReadOnly) {
      history.goBack();
    } else {
      history.push('/enterprise');
    }
    form.resetFields();
  };
  useEffect(() => {
    if (getQueryParam().taskId) {
      getTaskDetail();
      setIsReadOnly(true);
    }
  }, []);
  return (
    <>
      <header className={style.addTask}>创建任务</header>
      <div className={style.content}>
        <Form form={form} className={style.form} onFinish={onFinish}>
          <Item name="taskName" className={style.formItem} label="任务名称：">
            <Input
              className={style.input}
              showCount={!isReadOnly}
              maxLength={50}
              placeholder="请输入任务名称"
              readOnly={isReadOnly}
            />
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
            <Item name="staffList" className={style.formItem} label="执行人员：">
              <ChoosedStaffList />
            </Item>
              )}
          <Item name="clientType" className={style.formItem} label="客户类型" initialValue={0}>
            <Group disabled={isReadOnly}>
              {displayTypeList.map((item) => (
                <Radio key={item.value + item.label} value={item.value}>
                  {item.label}
                </Radio>
              ))}
            </Group>
          </Item>
          <Item name="executionTime" className={style.formItem} label="执行时间">
            <RangePicker
              showTime
              className={style.rangePicker}
              format={'YYYY年MM月DD日 HH:mm'}
              disabledDate={disabledDate}
              // @ts-ignore
              disabledTime={disabledDataTime}
              disabled={isReadOnly}
            />
          </Item>
          <Item name="thumbnail" className={style.formItem} label="缩略图：">
            <ImageUpload onRemove={onRemoveHandle} disabled={isReadOnly} />
          </Item>
          <Item name="title" className={style.formItem} label="链接标题：">
            <Input
              className={classNames(style.input, style.titleInput)}
              showCount={!isReadOnly}
              maxLength={30}
              placeholder="请输入任务名称"
              readOnly={isReadOnly}
            />
          </Item>
          <Item name="summary" className={style.formItem} label="链接摘要：">
            <Input
              className={style.input}
              showCount={!isReadOnly}
              maxLength={50}
              placeholder="请输入任务名称"
              readOnly={isReadOnly}
            />
          </Item>
          <Item name="speechcraft" className={style.formItem} label="群发话术：">
            <TextArea
              className={style.input}
              showCount={!isReadOnly}
              maxLength={300}
              placeholder="请输入任务名称"
              readOnly={isReadOnly}
            />
          </Item>
          <Button htmlType="submit" className={style.btn} type="primary">
            {isReadOnly ? '返回' : '保存'}
          </Button>
        </Form>
      </div>
      <DetailModal visible={detailVisible} onClose={() => setDetailVisible(false)} />
    </>
  );
};
export default AddTask;
