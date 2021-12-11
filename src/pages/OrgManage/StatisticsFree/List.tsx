import React, { useState } from 'react';
import { Button } from 'antd';
import { NgFormSearch, NgTable } from 'src/components';
import { searchCols, StaffProps, tableColumns } from './Config';

const StatisticsFreeList: React.FC = () => {
  const [selectedRowKeys, setSelectRowKeys] = useState<React.Key[]>([]);
  const handleSearch = (params: any) => {
    console.log(params);
  };

  const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: StaffProps[]) => {
    setSelectRowKeys(selectedRowKeys);
    console.log(selectedRows);
  };
  // 表格RowSelection配置项
  const rowSelection = {
    hideSelectAll: false,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: StaffProps[]) => {
      onSelectChange(selectedRowKeys, selectedRows);
    },
    getCheckboxProps: (record: StaffProps) => {
      return {
        disabled: false,
        name: record.name
      };
    }
  };
  return (
    <div className="container">
      <div className="header">
        <div className="btn_wrap pb20">
          <Button
            type="primary"
            onClick={() => {
              console.log('添加');
            }}
            shape="round"
            size="large"
          >
            新增免统计名单
          </Button>
          <Button
            type="primary"
            onClick={() => {
              console.log('添加');
            }}
            shape="round"
            size="large"
            disabled={selectedRowKeys.length === 0}
          >
            删除成员
          </Button>
        </div>
        <NgFormSearch searchCols={searchCols} onSearch={handleSearch} />
      </div>
      <div className="pt20">
        <NgTable
          columns={tableColumns()}
          loading={false}
          rowSelection={rowSelection}
          dataSource={[{ userId: '122', name: 'yuyd' }]}
          setRowKey={(record: StaffProps) => {
            return record.userId;
          }}
        />
      </div>
    </div>
  );
};

export default StatisticsFreeList;
