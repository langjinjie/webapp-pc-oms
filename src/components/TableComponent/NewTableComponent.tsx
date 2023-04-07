import React, { useMemo, useState } from 'react';
import classNames from 'classnames';

import { PaginationProps, Table, TableProps } from 'antd';
export interface MyPaginationProps {
  pageNum?: number;
  pageSize?: number;
  total?: number;
  simple?: boolean;
  showTotal?: (total: any) => string;
}
interface TableComponentProps<T> extends TableProps<T> {
  className?: string;
  columns: any;
  pagination?: MyPaginationProps;
  loadData?: ({ pageNum, pageSize }: { pageNum: number; pageSize: number }) => Promise<any>;
  setRowKey?: (record: any) => string;
  rowSelection?: {
    selectedRowKeys?: any[] | React.Key[];
    defaultSelectedRowKeys?: any[];
    type?: 'checkbox' | 'radio';
    onChange: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
    getCheckboxProps?: (record: T) => { disabled: boolean; name: string };
    hideSelectAll?: boolean;
    preserveSelectedRowKeys?: boolean;
  };
}

const NewTableComponent = <T extends object>(props: TableComponentProps<T>): JSX.Element => {
  const {
    className,
    columns,
    dataSource,
    setRowKey,
    rowSelection,
    onRow,
    scroll,
    loadData,
    loading: propLoading,
    pagination,
    ...otherProps
  } = props;
  const [loading, setLoading] = useState(propLoading);
  useMemo(() => {
    setLoading(propLoading);
  }, [propLoading]);

  const [myPagination, setPagination] = useState<PaginationProps>(() => {
    return {
      total: pagination?.total || 0,
      current: pagination?.pageNum || 1,
      pageSize: pagination?.pageSize || 10,
      showTotal: (total) => {
        return `共 ${total} 条记录`;
      }
    };
  });

  useMemo(() => {
    const current = pagination?.pageNum || myPagination.current;
    if (pagination) {
      setPagination((myPagination) => ({ ...myPagination, ...pagination, current }));
    }
  }, [pagination]);

  const onPaginationChange = async (page: number, pageSize: number) => {
    setLoading(true);

    setPagination((pagination) => ({ ...pagination, current: page, pageSize }));
    await loadData?.({ pageNum: page, pageSize: pageSize });
    setLoading(false);
  };
  return (
    <Table
      className={classNames('table-container', className)}
      columns={columns}
      dataSource={dataSource}
      scroll={scroll || { x: 1300 }}
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
              ...(myPagination.simple
                ? {
                    ...myPagination,
                    showQuickJumper: true,
                    showSizeChanger: true
                  }
                : myPagination),

              onChange: onPaginationChange
            }
          : false
      }
      onRow={onRow}
      {...otherProps}
    />
  );
};

export default NewTableComponent;
