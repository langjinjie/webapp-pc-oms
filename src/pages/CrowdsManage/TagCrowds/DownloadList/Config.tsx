import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';

const statusOptions = [
  { id: 0, name: '生成中' },
  { id: 1, name: '生成成功' },
  { id: 2, name: '生成失败' }
];

export const searchCols: SearchCol[] = [
  {
    type: 'input',
    label: '分群ID',
    name: 'packageId',
    placeholder: '请输入'
  },
  {
    type: 'input',
    label: '分群名称',
    name: 'packageName',
    placeholder: '请输入'
  },

  {
    type: 'input',
    label: '处理人',
    name: 'opName',
    width: '140px',
    placeholder: '请选择'
  },
  {
    type: 'select',
    label: '生成状态',
    name: 'runStatus',
    width: '100px',
    options: statusOptions
  },
  {
    type: 'rangePicker',
    label: '更新时间',
    width: '140px',
    name: 'updateTime',
    placeholder: '请选择'
  },
  {
    type: 'rangePicker',
    label: '生成时间',
    name: 'runTime'
  }
];

interface VideoColumn {
  [prop: string]: any;
}

export const tableColumnsFun = (): ColumnsType<VideoColumn> => {
  return [
    // {
    //   key: 'key1',
    //   dataIndex: 'key1',
    //   title: '下载ID',
    //   width: 100
    // },
    {
      key: 'packageId',
      dataIndex: 'packageId',
      title: '分群ID',
      width: 140
    },
    {
      key: 'packageName',
      dataIndex: 'packageName',
      title: '分群名称',
      width: 100
    },

    {
      key: 'clientNum',
      dataIndex: 'clientNum',
      width: 100,
      title: '客户数量'
    },
    {
      key: 'staffNum',
      dataIndex: 'staffNum',
      width: 120,
      title: '对应坐席数量'
    },
    {
      key: 'updateTime',
      dataIndex: 'updateTime',
      width: 180,
      title: '更新时间'
    },
    {
      key: 'runStatus',
      dataIndex: 'runStatus',
      title: '生成状态',
      width: 140,
      render: (text) => statusOptions.find((status) => status.id === text)?.name
    },
    {
      key: 'runTime',
      dataIndex: 'runTime',
      title: '生成时间',
      width: 140
    },
    {
      key: 'opName',
      dataIndex: 'opName',
      title: '处理人',
      width: 140
    },
    {
      key: 'key7',
      title: '操作',
      fixed: 'right',
      width: 100,
      render: () => {
        return <Button type="link">下载文件</Button>;
      }
    }
  ];
};
