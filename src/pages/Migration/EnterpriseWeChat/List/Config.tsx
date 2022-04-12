import React from 'react';

import { ColumnsType } from 'antd/lib/table';

import moment from 'moment';
import { UNKNOWN } from 'src/utils/base';
import { Popconfirm, Space } from 'antd';
import { percentage } from 'src/utils/tools';

export interface TaskProps {
  taskId: string;
  title: string;
  key: string;
  age: number;
  address: string;
  syncBank: number;
  isTop: boolean;
  tags?: string[];
  corpNames: string[];
  staffTotalNum: number; // 需执行群发任务的员工总数

  staffExecNum: number; // 已执行群发任务的员工数
  clientTotalNum: number; // 客户总数
  clientTransferNum: number; // 迁移成功的客户数
  taskStatus: number; // 任务状态 0-未开始；1-进行中；2-已结束
}
export interface PaginationProps {
  current: number;
  pageSize: number;
  total: number;
  showTotal: (total: any) => string;
}
// 表哥配置项
type colargsType = {
  changeItemStatus: (record: any) => void;
  viewItem: (taskId: string) => void;
  deleteItem: (record: any) => void;
};
const columns = (args: colargsType): ColumnsType<TaskProps> => {
  const { changeItemStatus, viewItem, deleteItem } = args;

  return [
    { title: '任务名称', dataIndex: 'newsId', key: 'newsId', width: 100 },
    {
      title: '创建任务时间',
      key: 'createTime',
      dataIndex: 'createTime',
      width: 160,
      render: (text: string) => {
        return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm') : UNKNOWN}</span>;
      }
    },
    {
      title: '创建人',
      dataIndex: 'opName',
      key: 'opName',
      width: 196
    },
    {
      title: '开始时间',
      key: 'startTime',
      dataIndex: 'startTime',
      width: 160,
      render: (text: string) => {
        return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm') : UNKNOWN}</span>;
      }
    },
    {
      title: '结束时间',
      key: 'endTime',
      dataIndex: 'endTime',
      width: 160,
      render: (text: string) => {
        return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm') : UNKNOWN}</span>;
      }
    },

    {
      title: '员工执行进度',
      width: 140,
      key: 'categoryName',
      align: 'center',
      render: (text, record) => {
        return <span>{percentage(record.staffExecNum, record.staffTotalNum)}</span>;
      }
    },
    {
      title: '客户迁移进度',
      width: 260,
      align: 'center',
      render: (text, record) => <span>{percentage(record.clientTransferNum, record.clientTotalNum)}</span>
    },
    {
      title: '任务状态',
      width: 140,
      key: 'taskStatus',
      dataIndex: 'taskStatus',
      render: (status: number) => {
        return <span>{status === 0 ? '未开始' : status === 1 ? '进行中' : '已结束'}</span>;
      }
    },

    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 220,
      render: (text, record) => (
        <Space size="small">
          <a onClick={() => viewItem(record.taskId)}>查看</a>
          {record.syncBank === 1 && (
            <Popconfirm title="下架后会影响所有机构，确定要下架?" onConfirm={() => changeItemStatus(record)}>
              <a>关闭</a>
            </Popconfirm>
          )}
          {record.syncBank === 2 && <a onClick={() => changeItemStatus(record)}>明细</a>}
          {record.taskStatus === 0 && (
            <Popconfirm title="删除后会影响所有机构，确定要删除?" onConfirm={() => deleteItem(record)}>
              <a>删除</a>
            </Popconfirm>
          )}
        </Space>
      )
    }
  ];
};

export { columns };
