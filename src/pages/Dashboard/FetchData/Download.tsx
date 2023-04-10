import React, { useEffect, useRef, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { downloadExecSqlRecord, getExecSqlList, retryExecSqlRecord } from 'src/apis/dashboard';
import { BreadCrumbs, NgFormSearch } from 'src/components';
import NewTableComponent, { MyPaginationProps } from 'src/components/TableComponent/NewTableComponent';
import { exportFile, urlSearchParams } from 'src/utils/base';
import { OperateType } from 'src/utils/interface';
import { downloadSearchCols, downloadTableColumnFun, FetchDataRecordType } from './Config';

const FetchDataDownLoad: React.FC<RouteComponentProps> = ({ location }) => {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const fromRef = useRef<{ setFieldsValue: Function }>();
  const [formValue, setFormValue] = useState({
    name: ''
  });
  const [pagination, setPagination] = useState<MyPaginationProps>({ total: 0, pageNum: 1 });
  const getList = async (params?: any) => {
    const res = await getExecSqlList({
      ...formValue,
      pageNum: pagination.pageNum!,
      pageSize: 10,
      ...params
    });

    if (res) {
      const { list, total } = res;
      setPagination((pagination) => ({ ...pagination, pageNum: params?.pageNum || 1, total }));
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
    getList(values);
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
      <NgFormSearch searchRef={fromRef} className="mt30" onSearch={onSearch} searchCols={downloadSearchCols} />
      <NewTableComponent
        dataSource={dataSource}
        pagination={pagination}
        className="mt20"
        rowKey={'recordId'}
        columns={downloadTableColumnFun(onOperate)}
      />
    </div>
  );
};

export default FetchDataDownLoad;
