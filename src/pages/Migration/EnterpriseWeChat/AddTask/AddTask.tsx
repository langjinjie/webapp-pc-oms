import React, { useEffect, useState } from 'react';
import { Form, Input, Button } from 'antd';
import style from './style.module.less';
import { Icon } from 'src/components';

const AddTask: React.FC = () => {
  const [selectedStaff, setSelectedStaff] = useState<any[]>([]);
  const [form] = Form.useForm();
  const { Item } = Form;
  useEffect(() => {
    setSelectedStaff([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  }, []);
  return (
    <>
      <header className={style.addTask}>创建任务</header>
      <div className={style.content}>
        <Form form={form} className={style.form}>
          <Item name="taskName" className={style.formItem} label="任务名称：">
            <Input className={style.input} showCount={true} maxLength={50} placeholder="请输入任务名称" />
          </Item>
          <Item name="staffList" className={style.formItem} label="执行人员：">
            <div className={style.addStaffWrap}>
              <Icon className={style.addStaff} name="xinjian" />
              {selectedStaff.length && (
                <div className={style.selected}>
                  已选中{selectedStaff.length}人<Icon className={style.clearSelected} name="biaoqian_quxiao" />
                </div>
              )}
            </div>
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
