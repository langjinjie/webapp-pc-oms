import React, { useEffect, useRef, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { downloadExecSqlRecord, getExecSqlList, retryExecSqlRecord } from 'src/apis/dashboard';
import { AuthBtn, BreadCrumbs, NgFormSearch, NgTable } from 'src/components';
import { MyPaginationProps } from 'src/components/TableComponent/TableComponent';
import { exportFile, urlSearchParams } from 'src/utils/base';
import { OperateType } from 'src/utils/interface';
import { downloadSearchCols, downloadTableColumnFun, FetchDataRecordType } from './Config';

const FetchDataDownLoad: React.FC<RouteComponentProps> = ({ location }) => {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const fromRef = useRef<{ setFieldsValue: Function }>();
  const [formValue, setFormValue] = useState({
    name: ''
  });
  const [pagination, setPagination] = useState<MyPaginationProps>({ total: 0, pageNum: 1, pageSize: 10 });
  const getList = async (params?: any) => {
    const pageSize = params?.pageSize || pagination.pageSize;
    const res = await getExecSqlList({
      ...formValue,
      pageNum: pagination.pageNum!,
      pageSize,
      ...params
    });

    if (res) {
      const { list, total } = res;
      setPagination((pagination) => ({ ...pagination, pageNum: params?.pageNum || 1, total, pageSize }));
      setDataSource(list || []);
    }
  };

  useEffect(() => {
    const { tmp: name } = urlSearchParams<{ tmp: string }>(location.search);
    if (name) {
      setFormValue({ name });
      fromRef.current?.setFieldsValue({ name });
    }
    getList({ name });
  }, []);

  const onSearch = (values: any) => {
    setFormValue(values);
    getList({ ...values, pageNum: 1 });
  };

  const onOperate = async (type: OperateType, record: FetchDataRecordType) => {
    if (type === 'other') {
      const res = await retryExecSqlRecord({ recordId: record.recordId });
      if (res) {
        getList({ pageNum: 1 });
      }
    } else {
      const { data } = await downloadExecSqlRecord({ recordId: record.recordId });

      exportFile(data, record.name, '.csv');
    }
  };

  return (
    <div className="container">
      <BreadCrumbs navList={[{ name: '通用取数', path: '/fetchData' }, { name: '下载' }]} />
      <AuthBtn path="/download/query">
        <NgFormSearch searchRef={fromRef} className="mt30" onSearch={onSearch} searchCols={downloadSearchCols} />
      </AuthBtn>
      <NgTable
        dataSource={dataSource}
        pagination={pagination}
        loadData={getList}
        className="mt20"
        rowKey={'recordId'}
        columns={downloadTableColumnFun(onOperate)}
      />
    </div>
  );
};

export default FetchDataDownLoad;
