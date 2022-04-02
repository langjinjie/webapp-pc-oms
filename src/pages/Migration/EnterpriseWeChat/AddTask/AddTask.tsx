import React from 'react';
import { Form, Input, Button } from 'antd';
import { ChoosedStaffList } from './component';
import style from './style.module.less';

const AddTask: React.FC = () => {
  const [form] = Form.useForm();
  const { Item } = Form;
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
          <Item name="clientType" label="客户类型"></Item>
          <Button type="primary" onClick={() => console.log(form.getFieldsValue())}>
            保存
          </Button>
        </Form>
      </div>
    </>
  );
};
export default AddTask;
