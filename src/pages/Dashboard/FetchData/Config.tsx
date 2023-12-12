import { Button, Popconfirm, Space, TableColumnProps, Tooltip } from 'antd';
import React from 'react';
import { AuthBtn, SearchCol } from 'src/components';
import { OperateType } from 'src/utils/interface';

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
    name: 'name',
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
  params: { paramId: string; paramDesc: string; paramName: string; paramValue?: string }[];
  paramName: string;
  paramDesc: string;
  paramId: string;
  createBy: string;
  dateCreated: string;
  lastUpdated: string;
  recordId: string;
  [prop: string]: any;
};
export const TableColumnFun = (
  operate: (type: OperateType, record: FetchDataRecordType, index?: number) => void
): TableColumnProps<FetchDataRecordType>[] => {
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
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      )
    },
    {
      key: 'params',
      dataIndex: 'params',
      title: '模板参数',
      ellipsis: { showTitle: false },
      render: (params) => (
        <Tooltip
          placement="topLeft"
          title={params?.map((param: any, index: number) => (
            <span key={param.paramId + index}>
              <span>{param.paramName}</span>
              {index < params.length - 1 && <span>,</span>}
            </span>
          ))}
        >
          {params?.map((param: any, index: number) => (
            <span key={param.paramId + index}>
              <span>{param.paramName}</span>
              {index < params.length - 1 && <span>,</span>}
            </span>
          )) || '无'}
        </Tooltip>
      )
    },
    {
      key: 'dateCreated',
      width: 180,
      dataIndex: 'dateCreated',
      title: '创建时间'
    },
    {
      key: 'lastUpdated',
      width: 180,
      dataIndex: 'lastUpdated',
      title: '更新时间'
    },
    { key: 'createBy', dataIndex: 'createBy', title: '创建人' },
    {
      title: '操作',
      key: 'operate',
      fixed: 'right',
      width: 220,
      render: (_, record, index) => (
        <Space>
          <AuthBtn path="/edit">
            <Button type="link" onClick={() => operate('edit', record)}>
              编辑
            </Button>
          </AuthBtn>
          <AuthBtn path="/delete">
            <Popconfirm title={'确定删除？'} onConfirm={() => operate('delete', record, index)}>
              <Button type="link">删除</Button>
            </Popconfirm>
          </AuthBtn>
          <AuthBtn path="/operate">
            <Button type="link" onClick={() => operate('other', record)}>
              执行
            </Button>
          </AuthBtn>
          <AuthBtn path="/export">
            <Button type="link" onClick={() => operate('view', record)}>
              下载
            </Button>
          </AuthBtn>
        </Space>
      )
    }
  ];
};

const executeStatus = [
  { id: 0, name: '执行中' },
  { id: 1, name: '执行成功' },
  { id: 2, name: '执行失败' }
];
export const downloadTableColumnFun = (
  operate: (type: OperateType, record: FetchDataRecordType) => void
): TableColumnProps<FetchDataRecordType>[] => {
  return [
    { key: 'recordId', dataIndex: 'recordId', title: 'ID', width: 190 },
    { key: 'name', dataIndex: 'name', title: '模板名称' },
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
      key: 'execSql',
      dataIndex: 'execSql',
      title: '执行SQL',
      width: 200,
      ellipsis: { showTitle: false },
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      )
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: '生成状态',
      ellipsis: { showTitle: false },
      render: (text) => executeStatus.filter((item) => item.id === text)[0]?.name
    },
    {
      key: 'lastUpdated',
      dataIndex: 'lastUpdated',
      title: '生成时间',
      width: 180
    },
    {
      key: 'usedTime',
      width: 140,
      dataIndex: 'usedTime',
      title: '执行时间（S）',
      render: (usedTime) => usedTime || 0
    },
    { key: 'createBy', width: 120, dataIndex: 'createBy', title: '操作人' },
    {
      title: '操作',
      width: 180,
      render: (_, record) => (
        <Space>
          {record.status === 1 && (
            <AuthBtn path="/download/download">
              <Popconfirm
                title="确定下载数据"
                onConfirm={() => {
                  operate('view', record);
                }}
              >
                <Button type="link">下载数据</Button>
              </Popconfirm>
            </AuthBtn>
          )}
          {record.status === 2 && (
            <AuthBtn path="/download/view">
              <Tooltip title={record.errMsg} placement="topLeft" trigger={'hover'}>
                <Button type="link">失败原因</Button>
              </Tooltip>
            </AuthBtn>
          )}
          {record.status !== 0 && (
            <AuthBtn path="/download/retry">
              <Popconfirm
                title="确定重新执行"
                onConfirm={() => {
                  operate('other', record);
                }}
              >
                <Button type="link">重新执行</Button>
              </Popconfirm>
            </AuthBtn>
          )}
        </Space>
      )
    }
  ];
};
