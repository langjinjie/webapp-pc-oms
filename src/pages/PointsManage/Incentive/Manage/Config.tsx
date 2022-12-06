import React from 'react';
import { ColumnsType } from 'antd/es/table';
import { UNKNOWN } from 'src/utils/base';
import { IIncentiveManage } from './Manage';
import { Popconfirm } from 'antd';
import { requestManageIncentiveTask } from 'src/apis/pointsMall';
import style from 'src/pages/PointsManage/Incentive/Manage/style.module.less';
import classNames from 'classnames';

export const stateOptions: { [key: string]: string } = {
  0: '未上架',
  1: '已上架',
  2: '已结束'
};

export const TableColumns: (editViewHandle: (row: any, isView: boolean) => void) => ColumnsType = (editViewHandle) => {
  // 上架任务
  const upTask = async (taskId: string) => {
    const res = await requestManageIncentiveTask({ taskId });
    console.log('res', res);
  };

  return [
    { title: '任务名称', dataIndex: 'taskName' },
    {
      title: '任务时间',
      render (value: IIncentiveManage) {
        return <>{`${value.startTime}~${value.endTime}`}</>;
      }
    },
    {
      title: '规则说明',
      dataIndex: 'desc',
      render (value: string) {
        return <>{value || UNKNOWN}</>;
      }
    },
    { title: '任务对象', dataIndex: 'target' },
    {
      title: '任务状态',
      dataIndex: 'status',
      render (value: number) {
        return (
          <>
            <i className={classNames('status-point', { '': value })} />
            <span>{stateOptions[value]}</span>
          </>
        );
      }
    },
    {
      title: '操作',
      render (row: IIncentiveManage) {
        return (
          <>
            <Popconfirm title="确认上架该任务吗?" onConfirm={() => upTask(row.taskId)}>
              <span className={style.up}>上架</span>
            </Popconfirm>
            <span className={style.edit} onClick={() => editViewHandle(row, false)}>
              编辑
            </span>
            <span className={style.view} onClick={() => editViewHandle(row, true)}>
              查看
            </span>
          </>
        );
      }
    }
  ];
};
