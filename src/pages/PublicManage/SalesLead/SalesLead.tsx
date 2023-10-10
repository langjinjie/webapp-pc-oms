import React, { Key, useEffect, useState } from 'react';
import { Button, Card, Modal as AntModal, message } from 'antd';
import { NgFormSearch, NgTable } from 'src/components';
import { ISalesLeadRow, searchCols, tableColumns } from './Config';
import { IPagination } from 'src/utils/interface';
import { requestActivityLeadList, requestManActivityLead } from 'src/apis/publicManage';
import { AllocationModal } from './component';
import style from './style.module.less';

const SalesLead: React.FC = () => {
  const [list, setList] = useState<ISalesLeadRow[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [pagination, setPagination] = useState<IPagination>({ current: 1, pageSize: 10, total: 0 });
  const [recordItem, setRecordItem] = useState<ISalesLeadRow>();
  const [formParam, setFormParam] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [isBatch, setIsBatch] = useState(false);

  const getList = async (values?: any) => {
    const { fromStaffName, fromDeptId, followName, followDept } = values || {};
    const res = await requestActivityLeadList({
      ...values,
      fromStaffName: fromStaffName?.[0]?.staffName,
      fromDeptId: fromDeptId?.[0]?.deptId.toString(), // 部门id为number，需要转成string
      followName: followName?.[0]?.staffName,
      followDept: followDept?.[0]?.deptId.toString() // 部门id为number，需要转成string
    });
    if (res) {
      setList(res.list || []);
      setPagination((pagination) => ({
        ...pagination,
        current: values?.pageNum || 1,
        pageSize: values?.pageSize || 10,
        total: res.total || 0
      }));
    }
  };

  const onSearch = async (values?: any) => {
    setLoading(true);
    await getList(values);
    setLoading(false);
    setFormParam(values);
  };

  // 管理线索接口
  const manLead = async ({ staffId, remark }: { staffId: { staffId: string }[]; remark: string }) => {
    // 通过isLeader来判断是否是批量操作
    const opType = isBatch ? 1 : recordItem?.status === 1 ? 1 : 3;
    const list = isBatch
      ? selectedRowKeys.map((key) => ({ leadId: key as string }))
      : [{ leadId: recordItem?.leadId as string }];
    const res = await requestManActivityLead({
      opType,
      followStaffId: staffId[0].staffId,
      list,
      remark
    });
    if (res) {
      getList({ ...formParam, pageNum: pagination.current, pageSize: pagination.pageSize });
      message.success(`${isBatch ? '批量分配' : recordItem?.status === 1 ? '分配' : '再分配'}成功`);
      setIsBatch(false);
      setRecordItem(undefined);
      setVisible(false);
      setSelectedRowKeys([]);
    }
  };

  // 批量分配
  const batchMan = () => {
    setIsBatch(true);
    setVisible(true);
  };

  // 分配/撤回
  /*
    状态:待分配          =>      操作:分配     1     =>  1
    状态:已分配/自动分配/再分配 => 操作:撤回     [2,5]  =>  2
    状态:撤回            =>      操作:再分配   4      =>  3
  */
  const edit = async (row: ISalesLeadRow) => {
    // 2,5 撤回,
    if (row.status === 3) return message.warn('自动分配不支持任何操作');
    if (![2, 5].includes(row.status)) {
      setRecordItem(row);
      setVisible(true);
    } else {
      AntModal.confirm({
        title: '温馨提示',
        content: '确定要撤回吗？',
        async onOk () {
          const res = await requestManActivityLead({ opType: 2, list: [{ leadId: row.leadId }] });
          if (res) {
            getList({ ...formParam, pageNum: pagination.current, pageSize: pagination.pageSize });
            message.success('撤回成功');
          }
        }
      });
    }
  };

  const orgTreeOnCancel = () => {
    setVisible(false);
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
        // 只有未分配和撤回状态能够 批量分配
        disabled: ![1, 4].includes(record.status)
      };
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await getList();
      setLoading(false);
    })();
  }, []);

  return (
    <Card title="销售线索" bordered={false}>
      <NgFormSearch searchCols={searchCols} onSearch={onSearch} />
      <NgTable
        columns={tableColumns(edit)}
        dataSource={list}
        loading={loading}
        rowKey="leadId"
        scroll={{ x: 'max-content' }}
        rowSelection={rowSelection}
        pagination={pagination}
        paginationChange={paginationChange}
      />
      {list.length === 0 || (
        <Button className={style.batchBtn} disabled={selectedRowKeys.length === 0} onClick={batchMan}>
          批量分配
        </Button>
      )}
      <AllocationModal
        title={isBatch ? '销售线索批量分配' : '销售线索分配'}
        visible={visible}
        onClose={orgTreeOnCancel}
        onOk={manLead}
      />
    </Card>
  );
};
export default SalesLead;
