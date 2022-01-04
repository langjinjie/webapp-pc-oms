import React, { useState, useEffect } from 'react';
import { useDocumentTitle } from 'src/utils/base';
import { PaginationProps } from 'antd';
import { Icon, NgFormSearch, NgTable } from 'src/components';
import { searchCols, StaffProps, tableColumns } from './Config';
import { getFreeStaffList } from 'src/apis/orgManage';
import { RouteComponentProps } from 'react-router-dom';

const PointsDeduction: React.FC<RouteComponentProps> = ({ history }) => {
  useDocumentTitle('积分商城-积分扣减');
  const [selectedRowKeys, setSelectRowKeys] = useState<React.Key[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState<StaffProps[]>([]);
  const [formParams, setFormParams] = useState({
    name: ''
  });
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });

  const getList = async (params?: any) => {
    setSelectRowKeys([]);
    setIsLoading(true);
    const res = await getFreeStaffList({
      ...formParams,
      pageSize: 10,
      pageNum: 1,
      ...params
    });
    setIsLoading(false);
    if (res) {
      const { list, total } = res;
      setPagination((pagination) => ({ ...pagination, total }));
      setDataSource(list || []);
    }
  };

  const handleSearch = ({ name = '' }: { name: string }) => {
    setFormParams({ name });
    getList({ pageNum: 1, name });
  };

  const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: StaffProps[]) => {
    setSelectRowKeys(selectedRowKeys);
    console.log(selectedRows);
  };
  // 表格RowSelection配置项
  const rowSelection = {
    hideSelectAll: false,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: StaffProps[]) => {
      onSelectChange(selectedRowKeys, selectedRows);
    },
    getCheckboxProps: (record: StaffProps) => {
      return {
        disabled: false,
        name: record.name
      };
    }
  };

  useEffect(() => {
    getList();
  }, []);

  const onPaginationChange = (pageNum: number, pageSize?: number) => {
    setPagination((pagination) => ({ ...pagination, current: pageNum, pageSize }));
    getList({ pageNum, pageSize });
  };

  const navigateToRecord = () => {
    history.push('/pointsDeduction/record');
  };

  return (
    <div className="container">
      <div className="header flex justify-between">
        <NgFormSearch searchCols={searchCols} onSearch={handleSearch} />
        <div className="flex fixed" onClick={navigateToRecord}>
          <Icon name="" />
          <span>积分扣减记录</span>
        </div>
      </div>
      <div className="pt20">
        <NgTable
          columns={tableColumns()}
          loading={isLoading}
          rowSelection={rowSelection}
          pagination={pagination}
          dataSource={dataSource}
          paginationChange={onPaginationChange}
          setRowKey={(record: StaffProps) => {
            return record.staffId;
          }}
        />
      </div>
    </div>
  );
};
export default PointsDeduction;
