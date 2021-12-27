import React, { useEffect, useState } from 'react';
import { Button, message, PaginationProps } from 'antd';
import { NgFormSearch, NgTable } from 'src/components';
import { searchCols, StaffProps, tableColumns } from './Config';
import { AddStatisticsFreeModal } from './Components/ExportStaff/AddStatisticsFreeModal';
import { addFreeStaffs, delFreeStaffs, getFreeStaffList } from 'src/apis/orgManage';
import DeleteModal from './Components/DeleteModal/DeleteModal';

const StatisticsFreeList: React.FC = () => {
  const [selectedRowKeys, setSelectRowKeys] = useState<React.Key[]>([]);
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [dataSource, setDataSource] = useState<StaffProps[]>([]);
  const [formParams, setFormParams] = useState({
    name: ''
  });
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });

  const getList = async (params?: any) => {
    setSelectRowKeys([]);
    setIsLoading(true);
    const res = await getFreeStaffList({
      ...formParams,
      pageSize: 10,
      pageNum: 1,
      ...params
    });
    setIsLoading(false);
    if (res) {
      const { list, total } = res;
      setPagination((pagination) => ({ ...pagination, total }));
      setDataSource(list || []);
    }
  };

  const handleSearch = ({ name = '' }: { name: string }) => {
    setFormParams({ name });
    getList({ pageNum: 1, name });
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

  useEffect(() => {
    getList();
  }, []);

  const onPaginationChange = (pageNum: number, pageSize?: number) => {
    setPagination((pagination) => ({ ...pagination, current: pageNum, pageSize }));
    getList({ pageNum, pageSize });
  };

  const submitAddFreeStaffs = async (params: { staffIds: string[]; freeType: string }) => {
    setVisible(false);
    const res = await addFreeStaffs(params);
    if (res) {
      message.success('新增成功!');
      await getList({ pageNum: 1 });
    }
  };

  const deleteStaffs = async () => {
    const res = await delFreeStaffs({ staffIds: selectedRowKeys });
    setDeleteVisible(false);
    if (res) {
      setSelectRowKeys([]);
      message.success('删除成功!');
      await getList({ pageNum: 1 });
    }
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
              setDeleteVisible(true);
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
          loading={isLoading}
          rowSelection={rowSelection}
          pagination={pagination}
          dataSource={dataSource}
          paginationChange={onPaginationChange}
          setRowKey={(record: StaffProps) => {
            return record.staffId;
          }}
        />
      </div>
      {/* 添加免统计弹框 */}
      <AddStatisticsFreeModal visible={visible} onCancel={() => setVisible(false)} onConfirm={submitAddFreeStaffs} />

      {/* 删除选中名单弹框 */}
      <DeleteModal visible={deleteVisible} onCancel={() => setDeleteVisible(false)} onOk={deleteStaffs} />
    </div>
  );
};

export default StatisticsFreeList;
