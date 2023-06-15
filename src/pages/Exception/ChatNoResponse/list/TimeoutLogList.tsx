import { Button } from 'antd';
import React from 'react';
import { NgFormSearch, NgTable } from 'src/components';
import { logSearchCols, logTableColumns } from './Config';

const TimeoutLogList: React.FC = () => {
  const onSearch = (values: any) => {
    console.log(values);
  };
  return (
    <div>
      <div className="flex mt30 align-end">
        <div className="cell">
          <NgFormSearch className="" searchCols={logSearchCols} onSearch={onSearch} />
        </div>
        <Button type="primary" shape="round">
          下载记录
        </Button>
      </div>
      <NgTable dataSource={[{}]} pagination={{ total: 100 }} className="mt16" columns={logTableColumns}></NgTable>
    </div>
  );
};

export default TimeoutLogList;
