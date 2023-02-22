import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { UNKNOWN } from 'src/utils/base';

const auditStatus = [
  // 0-审核中；1-审批通过；2-审批不通过；3-撤回；4-自动审批通过
  {
    id: 0,
    name: '审批中'
  },
  {
    id: 1,
    name: '审批通过'
  },
  {
    id: 2,
    name: '审批不通过'
  },
  {
    id: 3,
    name: '撤回'
  },
  {
    id: 4,
    name: '自动审批通过'
  }
];

export const searchColsFun = (): SearchCol[] => [
  {
    type: 'input',
    label: '关键词搜索',
    name: 'keywords',
    placeholder: '请输入'
  },
  {
    type: 'input',
    label: '提交人',
    name: 'createBy',
    placeholder: '请输入'
  },
  {
    type: 'rangePicker',
    label: '创建时间',
    name: 'createTime'
  },

  {
    type: 'input',
    label: '审核人',
    name: 'curHandler',
    placeholder: '请输入'
  },

  {
    type: 'select',
    label: '审核状态',
    name: 'auditStatus',
    width: '120px',
    options: auditStatus,
    placeholder: '请选择'
  }
];

export interface WikiColumn {
  wikiId: string;
  level1CategroyId: string;
  level1Name: string;
  level2CategroyId: string;
  level2Name: string;
  wikiStatus: number;
  title: string;
  auditStatus: number;
  createBy: string;
  createTime: string;
  updateTime: string;
  openCount: number;
  [prop: string]: any;
}

export const tableColumnsFun = (onOperate: (record: WikiColumn) => void): ColumnsType<WikiColumn> => {
  return [
    {
      key: 'videoId',
      dataIndex: 'videoId',
      title: '序号',
      render: (text, record, index) => {
        return index + 1;
      },
      width: 80
    },
    {
      key: 'level1Name',
      dataIndex: 'level1Name',
      title: '一级目录',
      ellipsis: true,
      width: 200
    },
    {
      key: 'level2Name',
      dataIndex: 'level2Name',
      title: '二级目录',
      width: 200,
      render: (level2Name) => level2Name || UNKNOWN
    },
    {
      key: 'createBy',
      dataIndex: 'createBy',
      title: '提交人',
      width: 100,
      render: (createBy) => createBy || UNKNOWN
    },

    {
      key: 'title',
      dataIndex: 'title',
      title: '知识库标题',
      render: (onlineTime) => onlineTime || UNKNOWN,
      width: 160
    },
    {
      key: 'curHandler',
      dataIndex: 'curHandler',
      title: '当前审核人',
      render: (onlineTime) => onlineTime || UNKNOWN,
      width: 160
    },
    {
      key: 'auditStatus',
      dataIndex: 'auditStatus',
      title: '审核状态',
      width: 120,
      render: (status) => {
        return (
          <div>
            <span>{auditStatus.filter((item) => item.id === status)[0]?.name}</span>
          </div>
        );
      }
    },

    {
      key: 'auditTime',
      dataIndex: 'auditTime',
      title: '审核时间',
      render: (auditTime) => auditTime || UNKNOWN,
      width: 160
    },
    {
      key: 'createTime',
      dataIndex: 'createTime',
      title: '创建时间',
      width: 160
    },

    {
      key: 'operate',
      title: '操作',
      fixed: 'right',
      width: 100,
      render: (operate, record) => {
        return (
          <Button type="link" onClick={() => onOperate(record)}>
            查看详情
          </Button>
        );
      }
    }
  ];
};
