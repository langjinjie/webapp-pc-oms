import React, { Key, useEffect, useState } from 'react';
import { Button, Card } from 'antd';
import { NgFormSearch, NgTable } from 'src/components';
import { ISalesLeadRow, searchCols, tableColumns } from './Config';
import { IPagination } from 'src/utils/interface';
import style from './style.module.less';

const SalesLead: React.FC = () => {
  const [list, setList] = useState<ISalesLeadRow[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [pagination, setPagination] = useState<IPagination>({ current: 1, pageSize: 10, total: 0 });
  const [recordItem, setRecordItem] = useState<ISalesLeadRow>();
  const [formParam, setFormParam] = useState<{ [key: string]: any }>({});

  const getList = (values?: any) => {
    console.log('values', values);
    setList([]);
    setPagination((pagination) => ({ ...pagination, current: values?.pageNum || 1, pageSize: values?.pageSize || 10 }));
  };

  const onSearch = (values?: any) => {
    console.log('values', values);
    setFormParam(values);
  };

  // 分配/撤回
  const edit = (row: ISalesLeadRow) => {
    setRecordItem(row);
    console.log('row', row);
  };

  // 切换分页
  const paginationChange = (current: number, pageSize?: number) => {
    const pageNum = pageSize !== pagination.pageSize ? 1 : current;
    getList({ ...formParam, pageNum, pageSize: pageSize as number });
  };

  const onSelectChange = (selectedRowKeys: Key[]) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection: any = {
    hideSelectAll: false,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: Key[]) => {
      onSelectChange(selectedRowKeys);
    },
    getCheckboxProps: (record: ISalesLeadRow) => {
      return {
        disabled: recordItem && record.status !== recordItem?.status
      };
    }
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <Card title="销售线索">
      <NgFormSearch searchCols={searchCols} onSearch={onSearch} />
      <NgTable
        columns={tableColumns(edit)}
        dataSource={list}
        scroll={{ x: 'max-content' }}
        rowSelection={rowSelection}
        paginationChange={paginationChange}
      />
      {list.length === 0 || (
        <Button className={style.batchBtn} disabled={selectedRowKeys.length === 0}>
          批量分配
        </Button>
      )}
    </Card>
  );
};
export default SalesLead;
