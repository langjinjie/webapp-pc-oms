import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import classNames from 'classnames';
import React from 'react';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { OnOperateType } from 'src/utils/interface';

const groupStatusOptions = [
  {
    name: '可用',
    id: 1
  },
  {
    name: '不可用',
    id: 0
  }
];
export const searchCols: SearchCol[] = [
  {
    type: 'input',
    name: 'staffName',
    label: '群主',
    placeholder: '请输入群主名字'
  },
  {
    type: 'input',
    name: 'chatName',
    label: '群名称',
    placeholder: '请输入群名称'
  },
  {
    type: 'select',
    name: 'status',
    label: '群状态',
    width: '180px',
    options: groupStatusOptions
  },
  {
    type: 'rangePicker',
    name: 'createTimeBegin-createTimeEnd',
    label: '群创建时间'
  }
];

export type GroupColType = {
  name: string;
  chatId: string;
  staffName: string;
  groupName: string;
  status: string;
  staffId: string;
  createTime: string;
  count: string;
  [prop: string]: any;
};
export const tableColsFun = (onOperate: OnOperateType): ColumnsType<GroupColType> => {
  return [
    {
      key: 'groupName',
      dataIndex: 'groupName',
      title: '群名称',
      ellipsis: true,
      width: 160
    },
    {
      key: 'count',
      dataIndex: 'count',
      title: '总人数',
      ellipsis: true,
      width: 160
    },
    {
      key: 'staffName',
      dataIndex: 'staffName',
      title: '群主',
      ellipsis: true,
      width: 160
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: '群状态',
      render: (text) => (
        <span className={classNames({ 'color-success': text === 1, 'color-text-secondary': text === 2 })}>
          {text === 1 ? '可用' : '不可用'}
        </span>
      ),
      width: 160
    },
    {
      key: 'createTime',
      dataIndex: 'createTime',
      title: '群创建时间',
      ellipsis: true,
      width: 160
    },

    {
      key: 'name',
      dataIndex: 'name',
      title: '操作',
      width: 100,
      fixed: 'right',
      render: (text, record) => (
        <Button type="link" onClick={() => onOperate('view', record)}>
          群详情
        </Button>
      )
    }
  ];
};
