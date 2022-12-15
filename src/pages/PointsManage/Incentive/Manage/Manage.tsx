import React, { useState, useEffect } from 'react';
import { Button, Form, Input, DatePicker, Select } from 'antd';
import { stateOptions } from 'src/pages/PointsManage/Incentive/Incentive';
import { NgTable } from 'src/components';
import { TableColumns } from 'src/pages/PointsManage/Incentive/Manage/Config';
import { EditModal } from 'src/pages/PointsManage/Incentive/components';
import { requestGetIncentiveTaskList } from 'src/apis/pointsMall';
import moment, { Moment } from 'moment';
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

export interface IEditModalValue {
  taskName: string;
  taskTime: [Moment, Moment];
  target: string;
  desc: string;
}

const IncentiveManage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [editValue, setEditValue] = useState<IEditModalValue>();
  const [isView, setIsView] = useState(false);
  const [pagination, setPagination] = useState<{ total: number; pageNum: number; pageSize: number }>({
    total: 0,
    pageNum: 1,
    pageSize: 10
  });

  const [form] = Form.useForm();
  const { Item } = Form;
  const { RangePicker } = DatePicker;
  const { Option } = Select;

  // 获取列表
  const getList = async (value?: any) => {
    setLoading(true);
    const res = await requestGetIncentiveTaskList(value);
    if (res) {
      const { total, list } = res;
      setList(list);
      setPagination((pagination) => ({ ...pagination, total }));
    }
    setLoading(false);
  };

  const onFinish = (value: { [key: string]: any }) => {
    const { taskName, taskTime, status } = value;
    let startTime: string | undefined;
    let endTime: string | undefined;
    if (taskTime) {
      startTime = taskTime[0].startOf('day').format('YYYY-MM-DD HH:mm:ss');
      endTime = taskTime[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');
    }
    // 重置分页
    setPagination((pagination) => ({ ...pagination, pageNum: 1 }));
    getList({ taskName, status: +status, startTime, endTime, pageNum: 1, pageSize: 10 });
  };

  // 查询重置
  const searchReset = () => {
    // 重置分页
    setPagination((pagination) => ({ ...pagination, pageNum: 1, pageSize: 10 }));
    getList();
  };

  // 创建激励任务
  const AddTask = () => {
    setVisible(true);
    setIsView(false);
  };

  // 编辑/查看
  const editViewHandle = (row: any, isView: boolean) => {
    // 下架不能编辑
    if (!isView && row.status === 2) return;
    setIsView(isView);
    setEditValue({ ...row, taskTime: [moment(row.startTime), moment(row.endTime)] });
    setVisible(true);
  };

  const paginationChange = (current: number, pageSize?: number) => {
    const newPagination = { ...pagination };
    if (pageSize === pagination.pageSize) {
      newPagination.pageNum = current;
    } else {
      newPagination.pageNum = 1;
      newPagination.pageSize = pageSize || 10;
    }
    setPagination((pagination) => ({ ...pagination, ...newPagination }));
    const { taskName, taskTime, status } = form.getFieldsValue();
    let startTime: string | undefined;
    let endTime: string | undefined;
    if (taskTime) {
      startTime = taskTime[0].startOf('day').format('YYYY-MM-DD HH:mm:ss');
      endTime = taskTime[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');
    }
    getList({ taskName, status, startTime, endTime, ...newPagination });
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <>
      <Button type="primary" className={style.addExcitation} onClick={AddTask}>
        创建激励任务
      </Button>
      <Form form={form} className={style.form} layout="inline" onFinish={onFinish} onReset={searchReset}>
        <Item label="任务名称：" name="taskName">
          <Input className={style.textInput} placeholder="请输入" allowClear />
        </Item>
        <Item label="任务时间：" name="taskTime">
          <RangePicker className={style.rangePicker} allowClear />
        </Item>
        <Item label="任务状态：" name="status">
          <Select className={style.select} placeholder="请选择" allowClear>
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
        columns={TableColumns(editViewHandle, () => paginationChange(pagination.pageNum, pagination.pageSize))}
        scroll={{ x: 'max-content' }}
        dataSource={list}
        className={style.table}
        loading={loading}
        pagination={{
          ...pagination,
          current: pagination.pageNum
        }}
        paginationChange={paginationChange}
      />
      {/* 新增/编辑 */}
      <EditModal
        title={editValue ? (isView ? '查看激励任务' : '编辑激励任务') : '创建激励任务'}
        value={editValue}
        visible={visible}
        onChange={(value) => setEditValue(value)}
        onCancel={() => setVisible(false)}
        isView={isView}
        onSuccess={getList}
      />
    </>
  );
};
export default IncentiveManage;
