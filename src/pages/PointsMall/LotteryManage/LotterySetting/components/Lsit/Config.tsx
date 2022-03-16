import React from 'react';
import { ColumnsType } from 'antd/es/table';
// import { IPointsProvideList } from 'src/utils/interface';

const TableColumns = (): ColumnsType<any> => {
  return [
    {
      title: '抽奖可见名单',
      dataIndex: 'scopeDeptNames',
      ellipsis: true,
      render (text: string) {
        return <>{text.replace(/;/g, '，') || '无'}</>;
      }
    },
    { title: '操作时间', dataIndex: 'opTime' },
    {
      title: '操作人',
      dataIndex: 'opName'
    }
  ];
};

const TablePagination = (arg: { [key: string]: any }): any => {
  const { dataSource, paginationParam, setPaginationParam } = arg;
  // 分页器参数
  const pagination = {
    total: dataSource.total,
    current: paginationParam.pageNum,
    pageSize: paginationParam.pageSize,
    showTotal: (total: number) => `共 ${total} 条`
  };
  // 切换分页
  const paginationChange = (value: number, pageSize?: number) => {
    setPaginationParam({ pageNum: value, pageSize: pageSize as number });
  };
  return { pagination, paginationChange, hideOnSinglePage: true };
};
export { TableColumns, TablePagination };
