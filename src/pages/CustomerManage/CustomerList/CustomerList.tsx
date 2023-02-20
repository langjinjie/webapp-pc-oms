import { PaginationProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { NgFormSearch, NgTable } from 'src/components';
import { searchCols, TableColumnsFun } from './Config';

const CustomerList: React.FC = () => {
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 100,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });

  const [dataSource, setDataSource] = useState([
    {
      key1: '冯媛媛',
      key2: '马雪琴',
      url: require('src/assets/images/avater.jpg'),
      key3: '测试1组',
      key4: '微信',
      key5: [],
      key6: '2022-10-23 21:21:03'
    },
    {
      key1: '张明明',
      key2: '马雪琴',
      url: require('src/assets/images/avater.jpg'),
      key3: '测试1组',
      key4: '活动投放',
      key5: [],
      key6: '2022-11-23 09:21:45'
    }
  ]);
  useEffect(() => {
    setDataSource(dataSource);
  }, []);

  const onSearch = (values: any) => {
    console.log(values);
  };

  const onPaginationChange = (pageNum: number, pageSize?: number) => {
    setPagination((pagination) => ({ ...pagination, current: pageNum, pageSize }));
  };

  return (
    <div className="container">
      <NgFormSearch searchCols={searchCols} onSearch={onSearch}></NgFormSearch>
      <NgTable
        setRowKey={(record: any) => record.key1}
        dataSource={dataSource}
        columns={TableColumnsFun()}
        pagination={pagination}
        paginationChange={onPaginationChange}
      />
    </div>
  );
};

export default CustomerList;
