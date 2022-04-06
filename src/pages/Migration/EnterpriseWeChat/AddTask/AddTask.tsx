import React from 'react';
import { Form, Input, Button, Radio, DatePicker } from 'antd';
import { ChoosedStaffList } from './component';
import { ImageUpload } from 'src/components';
import moment from 'moment';
import style from './style.module.less';
import classNames from 'classnames';

const AddTask: React.FC = () => {
  const [form] = Form.useForm();
  const { Item } = Form;
  const { Group } = Radio;
  const { TextArea } = Input;
  const { RangePicker } = DatePicker;
  const displayTypeList = [
    { value: 0, label: '待迁移' },
    { value: 1, label: '迁移成功' },
    { value: 2, label: '全部' }
  ];
  // 禁止选择今天及之前的日期
  const disabledDate = (current: moment.Moment) => {
    return current < moment().endOf('day');
  };
  const onRemoveHandle = () => {
    form.setFieldsValue({ ...form.getFieldsValue(), img: '' });
  };
  return (
    <>
      <header className={style.addTask}>创建任务</header>
      <div className={style.content}>
        <Form form={form} className={style.form}>
          <Item name="taskName" className={style.formItem} label="任务名称：">
            <Input className={style.input} showCount={true} maxLength={50} placeholder="请输入任务名称"></Input>
          </Item>
          <Item name="staffList" className={style.formItem} label="执行人员：">
            <ChoosedStaffList />
          </Item>
          <Item name="clientType" className={style.formItem} label="客户类型">
            <Group>
              {displayTypeList.map((item) => (
                <Radio key={item.value + item.label} value={item.value}>
                  {item.label}
                </Radio>
              ))}
            </Group>
          </Item>
          <Item
            name="date"
            className={style.formItem}
            label="执行时间"
            // initialValue={[moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')]}
          >
            <RangePicker style={{ width: 280 }} disabledDate={disabledDate} />
          </Item>
          <Item name="img" className={style.formItem} label="缩略图：">
            <ImageUpload onRemove={onRemoveHandle} />
          </Item>
          <Item name="title" className={style.formItem} label="链接标题：">
            <Input
              className={classNames(style.input, style.titleInput)}
              showCount={true}
              maxLength={30}
              placeholder="请输入任务名称"
            ></Input>
          </Item>
          <Item name="summary" className={style.formItem} label="链接摘要：">
            <Input className={style.input} showCount={true} maxLength={50} placeholder="请输入任务名称"></Input>
          </Item>
          <Item name="speech" className={style.formItem} label="群发话术：">
            <TextArea className={style.input} showCount={true} maxLength={300} placeholder="请输入任务名称"></TextArea>
          </Item>
          <Button type="primary" onClick={() => console.log(form.getFieldsValue())}>
            保存
          </Button>
        </Form>
      </div>
    </>
  );
};
export default AddTask;
