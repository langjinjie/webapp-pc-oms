import React, { Dispatch, Key, SetStateAction, useContext, useEffect, useState } from 'react';
import { Button, Form, Input, message, Select } from 'antd';
import { NgTable } from 'src/components';
import { sendStatusOptions } from 'src/pages/PointsManage/Incentive/Incentive';
import { TableColumns } from 'src/pages/PointsManage/Incentive/PointsSend/Config';
import {
  requestGetIncentivePointsList,
  requestBatchSendIncentivePoints,
  requestImportIncentivePoints,
  requestSendAllIncentivePoints
} from 'src/apis/pointsMall';
import { IConfirmModalParam } from 'src/utils/interface';
import { Context } from 'src/store';
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
  const { setConfirmModalParam } = useContext<{ setConfirmModalParam: Dispatch<SetStateAction<IConfirmModalParam>> }>(
    Context
  );
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
    const { taskName, taskTime, status } = value;
    let startTime = '';
    let endTime = '';
    if (taskTime) {
      startTime = taskTime[0].startOf('day').format('YYYY-MM-DD HH:mm:ss');
      endTime = taskTime[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');
    }
    // 重置分页
    setPagination((pagination) => ({ ...pagination, pageNum: 1 }));
    getList({ taskName, status, startTime, endTime, pageNum: 1, pageSize: 10 });
    setSelectedRowKeys([]);
  };

  // 搜索重置
  const searchReset = () => {
    // 重置分页
    setPagination((pagination) => ({ ...pagination, pageNum: 1, pageSize: 10 }));
    setSelectedRowKeys([]);
    getList();
  };

  const paginationChange = (current: number, pageSize?: number) => {
    const newPagination = { ...pagination };
    if (pageSize === pagination.pageSize) {
      newPagination.pageNum = current;
    } else {
      newPagination.pageNum = 1;
      newPagination.pageSize = pageSize || 10;
    }
    const { taskName, status } = form.getFieldsValue();
    getList({ taskName, status, ...newPagination });
    setPagination((pagination) => ({ ...pagination, ...newPagination }));
    setSelectedRowKeys([]);
  };

  const onSelectChange = (selectedRowKeys: Key[]) => {
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
    if (selectedRowKeys.length === 0) {
      // 一键全部发放
      setConfirmModalParam({
        visible: true,
        tips: '确定发放所有积分吗？',
        onOk: async () => {
          const res = await requestSendAllIncentivePoints(form.getFieldsValue());
          if (res) {
            message.success('积分发放成功');
            setConfirmModalParam({ visible: false });
          }
        }
      });
    } else {
      // 批量发放已选中
      const list = selectedRowKeys.map((key) => ({ sendId: key }));
      setConfirmModalParam({
        visible: true,
        tips: '确定批量发放积分吗？',
        onOk: async () => {
          const res = await requestBatchSendIncentivePoints({ list });
          if (res) {
            message.success('积分发放成功');
            setConfirmModalParam({ visible: false });
          }
        }
      });
    }
    setSendLoading(false);
  };

  // 发放积分
  const sendPoints = async (row: IIncentivePointSend) => {
    if (row.sendStatus === 1) return;
    const res = await requestBatchSendIncentivePoints({ list: [{ sendId: row.sendId }] });
    if (res) {
      getList();
    }
  };

  // 一键导入
  const exportFile = async (file: File) => {
    const res = await requestImportIncentivePoints(file);
    if (res) {
      message.success('导入成功');
      setExportVisible(false);
    }
  };

  // 下载模板
  const downloadTemplate = () => {
    window.location.href =
      'https://insure-prod-server-1305111576.cos.ap-guangzhou.myqcloud.com/file/task/%E6%BF%80%E5%8A%B1%E4%BB%BB%E5%8A%A1%E7%A7%AF%E5%88%86%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx';
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
        columns={TableColumns(sendPoints)}
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
          <Button className={style.batchSendBtn} loading={sendBtnLoading} onClick={batchSend}>
            批量发放
          </Button>
        </div>
      )}
      <ExportModal
        visible={exportVisible}
        onOK={exportFile}
        onCancel={() => setExportVisible(false)}
        onDownLoad={downloadTemplate}
      />
    </>
  );
};
export default PointsSend;
