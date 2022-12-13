import React, { Key, useEffect, useState } from 'react';
import { Button, Form, Input, message, Select } from 'antd';
import { RcFile } from 'antd/es/upload/interface';
import { NgTable } from 'src/components';
import { sendStatusOptions } from 'src/pages/PointsManage/Incentive/Incentive';
import { TableColumns } from 'src/pages/PointsManage/Incentive/PointsSend/Config';
import {
  requestGetIncentivePointsList,
  requestBatchSendIncentivePoints,
  requestImportIncentivePoints
} from 'src/apis/pointsMall';
import ExportModal from 'src/pages/SalesCollection/SpeechManage/Components/ExportModal/ExportModal';
import style from './style.module.less';

export interface IIncentivePointSend {
  sendId: string; // 发放id
  taskId: string; // 任务id
  staffId: string; // 客户经理id
  staffName: string; // 客户经理姓名
  leaderName?: string; // 团队长姓名
  sendPoints: number; // 应发积分
  sendStatus?: number; // 积分发放状态，0-未发放，1-已发放
  sendTime?: string; // 发放时间
  opName?: string; // 操作人
}

export const PointsSend: React.FC = () => {
  const [list, setList] = useState<IIncentivePointSend[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendBtnLoading, setSendLoading] = useState(false);
  const [exportVisible, setExportVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [pagination, setPagination] = useState<{ total: number; pageNum: number; pageSize: number }>({
    total: 0,
    pageNum: 1,
    pageSize: 10
  });

  const { Item } = Form;
  const [form] = Form.useForm();
  const { Option } = Select;

  // 获取列表
  const getList = async (params?: { [key: string]: any }) => {
    const { pageNum, pageSize } = pagination;
    setLoading(true);
    const res = await requestGetIncentivePointsList({ pageNum, pageSize, ...params });
    setLoading(false);
    console.log('res', res);
    if (res) {
      const { total, list } = res;
      setList(list);
      setPagination((pagination) => ({ ...pagination, total }));
    } else {
      const list = [
        {
          sendId: '1',
          taskId: '1',
          staffId: '1',
          staffName: '李思',
          leaderName: '李斯',
          sendPoints: 1500,
          sendStatus: 1,
          sendTime: '2022-12-6 08:08:08',
          opName: '郎金杰'
        }
      ];
      setList(list);
    }
  };

  // 搜索
  const onFinish = (value: any) => {
    console.log('value', value);
    const { taskName, taskTime, status } = value;
    let startTime = '';
    let endTime = '';
    if (taskTime) {
      startTime = taskTime[0].startOf('day').format('YYYY-MM-DD HH:mm:ss');
      endTime = taskTime[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');
    }
    // 重置分页
    setPagination((pagination) => ({ ...pagination, pageNum: 1 }));
    console.log('param', { taskName, status, startTime, endTime, pageNum: 1, pageSize: 10 });
    getList({ taskName, status, startTime, endTime, pageNum: 1, pageSize: 10 });
  };

  // 搜索重置
  const searchReset = () => {
    // 重置分页
    setPagination((pagination) => ({ ...pagination, pageNum: 1, pageSize: 10 }));
    getList();
  };

  const paginationChange = (current: number, pageSize?: number) => {
    const newPagination = { pageNum: current, pageSize: pageSize || pagination.pageSize };
    setPagination((pagination) => ({ ...pagination, ...newPagination }));
    const { taskName, taskTime, status } = form.getFieldsValue();
    let startTime = '';
    let endTime = '';
    if (taskTime) {
      startTime = taskTime[0].startOf('day').format('YYYY-MM-DD HH:mm:ss');
      endTime = taskTime[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');
    }
    console.log('param', { taskName, status, startTime, endTime, pageNum: 1, pageSize: 10 });
    getList({ taskName, status, startTime, endTime, ...newPagination });
  };

  const onSelectChange = (selectedRowKeys: Key[]) => {
    console.log('selectedRowKeys', selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection: any = {
    hideSelectAll: true,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: Key[]) => {
      onSelectChange(selectedRowKeys);
    },
    getCheckboxProps: (record: IIncentivePointSend) => {
      return {
        disabled: record.sendStatus === 1
      };
    }
  };

  // 批量发放
  const batchSend = async () => {
    setSendLoading(true);
    const list = selectedRowKeys.map((key) => ({ sendId: key }));
    await requestBatchSendIncentivePoints({ list });
    setSendLoading(false);
  };

  // 一键导入
  const exportFile = async (file: RcFile) => {
    const res = await requestImportIncentivePoints({ file });
    console.log('res', res);
    if (res) {
      message.success('导入成功');
    }
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <>
      <Button className={style.uploadBtn} type="primary" onClick={() => setExportVisible(true)}>
        一键导入
      </Button>
      <Form className={style.form} form={form} layout="inline" onFinish={onFinish} onReset={searchReset}>
        <Item label="任务名称" name="taskName">
          <Input className={style.input} placeholder="请输入" />
        </Item>
        <Item label="客户经理姓名" name="staffName">
          <Input className={style.input} placeholder="请输入" />
        </Item>
        <Item label="任务状态" name="sendStatus">
          <Select className={style.select} placeholder="请选择">
            {sendStatusOptions.map((mapItem) => (
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
        rowKey="sendId"
        loading={loading}
        rowSelection={rowSelection}
        columns={TableColumns()}
        scroll={{ x: 'max-content' }}
        dataSource={list}
        className={style.table}
        pagination={{
          ...pagination,
          current: pagination.pageNum
        }}
        paginationChange={paginationChange}
      />
      {list.length === 0 || (
        <div className={style.batchSendWrap}>
          <Button
            className={style.batchSendBtn}
            loading={sendBtnLoading}
            disabled={selectedRowKeys.length === 0}
            onClick={batchSend}
          >
            批量发放
          </Button>
        </div>
      )}
      <ExportModal visible={exportVisible} onOK={exportFile} onCancel={() => setExportVisible(false)} />
    </>
  );
};
export default PointsSend;
