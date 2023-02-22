import React, { useEffect, useState } from 'react';
import { PaginationProps } from 'antd';
import { NgFormSearch, NgTable } from 'src/components';
import { searchCols, TableColumnsFun, IList } from './Config';
import { requestGetClientList } from 'src/apis/customerManage';

const CustomerList: React.FC = () => {
  const [list, setList] = useState<IList[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // 获取列表
  const getList = async (values?: any) => {
    setTableLoading(true);
    const res = await requestGetClientList({ ...values });
    if (res) {
      setList(res.list);
      setPagination((pagination) => ({ ...pagination, total: res.total }));
    }
    setTableLoading(false);
  };

  const onSearch = (values: any) => {
    console.log(values);
    setFormValues({});
  };

  const onPaginationChange = (pageNum: number, pageSize?: number) => {
    setPagination((pagination) => ({ ...pagination, current: pageNum, pageSize }));
    getList({ pageNum, pageSize, ...formValues });
  };

  useEffect(() => {
    getList();
  }, []);
  return (
    <div className="container">
      <NgFormSearch searchCols={searchCols} onSearch={onSearch}></NgFormSearch>
      <NgTable
        setRowKey={(record: any) => record.key1}
        dataSource={list}
        loading={tableLoading}
        columns={TableColumnsFun()}
        pagination={pagination}
        paginationChange={onPaginationChange}
      />
    </div>
  );
};

export default CustomerList;
