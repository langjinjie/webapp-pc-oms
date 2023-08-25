import React, { Key, useEffect, useState } from 'react';
import { Modal, NgTable } from 'src/components';
import { Button } from 'antd';
import { IPagination } from 'src/utils/interface';
import style from './style.module.less';

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
    onChange?.(selectedRows);
    onClose();
  };

  const paginationChange = (current: number, pageSize?: number) => {
    const newPagination = { ...pagination, current, pageSize };
    if (pagination.pageSize !== pageSize) {
      newPagination.current = 1;
    }
    setPagination(newPagination);
  };

  const rowSelection: any = {
    type: 'radio',
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: Key[], records: any[]) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(records);
    }
  };

  // 获取列表
  const getList = () => {
    setList([
      {
        奖品批次: '1',
        奖品名称: '123',
        剩余库存: 1,
        创建时间: '2023-08-14'
      }
    ]);
  };

  useEffect(() => {
    if (visible) {
      setSelectedRows(value || []);
      getList();
    }
  }, [visible]);
  return (
    <>
      <Button type="primary" shape="round" onClick={choosePrize}>
        选择奖品
      </Button>
      <Modal
        centered
        width={960}
        title={'选择奖品'}
        visible={visible}
        onClose={onClose}
        onOk={onOk}
        className={style.choosePrizeModal}
      >
        <Button className="mr10" type="primary" shape="round">
          新增奖品
        </Button>
        <Button shape="round">刷新</Button>
        <NgTable
          columns={[
            { title: '奖品批次', dataIndex: '奖品批次' },
            { title: '奖品名称', dataIndex: '奖品名称' },
            { title: '剩余库存', dataIndex: '剩余库存' },
            { title: '创建时间', dataIndex: '创建时间' }
          ]}
          dataSource={list}
          className="mt20"
          scroll={{ x: 912 }}
          rowSelection={rowSelection}
          pagination={pagination}
          paginationChange={paginationChange}
        />
      </Modal>
    </>
  );
};
export default ChoosePrize;
