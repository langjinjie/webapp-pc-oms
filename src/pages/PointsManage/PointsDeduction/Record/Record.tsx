import React, { useState, useEffect } from 'react';
import { useDocumentTitle } from 'src/utils/base';
import { Breadcrumb, PaginationProps } from 'antd';
import { NgFormSearch, NgTable } from 'src/components';
import { searchCols, StaffProps, tableColumns } from './Config';
import { getWaitDeductPointsList } from 'src/apis/integral';
import { RouteComponentProps } from 'react-router-dom';

import styles from './style.module.less';

const PointsDeduction: React.FC<RouteComponentProps> = ({ history }) => {
  useDocumentTitle('积分管理-积分扣减');
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState<StaffProps[]>([]);
  const [formParams, setFormParams] = useState<{
    staffName: string;
    type: number;
    beginTime: null | string;
    endTime: null | string;
  }>({
    type: 2,
    staffName: '',
    beginTime: null,
    endTime: null
  });
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });

  const getList = async (params?: any) => {
    setIsLoading(true);
    const res = await getWaitDeductPointsList({
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

  const handleSearch = (values: any) => {
    setFormParams((formParams) => ({ ...formParams, ...values }));
    setPagination((pagination) => ({ ...pagination, current: 1 }));
    getList({ pageNum: 1, ...values });
  };

  useEffect(() => {
    getList();
  }, []);

  const onPaginationChange = (pageNum: number, pageSize?: number) => {
    setPagination((pagination) => ({ ...pagination, current: pageNum, pageSize }));
    getList({ pageNum, pageSize });
  };

  const navigatorToList = () => {
    history.replace('/pointsDeduction');
  };

  return (
    <div className="container">
      <div className={styles.breadcrumbWrap}>
        <span>当前位置：</span>
        <Breadcrumb>
          <Breadcrumb.Item className="pointer" onClick={navigatorToList}>
            积分扣减
          </Breadcrumb.Item>
          <Breadcrumb.Item>积分扣减记录</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="header flex justify-between">
        <NgFormSearch searchCols={searchCols} onSearch={handleSearch} />
      </div>
      <div className="pt20">
        <NgTable
          columns={tableColumns()}
          loading={isLoading}
          pagination={pagination}
          dataSource={dataSource}
          paginationChange={onPaginationChange}
          setRowKey={(record: StaffProps) => {
            return record.deductId;
          }}
        />
      </div>
    </div>
  );
};
export default PointsDeduction;
