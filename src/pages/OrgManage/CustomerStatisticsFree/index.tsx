import React, { useEffect, useState } from 'react';
import { Button, message, PaginationProps } from 'antd';
import { NgFormSearch, NgTable } from 'src/components';
import { searchCols, CustomerProps, tableColumns } from './Config';
import { AddCustomerFreeModal } from './Components/AddCustomerModal';
import { addFreeCustomer, delFreeCustomer, getCustomerFreeList } from 'src/apis/orgManage';
import DeleteModal from '../StatisticsFree/Components/DeleteModal/DeleteModal';

const CustomerStatisticsFree: React.FC = () => {
  const [selectedRowKeys, setSelectRowKeys] = useState<React.Key[]>([]);
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [dataSource, setDataSource] = useState<CustomerProps[]>([]);
  const [formParams, setFormParams] = useState({
    condition: '',
    staffName: '',
    addReason: ''
  });
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });

  const getList = async (params?: any) => {
    setIsLoading(true);
    const res = await getCustomerFreeList({
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

  const handleSearch = ({
    condition = '',
    staffName = '',
    addReason = ''
  }: {
    condition: string;
    staffName: string;
    addReason: string;
  }) => {
    setFormParams({ condition, staffName, addReason });
    getList({ pageNum: 1, condition, staffName, addReason });
  };

  const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: CustomerProps[]) => {
    setSelectRowKeys(selectedRowKeys);
    console.log(selectedRows);
  };
  // 表格RowSelection配置项
  const rowSelection = {
    hideSelectAll: false,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: CustomerProps[]) => {
      onSelectChange(selectedRowKeys, selectedRows);
    },
    getCheckboxProps: (record: CustomerProps) => {
      return {
        disabled: record.isDeleted,
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

  const submitAddFreeStaffs = async (params: { externalUserId: string; addReason: string }) => {
    setVisible(false);
    const res = await addFreeCustomer(params);
    if (res) {
      message.success('新增成功!');
      setFormParams({
        condition: '',
        staffName: '',
        addReason: ''
      });
      await getList({ pageNum: 1, condition: '', staffName: '', addReason: '' });
    }
  };

  const deleteStaffs = async () => {
    const res = await delFreeCustomer({ externalUserIds: selectedRowKeys });
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
            删除
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
          setRowKey={(record: CustomerProps) => {
            return record.externalUserId;
          }}
        />
      </div>
      {/* 添加免统计弹框 */}
      <AddCustomerFreeModal visible={visible} onCancel={() => setVisible(false)} onConfirm={submitAddFreeStaffs} />

      {/* 删除选中名单弹框 */}
      <DeleteModal visible={deleteVisible} onCancel={() => setDeleteVisible(false)} onOk={deleteStaffs} />
    </div>
  );
};

export default CustomerStatisticsFree;
