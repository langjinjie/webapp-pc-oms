import React, { useEffect, useState } from 'react';
import { actionSearchCols, actionTableColumnsFun, RuleColumns } from './ListConfig';
import { useHistory } from 'react-router-dom';
import { NgFormSearch, NgTable } from 'src/components';
import { PaginationProps } from 'antd/es/pagination';
import { getActionRuleList } from 'src/apis/task';

type QueryParamsType = {};
export const ActionList: React.FC = () => {
  const history = useHistory();
  const [queryParams, setQueryParams] = useState<QueryParamsType>();
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });
  const [tableSource, setTableSource] = useState<Partial<RuleColumns>[]>([]);

  // 获取列表数据
  const getList = async (params?: any) => {
    const pageNum = params?.pageNum || pagination.current;
    const pageSize = params?.pageSize || pagination.pageSize;
    const res = await getActionRuleList({ ...queryParams, ...params, pageNum, pageSize });
    if (res) {
      const { list, total } = res;
      setTableSource(list || []);
      setPagination((pagination) => ({ ...pagination, total, current: pageNum, pageSize }));
    }
  };

  useEffect(() => {
    getList();
  }, []);

  const onSearch = (values: any) => {
    setQueryParams(values);
    getList({ ...values, pageNum: 1 });
  };
  const onValuesChange = (changeValues: any, values: any) => {
    setQueryParams(values);
  };

  const paginationChange = (pageNum: number, pageSize: number) => {
    getList({ pageNum, pageSize });
  };

  const jumpToDetail = () => {
    history.push('/taskScene/detail');
  };
  return (
    <div className="search-wrap">
      <div className={'pt20'}>
        <NgFormSearch isInline searchCols={actionSearchCols} onSearch={onSearch} onValuesChange={onValuesChange} />
      </div>
      <div className="mt20">
        <NgTable
          columns={actionTableColumnsFun({
            onOperate: () => jumpToDetail()
          })}
          dataSource={tableSource}
          pagination={pagination}
          paginationChange={paginationChange}
          setRowKey={(record: RuleColumns) => {
            return record.nodeRuleId;
          }}
        />
      </div>
    </div>
  );
};
