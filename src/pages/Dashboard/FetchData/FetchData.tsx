import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { NgFormSearch, NgTable } from 'src/components';
import { searchCols, TableColumnFun } from './Config';

const FetchData: React.FC<RouteComponentProps> = ({ history }) => {
  const onSearch = (values: any) => {
    console.log(values);
  };
  const onAdd = () => {
    history.push('/fetchData/add');
  };
  return (
    <div className="container">
      <Button
        type="primary"
        shape="round"
        icon={<PlusOutlined />}
        onClick={() => {
          onAdd();
        }}
        size="large"
      >
        创建模板
      </Button>
      <NgFormSearch className="mt30" onSearch={onSearch} searchCols={searchCols} />
      <NgTable className="mt20" rowKey={'sqlId'} columns={TableColumnFun()}></NgTable>
    </div>
  );
};

export default FetchData;
