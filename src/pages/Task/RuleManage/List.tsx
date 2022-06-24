import React, { useState } from 'react';
import { Button, Tabs } from 'antd';
import { ruleTypeOptions, searchCols, tableColumnsFun, RuleColumns } from './ListConfig';
import { PlusOutlined } from '@ant-design/icons';
import { RouteComponentProps } from 'react-router-dom';
import { NgFormSearch, NgTable } from 'src/components';
import { PaginationProps } from 'antd/es/pagination';

const RuleManageList: React.FC<RouteComponentProps> = ({ history }) => {
  const [currentTab, setCurrentTab] = useState('1');
  const [tableSource] = useState<Partial<RuleColumns>[]>([
    {
      nodeRuleId: '1212121'
    }
  ]);
  const [pagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });
  const onTapsChange = (current: string) => {
    setCurrentTab(current);
  };

  const onSearch = (values: any) => {
    console.log(values);
  };
  const onValuesChange = (changeValues: any, values: any) => {
    console.log({ changeValues, values });
  };

  const paginationChange = () => {
    console.log();
  };

  const jumpToDetail = () => {
    history.push('/taskScene/detail');
  };
  return (
    <div className="container">
      <Tabs onChange={onTapsChange} defaultActiveKey={currentTab}>
        {ruleTypeOptions.map((option) => (
          <Tabs.TabPane tab={option.title} key={option.value} />
        ))}
      </Tabs>

      <div className="search-wrap">
        <Button
          type="primary"
          shape="round"
          icon={<PlusOutlined />}
          onClick={() => history.push('/strategyTask/edit')}
          size="large"
        >
          新建节点规则
        </Button>
        <div className={'pt20'}>
          <NgFormSearch
            isInline={false}
            firstRowChildCount={2}
            searchCols={searchCols}
            onSearch={onSearch}
            onValuesChange={onValuesChange}
          />
        </div>
        <div className="mt20">
          <NgTable
            columns={tableColumnsFun({
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
    </div>
  );
};

export default RuleManageList;
