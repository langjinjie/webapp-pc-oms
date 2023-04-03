import { PaginationProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { BreadCrumbs, NgFormSearch, NgTable } from 'src/components';
import { searchCols, tableColumnsFun, IPackageDownLoadRow } from './Config';
import { requestGetPackageDownloadList } from 'src/apis/CrowdsPackage';
import { formatDate } from 'src/utils/base';

const DownloadList: React.FC<RouteComponentProps> = () => {
  const [list, setList] = useState<IPackageDownLoadRow[]>([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [formParam, setFormParam] = useState<{ [key: string]: any }>({});
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0
  });
  // 获取列表
  const getList = async (values?: any) => {
    setTableLoading(true);
    const res = await requestGetPackageDownloadList({ ...values });
    if (res) {
      setList(res.list);
      // setRecordItem(undefined);
      setPagination((pagination) => ({ ...pagination, total: res.total }));
    }
    setTableLoading(false);
  };

  const onFinishHandle = (values?: any) => {
    const { updateTime, runTime } = values;
    // 生成时间
    const [runTimeBegin, runTimeEnd] = formatDate(runTime);
    // 更新时间
    const [updateTimeBegin, updateTimeEnd] = formatDate(updateTime);
    delete values.runTime;
    delete values.updateTime;
    const param = {
      ...values,
      runTimeBegin,
      runTimeEnd,
      updateTimeBegin,
      updateTimeEnd
    };
    getList(param);
    setPagination((pagination) => ({ ...pagination, current: 1 }));
    setFormParam(param);
  };
  // 切换分页
  const paginationChange = (current: number, pageSize?: number) => {
    const pageNum = pageSize !== pagination.pageSize ? 1 : current;
    setPagination((pagination) => ({ ...pagination, current: pageNum, pageSize: pageSize as number }));
    getList({ ...formParam, pageNum, pageSize: pageSize as number });
  };
  // 重置
  const onResetHandle = async () => {
    getList();
    setPagination((pagination) => ({ ...pagination, current: 1, pageSize: 10 }));
    setFormParam({});
  };
  useEffect(() => {
    getList();
  }, []);

  return (
    <div className="container">
      <BreadCrumbs />
      <NgFormSearch
        className="mt20"
        isInline={false}
        firstRowChildCount={4}
        searchCols={searchCols}
        onSearch={onFinishHandle}
        onReset={onResetHandle}
      />

      <NgTable
        className="mt20"
        rowKey="dlId"
        loading={tableLoading}
        columns={tableColumnsFun()}
        dataSource={list}
        paginationChange={paginationChange}
        pagination={pagination}
      />
    </div>
  );
};

export default DownloadList;
