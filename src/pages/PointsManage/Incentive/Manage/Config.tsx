import React from 'react';
import { ColumnsType } from 'antd/es/table';
import { UNKNOWN } from 'src/utils/base';
import { IIncentiveManage } from './Manage';
import style from 'src/pages/PointsManage/Incentive/Manage/style.module.less';
import classNames from 'classnames';

export const stateOptions: { [key: string]: string } = {
  0: '未上架',
  1: '已上架',
  2: '已结束'
};

export const TableColumns: (editViewHandle: (row: any, isView: boolean) => void) => ColumnsType = (editViewHandle) => {
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
      render (row: any) {
        return (
          <>
            <span className={style.up}>上架</span>
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
