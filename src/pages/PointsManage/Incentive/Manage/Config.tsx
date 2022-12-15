import React from 'react';
import { ColumnsType } from 'antd/es/table';
import { UNKNOWN } from 'src/utils/base';
import { IIncentiveManage } from './Manage';
import { message, Popconfirm } from 'antd';
import { requestManageIncentiveTask } from 'src/apis/pointsMall';
import style from 'src/pages/PointsManage/Incentive/Manage/style.module.less';
import classNames from 'classnames';

export const stateOptions: { [key: string]: string } = {
  0: '未上架',
  1: '已上架',
  2: '已下架',
  3: '已结束'
};

export const TableColumns: (
  editViewHandle: (row: any, isView: boolean) => void,
  upSuccess?: () => void
) => ColumnsType = (editViewHandle, upSuccess) => {
  // 上架任务
  const upTask = async (row: IIncentiveManage) => {
    if (row.status !== 0) return;
    const res = await requestManageIncentiveTask({ taskId: row.taskId, type: 1 });
    if (res) {
      message.success('该任务上架成功');
      upSuccess?.();
    }
  };

  return [
    { title: '任务名称', dataIndex: 'taskName', width: 300, ellipsis: true },
    {
      title: '任务时间',
      render (value: IIncentiveManage) {
        return <>{`${value.startTime}～${value.endTime}`}</>;
      },
      width: 330
    },
    {
      title: '规则说明',
      dataIndex: 'desc',
      render (value: string) {
        return <>{value || UNKNOWN}</>;
      },
      width: 350,
      ellipsis: true
    },
    { title: '任务对象', dataIndex: 'target' },
    {
      title: '任务状态',
      dataIndex: 'status',
      render (status: number) {
        return (
          <>
            <i
              className={classNames(
                'status-point',
                { 'status-point-gray': status === 0 },
                { 'status-point-red': status === 2 },
                { 'status-point-green': status === 3 }
              )}
            />
            <span>{stateOptions[status]}</span>
          </>
        );
      }
    },
    {
      title: '操作',
      render (row: IIncentiveManage) {
        return (
          <>
            <Popconfirm
              disabled={row.status !== 0}
              title={`确认${row.status === 0 ? '上架' : '下架'}该任务吗?`}
              onConfirm={() => upTask(row)}
            >
              <span className={classNames(style.up, { disabled: row.status !== 0 })}>
                {row.status === 0 ? '上架' : '下架'}
              </span>
            </Popconfirm>
            <span
              className={classNames(style.edit, { disabled: row.status === 2 || row.status === 3 })}
              onClick={() => {
                if ([2, 3].includes(row.status)) return;
                editViewHandle(row, false);
              }}
            >
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
