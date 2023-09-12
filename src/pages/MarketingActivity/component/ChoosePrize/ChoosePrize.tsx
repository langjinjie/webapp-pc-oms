import React, { Key, useEffect, useState } from 'react';
import { Modal, NgTable } from 'src/components';
import { Button } from 'antd';
import { IPagination } from 'src/utils/interface';
import { requestActivityPrizeUpList } from 'src/apis/marketingActivity';
import { AddPrizeModal } from '../index';

interface IChoosePrizeProps {
  value?: any;
  onChange?: (value?: any) => void;
}

const ChoosePrize: React.FC<IChoosePrizeProps> = ({ value, onChange }) => {
  const [visible, setVisible] = useState(false);
  const [pagination, setPagination] = useState<IPagination>({ current: 1, pageSize: 10, total: 0 });
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addPrizeVisible, setAddPrizeVisible] = useState(false);

  // 选择奖品
  const choosePrize = () => {
    setVisible(true);
  };

  const onRest = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

  const onClose = () => {
    setVisible(false);
    onRest();
  };

  const onOk = () => {
    onChange?.(selectedRows[0]);
    onClose();
  };

  // 获取列表
  const getList = async (values?: any) => {
    setLoading(true);
    const { pageNum = 1, pageSize = 10 } = values || {};
    const res = await requestActivityPrizeUpList({ ...values });
    setLoading(false);
    if (res) {
      const { list, total } = res;
      setList(list || []);
      setPagination({ current: pageNum, pageSize, total });
    }
  };

  const paginationChange = (current: number, pageSize?: number) => {
    const newPagination = { ...pagination, current, pageSize };
    if (pagination.pageSize !== pageSize) {
      newPagination.current = 1;
    }
    setPagination(newPagination);
    getList({ pageNum: newPagination.current, pageSize: pageSize || 10 });
  };

  const rowSelection: any = {
    type: 'radio',
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: Key[], records: any[]) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(records);
    }
  };

  const onOkHandle = () => {
    setAddPrizeVisible(false);
    getList({ pageNum: pagination.current, pageSize: pagination.pageSize });
  };

  useEffect(() => {
    if (visible) {
      setSelectedRows(value ? [value] : []);
      setSelectedRowKeys(value ? [value.goodsId] : []);
      getList();
    }
  }, [visible]);
  return (
    <>
      <span>{value?.goodsName}</span>
      <Button className="ml10" type="primary" shape="round" onClick={choosePrize}>
        选择奖品
      </Button>
      <Modal centered width={960} title={'选择奖品'} visible={visible} onClose={onClose} onOk={onOk}>
        <Button className="mr10" type="primary" shape="round" onClick={() => setAddPrizeVisible(true)}>
          新增奖品
        </Button>
        <Button shape="round" onClick={() => getList({ pageNum: pagination.current, pageSize: pagination.pageSize })}>
          刷新
        </Button>
        <NgTable
          columns={[
            { title: '奖品批次', dataIndex: 'goodsId' },
            { title: '奖品名称', dataIndex: 'goodsName' },
            { title: '剩余库存', dataIndex: 'remainStock' },
            { title: '创建时间', dataIndex: 'dateCreated' }
          ]}
          dataSource={list}
          className="mt20"
          rowKey="goodsId"
          loading={loading}
          scroll={{ x: 912 }}
          rowSelection={rowSelection}
          pagination={pagination}
          paginationChange={paginationChange}
        />
      </Modal>
      <AddPrizeModal visible={addPrizeVisible} onOk={onOkHandle} onCancel={() => setAddPrizeVisible(false)} />
    </>
  );
};
export default ChoosePrize;
