import React from 'react';
import { ColumnsType } from 'antd/es/table';
import { fix } from 'src/utils/base';
// import style from './style.module.less';
// import classNames from 'classnames';

export const tableColumns1: () => ColumnsType<any> = () => {
  return [
    {
      className: 'titles',
      title: '排名',
      dataIndex: 'sort',
      width: 70
    },
    {
      title: '团队名称',
      dataIndex: 'teamName',
      ellipsis: true
    },
    {
      title: '分中心',
      dataIndex: 'centerName',
      ellipsis: true
    },
    {
      title: '联系客户数',
      sorter: true,
      dataIndex: 'chatFriendCount'
    },
    {
      title: '人均联系客户数',
      sorter: true,
      dataIndex: 'perChatFriendCount'
    },
    {
      title: '内容发送数',
      sorter: true,
      dataIndex: 'dayMarket'
    }
  ];
};
export const tableColumns2: () => ColumnsType<any> = () => {
  return [
    {
      className: 'titles',
      title: '排名',
      dataIndex: 'sort',
      width: 70
    },
    {
      title: '坐席姓名',
      dataIndex: 'staffName',
      ellipsis: true
    },
    {
      title: '团队名称',
      dataIndex: 'teamName',
      ellipsis: true
    },
    {
      title: '分中心',
      dataIndex: 'centerName',
      ellipsis: true
    },
    {
      title: '联系客户数',
      sorter: true,
      dataIndex: 'chatCnt'
    },
    {
      title: '内容发送数',
      sorter: true,
      dataIndex: 'dayMarket'
    }
  ];
};
export const tableColumns3: () => ColumnsType<any> = () => {
  return [
    {
      title: '排名',
      dataIndex: 'sort',
      width: 100
    },
    {
      title: '文章分类',
      dataIndex: 'title',
      ellipsis: true
    },
    {
      title: '查看内容总次数',
      sorter: true,
      align: 'center',
      dataIndex: 'totalCnt',
      width: 150
    },
    {
      title: '人均查看数',
      sorter: true,
      align: 'center',
      dataIndex: 'perCnt',
      width: 150
    }
  ];
};
export const tableColumns4: () => ColumnsType<any> = () => {
  return [
    {
      title: '排名',
      dataIndex: 'sort',
      width: 70
    },
    {
      title: '产品名称',
      dataIndex: 'title',
      ellipsis: true
    },
    {
      title: '客户浏览次数',
      sorter: true,
      dataIndex: 'totalCnt',
      width: 150
    }
  ];
};
export const tableColumns5: () => ColumnsType<any> = () => {
  return [
    {
      title: '排名',
      align: 'center',
      dataIndex: 'sort',
      width: 70
    },
    {
      title: '险种名称',
      align: 'center',
      dataIndex: 'title',
      ellipsis: true
    },
    {
      title: '客户浏览人数',
      align: 'center',
      sorter: true,
      dataIndex: 'totalCnt',
      width: 150
    },
    {
      title: '客户占比',
      align: 'center',
      sorter: true,
      dataIndex: 'clientRate',
      width: 150
    }
  ];
};

const rankImg = [
  require('src/assets/images/cockpit/rank_1.png'),
  require('src/assets/images/cockpit/rank_2.png'),
  require('src/assets/images/cockpit/rank_3.png')
];

// 分中心排名
export const tableColumnsSubCenterRangking: () => ColumnsType<any> = () => {
  return [
    {
      title: '排名',
      width: 42,
      render (_: any, __: any, index: number) {
        return <>{index > 2 ? fix(index + 1, 2) : <img src={rankImg[index]} />}</>;
      }
    },
    {
      title: '分中心',
      dataIndex: 'areaName',
      width: 110,
      ellipsis: true
    },
    { title: '联系客户数', dataIndex: 'chatFriendCount', width: 70 },
    { title: '内容发送数', dataIndex: 'dayMarket', width: 70 }
  ];
};
