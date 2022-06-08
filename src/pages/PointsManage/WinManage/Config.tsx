import React from 'react';
import { ColumnsType } from 'antd/lib/table';
import { PaginationProps } from 'antd';
import { UNKNOWN } from 'src/utils/base';
import { AuthBtn } from 'src/components';
import style from './style.module.less';
import classNames from 'classnames';

const TableColumns: (onChange?: (param?: any) => any, onOk?: (param?: any) => any) => ColumnsType<any> = (
  onChange,
  onOk
) => {
  // 发放奖品
  const sendWin = (row: any) => {
    const { winId, name, deliverAddress, correctAddress, goodsType } = row;
    if (row.sendStatus) return;
    if ([1, 4].includes(row.goodsType)) {
      // 1: 大奖 4：物流类商品
      onChange?.({ winId, name, deliverAddress: correctAddress || deliverAddress, goodsType });
    } else {
      onOk?.({ winId, name });
    }
  };
  return [
    { title: '客户经理姓名', dataIndex: 'staffName' },
    { title: '客户经理ID', dataIndex: 'staffId' },
    { title: '奖品名称', dataIndex: 'name' },
    { title: '中奖时间', dataIndex: 'winTime' },
    { title: '活动名称', dataIndex: 'activityName' },
    { title: '团队长', dataIndex: 'leaderName' },
    { title: '收货地址', dataIndex: 'deliverAddress' },
    { title: '地址纠错', dataIndex: 'correctAddress' },
    {
      title: '奖品发放状态',
      dataIndex: 'sendStatus',
      render (text: number) {
        return <span className={classNames(style.status, { [style.sended]: text })}>{text ? '已发放' : '未发放'}</span>;
      }
    },
    {
      title: '奖品发放时间',
      dataIndex: 'sendTime',
      render (text: string) {
        return <>{text || UNKNOWN}</>;
      }
    },
    { title: '操作人', dataIndex: 'opName' },
    {
      title: '操作',
      fixed: 'right',
      render (row: any) {
        return (
          <AuthBtn path="/send">
            <span
              onClick={() => sendWin(row)}
              className={classNames(style.sendWin, { [style.sended]: row.sendStatus })}
            >
              {row.sendStatus ? '/' : '发放奖品'}
            </span>
          </AuthBtn>
        );
      }
    }
  ];
};

const TableConfig = (arg: { [key: string]: any }): any => {
  const { total, paginationParam, setPaginationParam } = arg;
  const pagination: PaginationProps = {
    total,
    current: paginationParam.pageNum,
    pageSize: paginationParam.pageSize
  };
  const paginationChange = (pageNum: number, pageSize?: number) => {
    setPaginationParam({ pageNum, pageSize: pageSize });
  };
  const rowSelection = {};
  return { pagination, paginationChange, rowSelection };
};

export { TableColumns, TableConfig };
