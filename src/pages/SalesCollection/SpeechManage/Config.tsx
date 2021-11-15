import React from 'react';
// import classNames from 'classnames';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { Button, Space, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { UNKNOWN } from 'src/utils/base';

export const searchCols: SearchCol[] = [
  {
    name: 'activityName',
    type: 'input',
    label: '选择目录',
    width: '268px',
    placeholder: '请输入'
  },
  {
    name: 'activityName',
    type: 'input',
    label: '话术内容',
    width: '268px',
    placeholder: '请输入'
  },
  {
    name: 'activityName',
    type: 'input',
    label: '话术小贴士',
    width: '268px',
    placeholder: '请输入'
  },
  {
    name: 'status',
    type: 'select',
    width: 160,
    label: '话术格式',

    options: [
      { id: 1, name: '未上架' },
      { id: 2, name: '已上架' },
      { id: 3, name: '已下架' }
    ]
  },
  {
    name: 'status',
    type: 'select',
    width: 160,
    label: '上架状态',

    options: [
      { id: 1, name: '未上架' },
      { id: 2, name: '已上架' },
      { id: 3, name: '已下架' }
    ]
  },
  {
    name: 'status',
    type: 'select',
    width: 160,
    label: '是否出发敏感词',

    options: [
      { id: 1, name: '未上架' },
      { id: 2, name: '已上架' },
      { id: 3, name: '已下架' }
    ]
  },
  {
    name: 'status',
    type: 'select',
    width: 160,
    label: '更新时间',

    options: [
      { id: 1, name: '未上架' },
      { id: 2, name: '已上架' },
      { id: 3, name: '已下架' }
    ]
  }
];

interface OperateProps {
  handleEdit: (id: string) => void;
  handleSort: (record: SpeechProps) => void;
}
export interface SpeechProps {
  activityName: string;
  status: number;
  createTime: string;
  onlineTime: string;
  offlineTime: string;
  isOwner: string;
  createBy: string;
  activityId: string;
  isTop: string;
}
export const columns = (args: OperateProps): ColumnsType<SpeechProps> => {
  const { handleEdit, handleSort } = args;
  return [
    {
      title: '来源',
      dataIndex: 'activityName',
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
      title: '话术格式',
      dataIndex: 'activityName',
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
      title: '话术内容',
      dataIndex: 'activityName',
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
      title: '客户分类',
      dataIndex: 'activityName',
      width: 200
    },
    {
      title: '话术小贴士',
      dataIndex: 'activityName',
      width: 200,
      ellipsis: {
        showTitle: false
      },
      render: (name) => {
        return <span>{name || UNKNOWN}</span>;
      }
    },
    {
      title: '触发敏感词',
      dataIndex: 'activityName',
      width: 180,
      ellipsis: {
        showTitle: false
      },
      render: (name) => {
        return <span>{name || UNKNOWN}</span>;
      }
    },
    {
      title: '创建时间',
      dataIndex: 'activityName',
      width: 160,
      ellipsis: {
        showTitle: false
      },
      render: (name) => {
        return <span>{name || UNKNOWN}</span>;
      }
    },
    {
      title: '更新时间',
      dataIndex: 'activityName',
      width: 160,
      ellipsis: {
        showTitle: false
      },
      render: (name) => {
        return <span>{name || UNKNOWN}</span>;
      }
    },
    {
      title: '操作',
      align: 'left',
      fixed: 'right',
      width: 140,
      render: (record: SpeechProps) => {
        return (
          <Space className="spaceWrap">
            <Button type="link" onClick={() => handleEdit(record.activityId)}>
              编辑
            </Button>
            <Button type="link" onClick={() => handleSort(record)}>
              上架
            </Button>
            <Button type="link" onClick={() => handleSort(record)}>
              下架
            </Button>
          </Space>
        );
      }
    }
  ];
};
