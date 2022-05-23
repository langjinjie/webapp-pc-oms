import React, { useEffect, useState } from 'react';
import { Button, message, PaginationProps } from 'antd';
import { AuthBtn, NgFormSearch, NgTable } from 'src/components';
import { searchCols, CustomerProps, tableColumns } from './Config';
import { AddCustomerFreeModal } from './Components/AddCustomerModal';
import {
  addFreeCustomer,
  batchAddFreeCustomer,
  delFreeCustomer,
  exportFreeList,
  getCustomerFreeList
} from 'src/apis/orgManage';
import DeleteModal from '../StatisticsFree/Components/DeleteModal/DeleteModal';
import ExportModal from 'src/pages/SalesCollection/SpeechManage/Components/ExportModal/ExportModal';
import BatchAddResult from './Components/BatchAddResultModal';
import { exportFile } from 'src/utils/base';

interface BatchAddResultProps {
  successCount: number;
  repeatCount: number;
  notExistCount: number;
  emptyCount: number;
  errorUrl: string;
}
const CustomerStatisticsFree: React.FC = () => {
  const [selectedRowKeys, setSelectRowKeys] = useState<React.Key[]>([]);
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [dataSource, setDataSource] = useState<CustomerProps[]>([]);
  const [batchVisible, setBatchVisible] = useState(false);
  const [batchResultVisible, setBatchResultVisible] = useState(false);
  const [formParams, setFormParams] = useState({
    condition: '',
    staffName: '',
    addReason: ''
  });
  const [batchAddResult, setBatchAddResult] = useState<BatchAddResultProps>();
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });

  const getList = async (params?: any) => {
    setIsLoading(true);
    setSelectRowKeys([]);
    const res = await getCustomerFreeList({
      ...formParams,
      pageSize: pagination.pageSize,
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
    setPagination((pagination) => ({ ...pagination, current: 1 }));
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

  const batchAdd = async (file: any) => {
    setConfirmLoading(true);
    console.log('批量新增');
    const formData = new FormData();
    formData.append('file', file);
    const res: BatchAddResultProps = await batchAddFreeCustomer(formData);
    setConfirmLoading(false);
    setBatchVisible(false);
    if (res) {
      if (res.errorUrl) {
        setBatchResultVisible(true);
        setBatchAddResult(res);
      } else {
        message.success('批量新增成功');
      }
      getList({ pageNum: 1 });
    }
  };

  const cancelBatchAdd = () => {
    setBatchVisible(false);
  };

  const downLoadModel = () => {
    window.location.href =
      'https://insure-prod-server-1305111576.cos.ap-guangzhou.myqcloud.com/file/stafforg/%E5%AE%A2%E6%88%B7%E5%85%8D%E7%BB%9F%E8%AE%A1%E5%90%8D%E5%8D%95-%E6%89%B9%E9%87%8F%E4%B8%8A%E4%BC%A0%E6%A8%A1%E6%9D%BF.xlsx';
  };

  const exportList = async () => {
    const { data } = await exportFreeList(formParams);
    exportFile(data, '客户免统计名单');
  };

  return (
    <div className="container">
      <div className="header">
        <div className="btn_wrap pb20">
          <AuthBtn path="/add">
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
          </AuthBtn>
          <AuthBtn path="/addBatch">
            <Button
              type="primary"
              onClick={() => {
                setBatchVisible(true);
              }}
              shape="round"
              size="large"
            >
              批量新增
            </Button>
          </AuthBtn>
          <AuthBtn path="/delete">
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
          </AuthBtn>
          <AuthBtn path="/export">
            <Button type="primary" shape="round" size="large" onClick={exportList}>
              导出
            </Button>
          </AuthBtn>
        </div>
        <AuthBtn path="/query">
          <NgFormSearch searchCols={searchCols} onSearch={handleSearch} />
        </AuthBtn>
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

      {/* 批量新增 start  */}
      <ExportModal
        confirmLoading={confirmLoading}
        visible={batchVisible}
        onDownLoad={downLoadModel}
        onOK={batchAdd}
        onCancel={cancelBatchAdd}
      />
      {/* 批量新增 end */}

      {/* 批量上传结果 start */}

      <BatchAddResult
        batchAddResult={batchAddResult}
        onCancel={() => setBatchResultVisible(false)}
        visible={batchResultVisible}
      ></BatchAddResult>
    </div>
  );
};

export default CustomerStatisticsFree;
