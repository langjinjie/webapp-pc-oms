import { PaginationProps } from 'antd/es/pagination';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { getApplyList } from 'src/apis/knowledge';
import { AuthBtn, NgFormSearch, NgTable } from 'src/components';
import { searchColsFun, tableColumnsFun, WikiColumn } from '../Apply/config';

const KnowledgeApprovalList: React.FC<RouteComponentProps> = ({ history }) => {
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });
  const [dataSource, setDataSource] = useState<WikiColumn[]>([]);
  const [queryParams, setQueryParams] = useState<any>({});
  const getList = async (params?: any) => {
    const pageNum = params?.pageNum || pagination.current;
    const pageSize = params?.pageSize || pagination.pageSize;
    const res = await getApplyList({
      ...queryParams,
      ...params,
      pageNum,
      pageSize
    });
    if (res) {
      const { total, list } = res;
      setDataSource(list);
      setPagination((pagination) => ({ ...pagination, total, current: pageNum, pageSize }));
    }
  };
  const onSearch = (values: any) => {
    setQueryParams({ values });
    getList({ ...values, pageNum: 1 });
  };

  const onValuesChange = (values: any) => {
    setQueryParams({ values });
  };

  useEffect(() => {
    getList();
  }, []);

  const onOperation = (record: WikiColumn) => {
    // 执行上架操作
    history.push('/knowledge/apply/detail?id=' + record.approvalNo + '&isApproval=1');
  };

  return (
    <div className="container">
      <AuthBtn path="/query">
        <NgFormSearch
          searchCols={searchColsFun()}
          isInline={false}
          firstRowChildCount={3}
          onValuesChange={(_, values) => onValuesChange(values)}
          onSearch={onSearch}
        />
      </AuthBtn>

      <NgTable
        rowKey={'wikiId'}
        columns={tableColumnsFun(onOperation)}
        dataSource={dataSource}
        pagination={pagination}
        paginationChange={(pageNum, pageSize) => {
          getList({ pageNum, pageSize });
        }}
      ></NgTable>
    </div>
  );
};

export default KnowledgeApprovalList;
