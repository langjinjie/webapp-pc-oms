import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { NgFormSearch, NgTable } from 'src/components';
import { searchCols, StaffProps, tableColumns } from './Config';
import { AddStatisticsFreeModal } from './Components/ExportStaff/AddStatisticsFreeModal';
import { addFreeStaffs, getFreeStaffList } from 'src/apis/orgManage';

const StatisticsFreeList: React.FC = () => {
  const [selectedRowKeys, setSelectRowKeys] = useState<React.Key[]>([]);
  const [visible, setVisible] = useState(false);
  const [dataSource, setDataSource] = useState<StaffProps[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0
  });

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

  const getList = async (params?: any) => {
    const res = await getFreeStaffList({
      name: '',
      pageSize: 10,
      pageNum: 1,
      ...params
    });
    if (res) {
      const { list, total } = res;
      setPagination(total);
      setDataSource(list || []);
    }
  };
  useEffect(() => {
    getList();
  }, []);

  const submitAddFreeStaffs = async (params: { userIds: string[]; freeType: string }) => {
    setVisible(false);
    const res = await addFreeStaffs(params);
    console.log(res);
  };
  return (
    <div className="container">
      <div className="header">
        <div className="btn_wrap pb20">
          <Button
            type="primary"
            onClick={() => {
              setVisible(true);
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
          pagination={pagination}
          dataSource={dataSource}
          setRowKey={(record: StaffProps) => {
            return record.userId;
          }}
        />
      </div>
      <AddStatisticsFreeModal visible={visible} onCancel={() => setVisible(false)} onConfirm={submitAddFreeStaffs} />
    </div>
  );
};

export default StatisticsFreeList;
