import React from 'react';
import { ColumnsType } from 'antd/es/table';

const TableColumns = (): ColumnsType<any> => {
  return [
    {
      title: '序号',
      fixed: 'left',
      dataIndex: 'index'
    },
    { title: '客户经理ID', dataIndex: 'staffName' },
    {
      title: '日期',
      // width: 100,
      render (row: any) {
        return <span>{row.status ? '已群发' : '未群发'}</span>;
      }
    }
  ];
};

const TablePagination = (arg: { [key: string]: any }): any => {
  const { dataSource, paginationParam, setPaginationParam } = arg;
  // 分页器参数
  const pagination = {
    simple: true,
    total: dataSource.total,
    current: paginationParam.pageNum,
    position: ['bottomCenter']
  };
  // 切换分页
  const paginationChange = (value: number, pageSize?: number) => {
    setPaginationParam({ pageNum: value, pageSize: pageSize as number });
  };
  return { pagination, paginationChange };
};
export { TableColumns, TablePagination };
