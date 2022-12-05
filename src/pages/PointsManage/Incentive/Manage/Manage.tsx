import React, { useState, useEffect } from 'react';
import { Button, Form, Input, DatePicker, Select } from 'antd';
import { stateOptions } from 'src/pages/PointsManage/Incentive/Incentive';
import { NgTable } from 'src/components';
import { TableColumns } from 'src/pages/PointsManage/Incentive/Manage/Config';
import { EditAddExcitation } from 'src/pages/PointsManage/Incentive/components';
// import { requestGetIncentiveTaskList } from 'src/apis/pointsMall';
import style from './style.module.less';

export interface IIncentiveManage {
  taskId: string;
  taskName: string;
  startTime: string;
  endTime: string;
  desc: string;
  target: string;
  status: number;
}

const IncentiveManage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [editValue, setEditValue] = useState<{ [key: string]: any }>();
  const [isView, setIsView] = useState(false);

  const [form] = Form.useForm();
  const { Item } = Form;
  const { RangePicker } = DatePicker;
  const { Option } = Select;

  // 获取列表
  const getList = async (value?: any) => {
    console.log('value', value);
    setLoading(true);
    // const res = await requestGetIncentiveTaskList({});
    const item: IIncentiveManage = {
      taskId: '1',
      taskName: '激励任务名称',
      startTime: '2022-12-1',
      endTime: '2022-12-2',
      desc: '激励任务描述',
      target: '激励任务对象',
      status: 0
    };
    setList([item]);
    setLoading(false);
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
      <Form form={form} className={style.form} layout="inline" onFinish={getList}>
        <Item label="任务名称：" name="taskName">
          <Input className={style.textInput} placeholder="请输入" />
        </Item>
        <Item label="任务时间：" name="taskTime">
          <RangePicker className={style.rangePicker} />
        </Item>
        <Item label="任务状态：" name="status">
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
        rowKey="taskId"
        columns={TableColumns(editViewHandle)}
        scroll={{ x: 'max-content' }}
        dataSource={list}
        className={style.table}
        loading={loading}
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
export default IncentiveManage;
