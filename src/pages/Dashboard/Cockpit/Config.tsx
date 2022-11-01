// import React from 'react';
import { ColumnsType } from 'antd/es/table';

export const tableColumns1: () => ColumnsType<any> = () => {
  return [
    {
      className: 'titles',
      title: '排名',
      dataIndex: '',
      color: 'red'
    },
    {
      title: '团队名称',
      dataIndex: ''
    },
    {
      title: '分中心',
      dataIndex: ''
    },
    {
      title: '联系客户数',
      sorter: true,
      dataIndex: ''
    },
    {
      title: '人均联系客户数',
      sorter: true,
      dataIndex: ''
    },
    {
      title: '内容发送数',
      sorter: true,
      dataIndex: ''
    }
  ];
};
export const tableColumns2: () => ColumnsType<any> = () => {
  return [
    {
      className: 'titles',
      title: '排名',
      dataIndex: '',
      color: 'red'
    },
    {
      title: '坐席名称',
      dataIndex: ''
    },
    {
      title: '分中心',
      dataIndex: ''
    },
    {
      title: '联系客户数',
      sorter: true,
      dataIndex: ''
    },
    {
      title: '人均联系客户数',
      sorter: true,
      dataIndex: ''
    },
    {
      title: '内容发送数',
      sorter: true,
      dataIndex: ''
    }
  ];
};
export const tableColumns3: () => ColumnsType<any> = () => {
  return [
    {
      title: '排名',
      dataIndex: ''
    },
    {
      title: '文章分类',
      dataIndex: ''
    },
    {
      title: '客户浏览人数',
      sorter: true,
      dataIndex: ''
    }
  ];
};
export const tableColumns4: () => ColumnsType<any> = () => {
  return [
    {
      title: '排名',
      dataIndex: ''
    },
    {
      title: '产品名称',
      dataIndex: ''
    },
    {
      title: '客户浏览人数',
      sorter: true,
      dataIndex: ''
    }
  ];
};
export const tableColumns5: () => ColumnsType<any> = () => {
  return [
    {
      title: '排名',
      align: 'center',
      dataIndex: ''
    },
    {
      title: '险种名称',
      align: 'center',
      dataIndex: ''
    },
    {
      title: '客户浏览人数',
      align: 'center',
      sorter: true,
      dataIndex: ''
    },
    {
      title: '客户占比',
      align: 'center',
      sorter: true,
      dataIndex: ''
    }
  ];
};
