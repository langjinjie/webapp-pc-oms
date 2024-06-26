import React from 'react';

import { ColumnsType } from 'antd/lib/table';

import moment from 'moment';
import { UNKNOWN } from 'src/utils/base';
import { Popconfirm, Space, Tooltip } from 'antd';
import { AuthBtn } from 'src/components';

export interface TaskProps {
  taskId: string;
  taskName: string;
  key: string;
  age: number;
  address: string;
  syncBank: number;
  isTop: boolean;
  tags?: string[];
  corpId: string;
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
  exportData: (task: TaskProps) => void;
  viewItem: (taskId: string) => void;
  operateItem: (task: TaskProps, operateType: number, index: number) => void;
};
const columns = (args: colargsType): ColumnsType<TaskProps> => {
  const { exportData, viewItem, operateItem } = args;
  const taskStatusList = ['未开始', '进行中', '已结束'];
  return [
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
      width: 200,
      ellipsis: {
        showTitle: false
      },
      render: (name) => (
        <Tooltip placement="topLeft" title={name}>
          {name || UNKNOWN}
        </Tooltip>
      )
    },
    {
      title: '每人目标迁移数',
      key: 'targetTransferNum',
      dataIndex: 'targetTransferNum',
      width: 160
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
      title: '任务状态',
      dataIndex: 'taskStatus',
      key: 'opName',
      width: 140,
      render (status: number) {
        return <span>{taskStatusList[status]}</span>;
      }
    },
    {
      title: '完成任务数',
      key: 'staffExecNum',
      render (row: TaskProps) {
        return (
          <span>
            {row.staffExecNum + '/' + row.staffTotalNum}（
            {Math.round((row.staffExecNum / row.staffTotalNum) * 100 * 10) / 10}%） {/* 保留最多一位小数 */}
          </span>
        );
      },
      width: 160
    },
    {
      title: '好友迁移数',
      key: 'clientTransferNum',
      render (row: TaskProps) {
        return (
          <span>
            {row.clientTransferNum + '/' + row.clientTotalNum}（
            {Math.round((row.clientTransferNum / row.clientTotalNum) * 100 * 10) / 10}%） {/* 保留最多一位小数 */}
          </span>
        );
      },
      width: 160
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 160,
      render: (_, record, index) => (
        <Space size="small">
          <AuthBtn path="/view">
            <a onClick={() => viewItem(record.taskId)}>查看</a>
          </AuthBtn>
          {record.taskStatus === 1 && (
            <AuthBtn path="/close">
              <Popconfirm
                title="任务关闭后数据统计截止当前，确定操作吗？ "
                onConfirm={() => operateItem(record, 1, index)}
              >
                <a>关闭</a>
              </Popconfirm>
            </AuthBtn>
          )}
          {record.taskStatus !== 0 && (
            <AuthBtn path="/download">
              <a onClick={() => exportData(record)}>导出数据</a>
            </AuthBtn>
          )}
          {record.taskStatus === 0 && (
            <AuthBtn path="/delete">
              <Popconfirm
                title="删除后不给客户经理下发此任务，确定操作吗？ "
                onConfirm={() => operateItem(record, 0, index)}
              >
                <a>删除</a>
              </Popconfirm>
            </AuthBtn>
          )}
        </Space>
      )
    }
  ];
};

export { columns };
