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
    selectedRowKeys?: any[];
    defaultSelectedRowKeys?: any[];
    type?: 'checkbox' | 'radio';
    onChange: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
    getCheckboxProps?: (record: T) => { disabled: boolean; name: string };
    hideSelectAll?: boolean;
    preserveSelectedRowKeys?: boolean;
  };
}

const TableComponent = <T extends object>(props: TableComponentProps<T>): JSX.Element => {
  const {
    className,
    columns,
    dataSource,
    paginationChange,
    pagination,
    loading,
    setRowKey,
    rowSelection,
    onRow,
    scroll,
    tableLayout,
    ...otherProps
  } = props;
  return (
    <Table
      className={classNames('table-container', className)}
      columns={columns}
      dataSource={dataSource}
      scroll={scroll || { x: 1300 }}
      rowKey={setRowKey}
      loading={loading}
      tableLayout={tableLayout}
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
      onRow={onRow}
      {...otherProps}
    />
  );
};

export default TableComponent;
