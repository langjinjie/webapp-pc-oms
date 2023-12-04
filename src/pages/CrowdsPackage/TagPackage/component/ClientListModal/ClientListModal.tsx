import React, { Key, useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, Modal, PaginationProps, Tag } from 'antd';
import { NgTable, SelectOrg } from 'src/components';
import { TableColumnsFun, IList, orgDeptType2Name } from './Config';
import { requestGetClientList } from 'src/apis/customerManage';
import { TagModal } from 'src/pages/StaffManage/components';
import style from './style.module.less';

interface IClientListModalProps {
  value?: any[];
  onChange?: (value?: any[]) => void;
  visible?: boolean;
  onCancel?: () => void;
  onOk?: () => void;
  title?: string;
  readOnly?: boolean;
}

const ClientListModal: React.FC<IClientListModalProps> = ({ value, onChange, visible, title, onCancel, readOnly }) => {
  const [list, setList] = useState<IList[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
  const [resultId, setResultId] = useState('');
  const [selectRows, setSelectRows] = useState<IList[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const [form] = Form.useForm();
  const { Item } = Form;
  const { RangePicker } = DatePicker;

  // 获取列表
  const getList = async (values?: any) => {
    setTableLoading(true);
    const res = await requestGetClientList({ ...values });
    if (res) {
      setList(res.list);
      const { pageNum } = values || {};
      if (!pageNum || pageNum === 1) {
        setResultId(res.resultId);
      }
      setPagination((pagination) => ({ ...pagination, total: res.total }));
    }
    setTableLoading(false);
  };

  const onSearch = (values: any) => {
    const { clientName, staffList: staffs, filterTag, beginTime: addBeginTime, endTime: addEndTime } = values;
    let orgDept: { [key: string]: string } | undefined;
    if ((values?.orgDept || []).length) {
      orgDept = {};
      for (const key in orgDeptType2Name) {
        orgDept[key] = (values?.orgDept || [])
          .filter((deptItem: { dType: number; deptId: number }) => deptItem.dType === orgDeptType2Name[key])
          .map(({ deptId }: { deptId: number }) => deptId)
          .toString();
      }
    }
    const staffList = staffs?.map(({ staffId }: { staffId: string }) => ({ staffId }));
    getList({
      clientName,
      staffList,
      filterTag,
      addBeginTime,
      addEndTime,
      orgDept,
      pageNum: 1
    });
    setFormValues({ clientName, staffList, filterTag, addBeginTime, addEndTime, orgDept });
    setPagination((pagination) => ({ ...pagination, pageSize: 10, current: 1 }));
  };

  const onPaginationChange = (pageNum: number, pageSize?: number) => {
    const newPageNum = pageSize !== pagination.pageSize ? 1 : pageNum;
    setPagination((pagination) => ({
      ...pagination,
      current: newPageNum,
      pageSize: pageSize as number
    }));
    getList({ ...formValues, pageNum: newPageNum, pageSize: pageSize as number, resultId });
  };

  const rowSelection: any = {
    hideSelectAll: false,
    selectedRowKeys: selectRows.map(({ detailId }) => detailId),
    // selectedRowKeys records 只是本页数据
    onChange: (_: Key[], records: IList[]) => {
      // 筛选出选中的非本页员工
      const noCurrentRows = selectRows.filter(
        (filterItem) => !list.map(({ detailId }) => detailId).includes(filterItem.detailId)
      );
      setSelectRows([...noCurrentRows, ...records]);
    }
  };
  // 重置
  const onResetHandle = () => {
    getList();
    setPagination({
      current: 1,
      pageSize: 10,
      total: 0
    });
    setFormValues({});
  };
  const onCloseHandle = (detailId: string) => {
    setSelectRows((rows) => rows.filter((rowItem) => rowItem.detailId !== detailId));
  };
  const onCancelHandle = () => {
    onCancel?.();
  };

  const onOkHandle = () => {
    onChange?.(selectRows);
    onCancelHandle();
  };

  useEffect(() => {
    if (visible) {
      getList();
      setSelectRows(value || []);
    }
  }, [visible]);

  return (
    <Modal
      className={style.modalWrap}
      title={'添加客户' || title}
      visible={visible}
      width={1116}
      centered
      onCancel={onCancelHandle}
      onOk={onOkHandle}
    >
      <div className={style.pannel}>选择客户</div>
      <div className="container">
        <Form form={form} layout="inline" onFinish={onSearch} className={style.form}>
          <Item label="客户名称" name="clientName">
            <Input placeholder="请输入" className={style.inpiut} />
          </Item>
          <Item name="filterTag" label="客户标签">
            <TagModal className={style.select} />
          </Item>
          <Item label="加好友时间" name="addTime">
            <RangePicker className={style.rangePicker} />
          </Item>
          <Item label="所属客户经理" name="staffList">
            <SelectOrg className={style.select} />
          </Item>
          <Item label="所属客户经理组织架构" name="orgDept">
            <SelectOrg key={2} type="dept" checkabledDTypeKeys={[2, 3, 4, 5]} className={style.select} />
          </Item>
          <Button className={style.submit} htmlType="submit" type="primary">
            查询
          </Button>
          <Button className={style.reset} onClick={onResetHandle}>
            重置
          </Button>
        </Form>
        <NgTable
          className={style.table}
          rowKey={'detailId'}
          dataSource={list}
          loading={tableLoading}
          scroll={{ x: 'max-content' }}
          columns={TableColumnsFun()}
          pagination={pagination}
          paginationChange={onPaginationChange}
          rowSelection={rowSelection}
        />
      </div>
      <div className={style.pannel}>已选择客户</div>
      {selectRows.length === 0 || (
        <div className={style.selectWrap}>
          {selectRows.map((mapItem) => (
            <Tag
              className={style.tag}
              key={mapItem.detailId}
              visible
              {...(readOnly ? { closable: false } : { closable: true })}
              onClose={() => onCloseHandle(mapItem.detailId)}
            >
              {mapItem.nickName}
            </Tag>
          ))}
        </div>
      )}
    </Modal>
  );
};
export default ClientListModal;
