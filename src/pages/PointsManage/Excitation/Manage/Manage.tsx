import React, { useState, useEffect } from 'react';
import { Button, Form, Input, DatePicker, Select } from 'antd';
import { stateOptions } from 'src/pages/PointsManage/Excitation/Excitation';
import { NgTable } from 'src/components';
import { TableColumns } from 'src/pages/PointsManage/Excitation/Manage/Config';
import { EditAddExcitation } from 'src/pages/PointsManage/Excitation/components';
import style from './style.module.less';

const Excitation: React.FC = () => {
  const [list, setList] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [editValue, setEditValue] = useState<{ [key: string]: any }>();
  const [isView, setIsView] = useState(false);

  const [form] = Form.useForm();
  const { Item } = Form;
  const { RangePicker } = DatePicker;
  const { Option } = Select;

  // 获取列表
  const getList = () => {
    setList([]);
  };

  // 创建激励任务
  const AddTask = () => {
    setVisible(true);
  };

  useEffect(() => {
    getList();
  }, []);

  // 编辑/查看
  const editViewHandle = (row: any, isView: boolean) => {
    setIsView(isView);
    setEditValue(row);
  };

  return (
    <>
      <Button type="primary" className={style.addExcitation} onClick={AddTask}>
        创建激励任务
      </Button>
      <Form form={form} className={style.form} layout="inline">
        <Item label="任务名称：">
          <Input className={style.textInput} placeholder="请输入" />
        </Item>
        <Item label="任务时间：">
          <RangePicker className={style.rangePicker} />
        </Item>
        <Item label="任务状态：">
          <Select className={style.select}>
            {stateOptions.map((mapItem) => (
              <Option key={mapItem.value}>{mapItem.label}</Option>
            ))}
          </Select>
        </Item>
        <Button className={style.submitBtn} htmlType="submit" type="primary">
          查询
        </Button>
        <Button className={style.resetBtn} htmlType="reset">
          重置
        </Button>
      </Form>
      <NgTable
        columns={TableColumns(editViewHandle)}
        scroll={{ x: 'max-content' }}
        dataSource={list}
        className={style.table}
      />
      {/* 新增/编辑 */}
      <EditAddExcitation
        title={editValue ? '编辑激励任务' : '创建激励任务'}
        visible={visible}
        onCancel={() => setVisible(false)}
        isView={isView}
      />
    </>
  );
};
export default Excitation;
