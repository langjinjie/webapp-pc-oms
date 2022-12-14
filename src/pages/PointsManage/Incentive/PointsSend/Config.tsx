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
    { title: '任务id', dataIndex: 'taskId' },
    { title: '任务名称', dataIndex: 'taskName' },
    { title: '客户经理姓名', dataIndex: 'staffName' },
    { title: '客户经理id', dataIndex: 'staffId' },
    { title: '团队长姓名', dataIndex: 'leaderName' },
    { title: '应发积分', dataIndex: 'sendPoints' },
    {
      title: '积分发放状态',
      dataIndex: 'sendStatus',
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
      }
    },
    {
      title: '操作人',
      dataIndex: 'opName',
      render (opName: string) {
        return <>{opName || UNKNOWN}</>;
      }
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
      }
    }
  ];
};
