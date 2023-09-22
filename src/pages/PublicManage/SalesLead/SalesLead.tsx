import React, { Key, useEffect, useState } from 'react';
import { Button, Card, Modal as AntModal, message } from 'antd';
import { NgFormSearch, NgTable } from 'src/components';
import { ISalesLeadRow, searchCols, tableColumns } from './Config';
import { IPagination } from 'src/utils/interface';
import { requestActivityLeadActivityList, requestManActivityLead } from 'src/apis/publicManage';
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
  // const [remark, setRemark] = useState('');

  const getList = async (values?: any) => {
    const { fromStaffName, fromFullDeptNmae, followName, followFullDeptName } = values || {};
    const res = await requestActivityLeadActivityList({
      ...values,
      fromStaffName,
      fromFullDeptNmae,
      followName,
      followFullDeptName
    });
    setList([{}]);
    if (res) {
      setList([]);
      setPagination((pagination) => ({
        ...pagination,
        current: values?.pageNum || 1,
        pageSize: values?.pageSize || 10
      }));
    }
  };

  const onSearch = async (values?: any) => {
    console.log('values', values);
    setLoading(true);
    await getList(values);
    setLoading(false);
    setFormParam(values);
  };

  // 管理线索接口
  const manLead = async ({ staffId, remark }: { staffId: { staffId: string }[]; remark: string }) => {
    const res = await requestManActivityLead({
      opType: recordItem?.status === 1 ? 1 : 3,
      staffId: staffId[0].staffId,
      list: [],
      remark
    });
    if (res) {
      getList({ ...formParam, pageNum: pagination.current, pageSize: pagination.pageSize });
      message.success(`${recordItem?.status === 1 ? '分配' : '再分配'}成功`);
    }
  };

  // 分配/撤回
  /*
    待分配          =>      分配     1     =>  1
    已分配/自动分配/再分配 => 撤回  [2,3,5]  =>  2
    撤回            =>      再分配  4      =>  3
  */
  const edit = async (row: ISalesLeadRow) => {
    // 2,3,5 撤回,
    if (![2, 3, 5].includes(row.status)) {
      setRecordItem(row);
      setVisible(true);
    } else {
      AntModal.confirm({
        title: '温馨提示',
        content: '确定要撤回吗？',
        async onOk () {
          const res = await requestManActivityLead({ opType: 2, list: { leadId: row.leadId } });
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
        disabled: recordItem && record.status !== recordItem?.status
      };
    }
  };

  // 批量分配
  const batch = async () => {
    // [2,3,5] => 撤回(2)   1=> 分配(1)   4 => 再分配(3)
    const opType = [2, 3, 5].includes(recordItem?.status as number) ? 2 : recordItem?.status === 1 ? 1 : 3;
    const res = await requestManActivityLead({ opType, list: selectedRowKeys.map((key) => ({ leadId: key })) });
    if (res) {
      getList({ ...formParam, pageNum: pagination.current, pageSize: pagination.pageSize });
      message.success(`${opType === 1 ? '分配' : opType === 2 ? '撤回' : '再分配'}成功`);
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
    <Card title="销售线索">
      <NgFormSearch searchCols={searchCols} onSearch={onSearch} />
      <NgTable
        columns={tableColumns(edit)}
        dataSource={list}
        loading={loading}
        rowKey="leadId"
        scroll={{ x: 'max-content' }}
        rowSelection={rowSelection}
        paginationChange={paginationChange}
      />
      {list.length === 0 || (
        <Button className={style.batchBtn} disabled={selectedRowKeys.length === 0} onClick={batch}>
          批量分配
        </Button>
      )}
      <AllocationModal title="销售线索分配" visible={visible} onClose={orgTreeOnCancel} onOk={manLead} />
    </Card>
  );
};
export default SalesLead;
