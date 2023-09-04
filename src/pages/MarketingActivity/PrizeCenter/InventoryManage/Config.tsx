import React from 'react';
import { Button, Popconfirm } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { SearchCol } from 'src/components';
import classNames from 'classnames';

export interface IStockRow {
  couponNumber: string; // 券码
  assignStatus: string; // 否 分发状态：0-未分发；1-已分发
  dateCreated: string; // 是 创建时间yyyy-mm-dd hh:mm:ss
  lastUpdated: string; // 是 更新时间yyyy-mm-dd hh:mm:ss
  updateBy: string; // 是 更新人
}

const sendStatus = [
  { id: 0, name: '未发放' },
  { id: 1, name: '已发放' }
];

export const searchCols: SearchCol[] = [
  { name: 'couponNumber', label: '兑换码', type: 'input' },
  {
    name: 'assignStatus',
    label: '发放状态',
    type: 'select',
    options: sendStatus
  }
];

export const TableColumns: (args: { del: (row: IStockRow) => void }) => ColumnsType<IStockRow> = ({ del }) => {
  return [
    { title: '兑换码', dataIndex: 'couponNumber' },
    {
      title: '状态',
      dataIndex: 'assignStatus',
      render (assignStatus: number) {
        return (
          <>
            <i className={classNames('status-point', { 'status-point-gray': assignStatus === 0 })} />
            {sendStatus.find((findItem) => findItem.id === assignStatus)?.name}
          </>
        );
      }
    },
    {
      title: '操作',
      render (row: IStockRow) {
        return (
          <Popconfirm title="是否确定删除" onConfirm={() => del(row)}>
            <Button type="link">删除</Button>
          </Popconfirm>
        );
      }
    }
  ];
};
