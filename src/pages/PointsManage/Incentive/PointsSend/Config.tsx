import React from 'react';
import { Popconfirm } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { sendStatusOptions } from 'src/pages/PointsManage/Incentive/Incentive';
import { IIncentivePointSend } from './PointsSend';
import { UNKNOWN } from 'src/utils/base';
import classNames from 'classnames';
import style from './style.module.less';

export const TableColumns: (sendPoints: (row: IIncentivePointSend) => Promise<any>) => ColumnsType = (sendPoints) => {
  return [
    { title: '任务id', dataIndex: 'taskId', width: 200 },
    { title: '任务名称', dataIndex: 'taskName', width: 300, ellipsis: true },
    { title: '客户经理姓名', dataIndex: 'staffName', width: 120 },
    { title: '客户经理id', dataIndex: 'staffId', width: 300 },
    {
      title: '团队长姓名',
      dataIndex: 'leaderName',
      width: 110,
      render (leaderName: string) {
        return <>{leaderName || UNKNOWN}</>;
      },
      ellipsis: true
    },
    { title: '应发积分', dataIndex: 'sendPoints', width: 100 },
    {
      title: '积分发放状态',
      dataIndex: 'sendStatus',
      width: 150,
      render (value: number) {
        return (
          <>
            <i className={classNames('status-point', { 'points-gray': value === 0 })} />
            <span>{sendStatusOptions.find((findItem) => findItem.value === value)?.label}</span>
          </>
        );
      }
    },
    {
      title: '发放时间',
      dataIndex: 'sendTime',
      render (sendTime: string) {
        return <>{sendTime || UNKNOWN}</>;
      },
      width: 200
    },
    {
      title: '操作人',
      dataIndex: 'opName',
      render (opName: string) {
        return <>{opName || UNKNOWN}</>;
      },
      width: 100
    },
    {
      title: '操作',
      render (value: IIncentivePointSend) {
        return (
          <>
            <Popconfirm title="确认发放该积分吗?" disabled={value.sendStatus === 1} onConfirm={() => sendPoints(value)}>
              <span className={classNames(style.send, { disabled: value.sendStatus === 1 })}>发放积分</span>
            </Popconfirm>
          </>
        );
      },
      width: 100,
      fixed: 'right'
    }
  ];
};
