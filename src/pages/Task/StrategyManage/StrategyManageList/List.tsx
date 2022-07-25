import React, { useEffect, useState } from 'react';
import { Button, ConfigProvider, Empty } from 'antd';
import { PaginationProps } from 'antd/es/pagination';
import { RouteComponentProps } from 'react-router-dom';
import { NgFormSearch, NgTable } from 'src/components';
import { searchCols, tableColumnsFun, StrategyTaskProps } from './Config';
import { getTaskListOfCorp } from 'src/apis/task';
type QueryParamsType = Partial<{
  nodeCode: string;
  nodeName: string;
  nodeTypeCode: string;
}>;
const StrategyManageList: React.FC<RouteComponentProps> = ({ history }) => {
  const [tableSource, setTableSource] = useState<StrategyTaskProps[]>([]);
  const [queryParams, setQueryParams] = useState<QueryParamsType>();
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });

  const getList = async (params?: any) => {
    const pageNum = params?.pageNum || pagination.current;
    const pageSize = params?.pageSize || pagination.pageSize;
    const res = await getTaskListOfCorp({ ...queryParams, ...params, pageNum, pageSize });
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
    getList({ ...values, pageNum: 1 });
    setQueryParams(values);
  };
  const onValuesChange = (changeValues: any, values: any) => {
    console.log({ changeValues, values });
  };

  const paginationChange = () => {
    console.log();
  };
  return (
    <div>
      <div className="container">
        <div className="search-wrap">
          <Button
            type="primary"
            shape="round"
            ghost
            onClick={() => history.push('/strategyManage/tmpList')}
            size="large"
          >
            策略模板库
          </Button>
          <div className={'pt20'}>
            <NgFormSearch
              isInline
              firstRowChildCount={3}
              searchCols={searchCols}
              onSearch={onSearch}
              onValuesChange={onValuesChange}
            />
          </div>

          <div className="mt20">
            <ConfigProvider
              renderEmpty={() => (
                <Empty
                  imageStyle={{
                    height: 60
                  }}
                  description={<span>暂无数据，去策略模板库启用数据</span>}
                ></Empty>
              )}
            >
              <NgTable
                columns={tableColumnsFun({
                  onOperate: () => {
                    console.log('');
                  }
                })}
                dataSource={tableSource}
                pagination={pagination}
                paginationChange={paginationChange}
                setRowKey={(record: StrategyTaskProps) => {
                  return record.corpTplId;
                }}
              />
            </ConfigProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyManageList;
