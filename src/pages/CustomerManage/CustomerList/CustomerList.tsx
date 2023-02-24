import React, { useEffect, useState } from 'react';
import { PaginationProps } from 'antd';
import { AuthBtn, NgFormSearch, NgTable } from 'src/components';
import { searchCols, TableColumnsFun, IList, orgDeptType2Name } from './Config';
import { requestGetClientList } from 'src/apis/customerManage';

const CustomerList: React.FC = () => {
  const [list, setList] = useState<IList[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
  const [resultId, setResultId] = useState('');
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
      const { pageNum } = values || {};
      if (!pageNum || pageNum === 1) {
        setResultId(res.resultId);
      }
      setPagination((pagination) => ({ ...pagination, total: res.total }));
    }
    setTableLoading(false);
  };

  const onSearch = (values: any) => {
    const { clientName, staffList: staffs, filterTag, beginTime: addBeginTime, endTime: addEndTime } = values;
    let orgDept: { [key: string]: string } | undefined;
    if ((values?.orgDept || []).length) {
      orgDept = {};
      for (const key in orgDeptType2Name) {
        orgDept[key] = (values?.orgDept || [])
          .filter((deptItem: { dType: number; deptId: number }) => deptItem.dType === orgDeptType2Name[key])
          .map(({ deptId }: { deptId: number }) => deptId)
          .toString();
      }
    }
    const staffList = staffs?.map(({ staffId }: { staffId: string }) => ({ staffId }));
    getList({
      clientName,
      staffList,
      filterTag,
      addBeginTime,
      addEndTime,
      orgDept,
      pageNum: 1
    });
    setFormValues({ clientName, staffList, filterTag, addBeginTime, addEndTime, orgDept });
    setPagination((pagination) => ({ ...pagination, pageSize: 10, current: 1 }));
  };

  const onPaginationChange = (pageNum: number, pageSize?: number) => {
    const newPageNum = pageSize !== pagination.pageSize ? 1 : pageNum;
    setPagination((pagination) => ({
      ...pagination,
      current: newPageNum,
      pageSize: pageSize as number
    }));
    getList({ ...formValues, pageNum: newPageNum, pageSize: pageSize as number, resultId });
  };

  useEffect(() => {
    getList();
  }, []);
  return (
    <div className="container">
      <AuthBtn path="/query">
        <NgFormSearch searchCols={searchCols} onSearch={onSearch} />
      </AuthBtn>
      <div className="color-text-regular mb10 mt10">
        筛选：共计好友<span className="text-primary">{pagination.total}</span>人
      </div>
      <NgTable
        rowKey={'detailId'}
        dataSource={list}
        loading={tableLoading}
        scroll={{ x: 'max-content' }}
        columns={TableColumnsFun()}
        pagination={pagination}
        paginationChange={onPaginationChange}
      />
    </div>
  );
};

export default CustomerList;
