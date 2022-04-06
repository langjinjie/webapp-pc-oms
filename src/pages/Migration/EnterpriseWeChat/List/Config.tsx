import React from 'react';

import { ColumnsType } from 'antd/lib/table';

import moment from 'moment';
import { UNKNOWN } from 'src/utils/base';
import { Popconfirm, Space } from 'antd';

export interface TaskProps {
  newsId: string;
  title: string;
  key: string;
  age: number;
  address: string;
  syncBank: number;
  isTop: boolean;
  tags?: string[];
  corpNames: string[];
}
export interface PaginationProps {
  current: number;
  pageSize: number;
  total: number;
  showTotal: (total: any) => string;
}
// 表哥配置项
type colargsType = {
  handleEdit: (record: any) => void;
  changeItemStatus: (record: any) => void;
  viewItem: (record: any) => void;
  deleteItem: (record: any) => void;
};
const columns = (args: colargsType): ColumnsType<TaskProps> => {
  const { handleEdit, changeItemStatus, viewItem, deleteItem } = args;

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
      dataIndex: 'title',
      key: 'title',
      width: 196,
      ellipsis: { showTitle: true },
      render: (text: string, record: any) => (
        <a
          onClick={() => {
            viewItem(record);
          }}
        >
          {record.title}
        </a>
      )
    },
    {
      title: '开始时间',
      key: 'createTime',
      dataIndex: 'createTime',
      width: 160,
      render: (text: string) => {
        return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm') : UNKNOWN}</span>;
      }
    },
    {
      title: '结束时间',
      key: 'createTime',
      dataIndex: 'createTime',
      width: 160,
      render: (text: string) => {
        return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm') : UNKNOWN}</span>;
      }
    },

    {
      title: '人员执行进度',
      dataIndex: 'categoryName',
      width: 140,
      key: 'categoryName',
      align: 'center',
      render: (categoryName: string) => categoryName || UNKNOWN
    },
    {
      title: '客户迁移进度',
      dataIndex: 'fromSource',
      width: 260,
      align: 'center'
    },

    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 220,
      render: (text, record) => (
        <Space size="small">
          <a onClick={() => handleEdit(record)}>查看</a>
          <a onClick={() => viewItem(record)}>查看</a>
          {record.syncBank !== 1 && <a onClick={() => changeItemStatus(record)}>上架</a>}

          {record.syncBank === 1 && (
            <Popconfirm title="下架后会影响所有机构，确定要下架?" onConfirm={() => changeItemStatus(record)}>
              <a>下架</a>
            </Popconfirm>
          )}
          {record.syncBank !== 1 && (
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
