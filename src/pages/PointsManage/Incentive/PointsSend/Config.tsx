import React from 'react';
import { Popconfirm } from 'antd';
import { requestBatchSendIncentivePoints } from 'src/apis/pointsMall';
import { ColumnsType } from 'antd/es/table';
// import { UNKNOWN } from 'src/utils/base';
import { sendStatusOptions } from 'src/pages/PointsManage/Incentive/Incentive';
import { IIncentivePointSend } from './PointsSend';
import classNames from 'classnames';
import style from './style.module.less';

export const TableColumns: () => ColumnsType = () => {
  const sendPoints = async (sendId: string) => {
    await requestBatchSendIncentivePoints({ list: { sendId } });
  };
  return [
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
    { title: '发放时间', dataIndex: 'sendTime' },
    { title: '操作人', dataIndex: 'opName' },
    {
      title: '操作',
      render (value: IIncentivePointSend) {
        return (
          <>
            <Popconfirm title="确认发放该积分吗?" onConfirm={() => sendPoints(value.sendId)}>
              <span className={style.send}>发放积分</span>
            </Popconfirm>
          </>
        );
      }
    }
  ];
};
