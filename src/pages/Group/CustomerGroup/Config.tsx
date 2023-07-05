import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import classNames from 'classnames';
import React from 'react';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { OnOperateType } from 'src/utils/interface';

export const searchCols: SearchCol[] = [
  {
    type: 'input',
    name: 'key1',
    label: '群主',
    placeholder: '请输入群主名字'
  },
  {
    type: 'input',
    name: 'key2',
    label: '群名称',
    placeholder: '请输入群名称'
  },
  {
    type: 'select',
    name: 'key1',
    label: '群状态',
    width: '180px'
  },
  {
    type: 'rangePicker',
    name: 'date1-date2',
    label: '群创建时间'
  }
];

export type GroupColType = {
  name: string;
  [prop: string]: any;
};
export const tableColsFun = (onOperate: OnOperateType): ColumnsType<GroupColType> => {
  return [
    {
      key: 'name',
      dataIndex: 'name',
      title: '群名称',
      ellipsis: true,

      width: 160
    },
    {
      key: 'name',
      dataIndex: 'name',
      title: '总人数',
      ellipsis: true,
      width: 160
    },
    {
      key: 'name',
      dataIndex: 'name',
      title: '群主',
      ellipsis: true,
      width: 160
    },
    {
      key: 'name',
      dataIndex: 'name',
      title: '群状态',
      render: (text) => (
        <span className={classNames({ 'color-success': text === 1, 'color-text-secondary': text === 2 })}>
          {text === 1 ? '可用' : '不可用'}
        </span>
      ),
      width: 160
    },
    {
      key: 'name',
      dataIndex: 'name',
      title: '群创建时间',
      ellipsis: true,
      width: 160
    },
    {
      key: 'name',
      dataIndex: 'name',
      title: '群名称',
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
