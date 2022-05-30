import React from 'react';
import { ColumnsType } from 'antd/lib/table';
import { message, PaginationProps } from 'antd';
import { UNKNOWN } from 'src/utils/base';
import style from './style.module.less';
import classNames from 'classnames';

const TableColumns: () => ColumnsType<any> = () => {
  // 发放奖品
  const sendWin = (row: any) => {
    if (row.status) return;
    message.success('奖品发放成功~');
  };
  return [
    { title: '客户经理姓名', dataIndex: 'staffName' },
    { title: '客户经理ID', dataIndex: 'staffId' },
    { title: '奖品名称', dataIndex: 'winName' },
    { title: '中奖时间', dataIndex: 'winTime' },
    { title: '活动名称', dataIndex: 'activityName' },
    { title: '团队长', dataIndex: 'leader' },
    { title: '收货地址', dataIndex: 'address' },
    { title: '地址纠错', dataIndex: 'addressCorrection' },
    {
      title: '奖品发放状态',
      dataIndex: 'winStatus',
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
    { title: '操作人', dataIndex: 'operation' },
    {
      title: '操作',
      render (row: any) {
        return (
          <span onClick={() => sendWin(row)} className={style.sendWin}>
            {row.status ? '/' : '发放奖品'}
          </span>
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
