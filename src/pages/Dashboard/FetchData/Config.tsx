import { Button, Space, TableColumnProps, Tooltip } from 'antd';
import React from 'react';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';

export const searchCols: SearchCol[] = [
  {
    name: 'name',
    type: 'input',
    label: '模板名称',
    width: '180px',
    placeholder: '请输入'
  },
  {
    name: 'content',
    type: 'input',
    label: '模板内容',
    placeholder: '请输入',
    width: '280px'
  }
];
export const downloadSearchCols: SearchCol[] = [
  {
    name: 'sceneCode',
    type: 'input',
    label: '模板名称',
    width: '180px',
    placeholder: '请输入'
  }
];

export type FetchDataRecordType = {
  key1: string;
  sqlId: string;
  name: string;
  des: string;
  content: string;
  params: string;
  paramName: string;
  paramDesc: string;
  paramId: string;
  createBy: string;
  dateCreated: string;
  lastUpdated: string;
  [prop: string]: any;
};
export const TableColumnFun = (): TableColumnProps<FetchDataRecordType>[] => {
  return [
    { key: 'name', dataIndex: 'name', title: '取数模板名称' },
    {
      key: 'des',
      dataIndex: 'des',
      title: '模板描述',
      ellipsis: { showTitle: false },
      render: (text) => (
        <Tooltip placement="top" title={text}>
          {text}
        </Tooltip>
      )
    },
    {
      key: 'content',
      dataIndex: 'content',
      title: '模板内容',
      ellipsis: { showTitle: false },
      render: (text) => (
        <Tooltip placement="top" title={text}>
          {text}
        </Tooltip>
      )
    },
    {
      key: 'params',
      dataIndex: 'params',
      title: '模板参数',
      ellipsis: { showTitle: false },
      render: (text) => (
        <Tooltip placement="top" title={text}>
          {text}
        </Tooltip>
      )
    },
    { key: 'dateCreated', dataIndex: 'dateCreated', title: '模板更新时间' },
    { key: 'lastUpdated', dataIndex: 'lastUpdated', title: '更新时间' },
    { key: 'createBy', dataIndex: 'createBy', title: '创建人' },
    {
      title: '操作',
      render: () => (
        <Space>
          <Button type="link">编辑</Button>
          <Button type="link">删除</Button>
          <Button type="link">执行</Button>
          <Button type="link">下载</Button>
        </Space>
      )
    }
  ];
};
export const downloadTableColumnFun = (): TableColumnProps<FetchDataRecordType>[] => {
  return [
    { key: 'sqlId', dataIndex: '', title: 'ID' },
    { key: 'name', dataIndex: '', title: '模板名称' },
    {
      key: 'des',
      dataIndex: '',
      title: '模板描述',
      ellipsis: { showTitle: false },
      render: (text) => (
        <Tooltip placement="top" title={text}>
          {text}
        </Tooltip>
      )
    },
    {
      key: 'execSql',
      dataIndex: '',
      title: '执行SQL',
      ellipsis: { showTitle: false },
      render: (text) => (
        <Tooltip placement="top" title={text}>
          {text}
        </Tooltip>
      )
    },
    {
      key: 'key4',
      dataIndex: '',
      title: '生成状态',
      ellipsis: { showTitle: false },
      render: (text) => (
        <Tooltip placement="top" title={text}>
          {text}
        </Tooltip>
      )
    },
    { key: 'key5', dataIndex: '', title: '生成时间' },
    { key: 'usedTime', dataIndex: '', title: '执行时间' },
    { key: 'createBy', dataIndex: '', title: '操作人' },
    {
      title: '操作',
      render: () => (
        <Space>
          <Button type="link">下载数据</Button>
          <Button type="link">重新执行</Button>
          <Button type="link">失败原因</Button>
        </Space>
      )
    }
  ];
};
