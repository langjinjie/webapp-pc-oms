import { Button, Popconfirm } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { SearchCol } from 'src/components';
import style from './style.module.less';
import classNames from 'classnames';

export interface ICheckInItem {
  actCode: string; // 否 活动编号
  actId: string; // 是 活动id
  subject: string; // 是 活动名称
  status: number; // 是 活动状态，0=未上架、1=未开始、2=进行中、3=已结束、4=已下架
  startTime: string; // 是 开始时间，格式：yyyyMMdd
  endTime: string; // 是 开始时间，格式：yyyyMMdd
  createBy: string; // 是 创建人
  dateCreated: string; // 是 创建时间
  lastUpdated: string; // 是 更新时间
}

type TTableColumns = (params: {
  putOrDown: (row: ICheckInItem) => void;
  edit: (row: ICheckInItem) => void;
  copy: (row: ICheckInItem) => void;
}) => ColumnsType<ICheckInItem>;

export const statusList = [
  { id: 0, name: '未上架' },
  { id: 1, name: '未开始' },
  { id: 2, name: '进行中' },
  { id: 3, name: '已结束' },
  { id: 4, name: '已下架' }
];

export const searchCols: SearchCol[] = [
  { label: '活动编号', name: 'actCode', type: 'input', placeholder: '请输入' },
  { label: '活动名称', name: 'subject', type: 'input', placeholder: '请输入' },
  { label: '创建时间', name: 'startTime-endTime', type: 'rangePicker' },
  {
    label: '状态',
    name: 'status',
    type: 'select',
    options: statusList
  }
];

export const TableColumns: TTableColumns = ({ putOrDown, edit, copy }) => {
  return [
    { title: '活动编号', dataIndex: 'actId' },
    {
      title: '活动名称',
      dataIndex: 'subject',
      render (subject: string) {
        return <span className={classNames(style.subject, 'ellipsis inline-block')}>{subject}</span>;
      }
    },
    {
      title: '活动时间',
      render (row: ICheckInItem) {
        return <>{`${row.startTime}至${row.endTime}`}</>;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      render (status: number) {
        return <>{statusList.find(({ id }) => id === status)?.name}</>;
      }
    },
    { title: '创建时间', dataIndex: 'dateCreated' },
    { title: '操作人', dataIndex: 'createBy' },
    { title: '更新时间', dataIndex: 'lastUpdated' },
    {
      title: '操作',
      fixed: 'right',
      render (row: ICheckInItem) {
        return (
          <>
            {[0, 4].includes(row.status) && (
              // 未上架与已下架状态支持点击上架操作 未开始与进行中状态支持点击下架操作
              <Popconfirm title={'是否确定上架该活动'} onConfirm={() => putOrDown(row)}>
                <Button type="link">上架</Button>
              </Popconfirm>
            )}
            {[1, 2].includes(row.status) && (
              // 未上架与已下架状态支持点击上架操作 未开始与进行中状态支持点击下架操作
              <Popconfirm title={'是否确定下架该活动'} onConfirm={() => putOrDown(row)}>
                <Button type="link">下架</Button>
              </Popconfirm>
            )}
            <Button type="link" onClick={() => edit(row)}>
              修改
            </Button>
            <Button type="link" onClick={() => copy(row)}>
              复制
            </Button>
          </>
        );
      }
    }
  ];
};
