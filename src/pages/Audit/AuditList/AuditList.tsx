/**
 * @desc 审核列表
 */
import { PaginationProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { getAuditList } from 'src/apis/audit';
import { AuthBtn, NgFormSearch, NgTable } from 'src/components';
import { OperateType } from 'src/utils/interface';
import { AuditColumnsProp, searchCols, TableColsFun } from './AuditListConfig';

const AuditList: React.FC<RouteComponentProps> = ({ history }) => {
  const [dataSource, setDataSource] = useState<AuditColumnsProp[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });

  const [formValues, setFormValues] = useState({
    applyList: [],
    curHandlerList: [],
    applyType: '',
    approvalNo: '',
    status: ''
  });

  const onOperate = (type: OperateType, record: any) => {
    if (type === 'view') {
      history.push('/audit/list/detail?applyId=' + record.applyId + '&isApply=2');
    }
  };
  const getList = async (params?: any) => {
    const pageNum = params?.pageNum || pagination.current;
    const pageSize = params?.pageSize || pagination.pageSize;
    setLoading(true);
    const res = await getAuditList({
      ...formValues,
      ...params,
      pageNum,
      pageSize
    });
    setLoading(false);
    if (res) {
      const { list, total } = res;
      setDataSource(list);
      setPagination((pagination) => ({ ...pagination, total, current: pageNum, pageSize }));
    }
  };

  const onSearch = (values: any) => {
    const { applyList, applyType, curHandlerList, approvalNo, status } = values;

    const params = {
      applyList: applyList?.map((item: any) => ({ userid: item.userId })),
      curHandlerList: curHandlerList?.map((item: any) => ({ userid: item.userId })),
      applyType,
      approvalNo,
      status
    };
    setFormValues(params);
    getList({ ...params, pageNum: 1 });
  };

  useEffect(() => {
    getList();
  }, []);

  const onPaginationChange = (pageNum: number, pageSize?: number) => {
    getList({
      pageNum,
      pageSize
    });
  };
  return (
    <div className="container">
      <div>
        <AuthBtn path="/query">
          <NgFormSearch isInline={false} firstRowChildCount={3} searchCols={searchCols} onSearch={onSearch} />
        </AuthBtn>
      </div>
      <div className="mt15">
        <p className="color-danger">备注：如上级审批不通过后。需要重新发起申请，不可在原来的申请表进行修改</p>
        <NgTable
          loading={loading}
          pagination={pagination}
          columns={TableColsFun(onOperate)}
          dataSource={dataSource}
          rowKey={'applyId'}
          paginationChange={onPaginationChange}
        ></NgTable>
      </div>
    </div>
  );
};

export default AuditList;
