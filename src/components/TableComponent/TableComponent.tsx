import React from 'react';

import { Table, TablePaginationConfig, TableProps } from 'antd';
export interface PaginationProps {
  current: number;
  pageSize: number;
  total: number;
  showTotal: (total: any) => string;
}
interface TableComponentProps<T> extends TableProps<T> {
  loading: boolean;
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
  const { columns, dataSource, paginationChange, pagination, loading, setRowKey, rowSelection } = props;
  return (
    <Table
      className="table-container"
      columns={columns}
      dataSource={dataSource}
      scroll={{ x: 1300 }}
      rowKey={setRowKey}
      loading={loading}
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
    />
  );
};

export default TableComponent;
