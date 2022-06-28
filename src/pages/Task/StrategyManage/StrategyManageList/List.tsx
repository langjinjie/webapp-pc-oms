import React, { useState } from 'react';
import { Button, ConfigProvider, Empty } from 'antd';
import { PaginationProps } from 'antd/es/pagination';
import { RouteComponentProps } from 'react-router-dom';
import { NgFormSearch, NgTable } from 'src/components';
import { searchCols, tableColumnsFun, StrategyTaskProps } from './Config';

const StrategyManageList: React.FC<RouteComponentProps> = ({ history }) => {
  const [tableSource] = useState<StrategyTaskProps[]>([]);
  const [pagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });
  const onSearch = (values: any) => {
    console.log(values);
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
                setRowKey={(record: any) => {
                  return record.id;
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
