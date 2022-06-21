import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { PaginationProps } from 'antd/es/pagination';
import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { NgFormSearch, NgTable } from 'src/components';
import { searchCols, tableColumnsFun, StrategyTaskProps } from './components/ModalConfig';
const StrategyTaskList: React.FC<RouteComponentProps> = ({ history }) => {
  const [tableSource] = useState<StrategyTaskProps[]>([{ id: 'ID21221ABC01' }]);
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
    <div className="container">
      <div className="search-wrap">
        <Button
          type="primary"
          shape="round"
          icon={<PlusOutlined />}
          onClick={() => history.push('/strategyTask/edit')}
          size="large"
        >
          新增策略任务模版
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
        </div>
      </div>
    </div>
  );
};

export default StrategyTaskList;
