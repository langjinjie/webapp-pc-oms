import React from 'react';
import classNames from 'classnames';

import { Table, TablePaginationConfig, TableProps } from 'antd';
export interface PaginationProps {
  current: number;
  pageSize: number;
  total: number;
  showTotal: (total: any) => string;
}
interface TableComponentProps<T> extends TableProps<T> {
  className?: string;
  loading?: boolean;
  columns: any;
  pagination?: TablePaginationConfig;
  paginationChange?: (pageNum: number, pageSize?: number) => void;
  setRowKey?: (record: any) => string;
  rowSelection?: {
    onChange: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
    getCheckboxProps: (record: T) => { disabled: boolean; name: string };
    hideSelectAll: boolean;
  };
}

const TableComponent = <T extends object>(props: TableComponentProps<T>): JSX.Element => {
  const { className, paginationChange, pagination, setRowKey, rowSelection, scroll, ...otherPorps } = props;
  return (
    <Table
      className={classNames('table-container', className)}
      scroll={scroll || { x: 1300 }}
      rowKey={setRowKey}
      rowSelection={
        rowSelection
          ? {
              type: 'checkbox',
              ...rowSelection
            }
          : undefined
      }
      pagination={
        pagination
          ? {
              ...pagination,
              showQuickJumper: true,
              showSizeChanger: true,
              onChange: paginationChange
            }
          : false
      }
      {...otherPorps}
    />
  );
};

export default TableComponent;
