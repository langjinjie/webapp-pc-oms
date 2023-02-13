import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Modal } from 'antd';
import React, { Key, useEffect, useState } from 'react';
import { NgFormSearch, NgTable } from 'src/components';
import { SearchCols, TableColumns } from 'src/pages/Operation/ChannelTag/Config';
import { IChannelItem } from './Config';
import {
  requestGetChannelGroupList,
  requestManageChannelGroup,
  requestEditChannelGroupIsUse,
  requestEditChannelGroup
} from 'src/apis/channelTag';
import { IPagination } from 'src/utils/interface';
import AddTagModal from './AddTagModal/AddTagModal';
import style from './style.module.less';

const ChannelTag: React.FC = () => {
  const [tableLoading, setTableLoading] = useState(false);
  const [list, setList] = useState<IChannelItem[]>([]);
  const [pagination, setPagination] = useState<IPagination>({ current: 1, pageSize: 10, total: 0 });
  const [addTagValue, setAddTagValue] = useState<IChannelItem>();
  const [addTagVisible, setAddTagVisible] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [formParam, setFormParam] = useState<{ [key: string]: any }>({});
  const [recordItem, setRecordItem] = useState<IChannelItem>();

  // 获取渠道标签列表
  const getList = async (params?: any) => {
    setTableLoading(true);
    const res = await requestGetChannelGroupList({ ...params });
    if (res) {
      const { list, total } = res;
      setPagination((pagination) => ({ ...pagination, total }));
      setList(list);
      setSelectedRowKeys([]);
      setRecordItem(undefined);
    }
    setTableLoading(false);
  };
  // 搜索标签
  const onSearchHandle = async (values: any) => {
    await getList(values);
    setPagination((pagination) => ({ ...pagination, current: 1 }));
    setFormParam(values);
  };
  // 切换分页
  const paginationChange = (current: number, pageSize?: number) => {
    setPagination((pagination) => ({ ...pagination, current, pageSize: pageSize as number }));
    getList({ ...formParam, pageNum: current, pageSize: pageSize as number });
  };
  // 重置搜索
  const onResetHandle = () => {
    getList();
    setPagination((pagination) => ({ ...pagination, current: 1, pageSize: 10 }));
    setFormParam({});
  };
  // 添加渠道标签
  const addTagHandle = () => {
    setAddTagVisible(true);
  };
  // 编辑
  const editHandle = (row: IChannelItem) => {
    setAddTagValue(row);
    setAddTagVisible(true);
  };
  // 取消编辑
  const addTagModalOnCancelHandle = () => {
    setAddTagVisible(false);
    setAddTagValue(undefined);
  };
  // 确认编辑
  const onOkHandle = async (value?: IChannelItem) => {
    if (value) {
      const res = await requestEditChannelGroup({ ...value });
      if (res) {
        addTagModalOnCancelHandle();
        const { current: pageNum, pageSize } = pagination;
        getList({ ...formParam, pageNum, pageSize });
      }
    }
  };

  // 停用/删除
  const manageChannelGroupHandle = async (value: IChannelItem, type: number) => {
    if (value.canDel === 2 || (type === 1 && value.status === 2)) {
      return Modal.warning({ title: '操作提醒', centered: true, content: `该数据无法${type === 1 ? '停用' : '删除'}` });
    }
    Modal.confirm({
      title: '操作提示',
      content: `确定${type === 1 ? '停用' : '删除'}标签组吗？`,
      async onOk () {
        const res = await requestManageChannelGroup({ type, groupIdList: [value.groupId] });
        if (res) {
          const { current: pageNum, pageSize } = pagination;
          message.success(`${type === 1 ? '停用' : '删除'}成功`);
          getList({ ...formParam, pageNum: pageNum, pageSize });
        }
      }
    });
  };

  // 批量操作
  const batchManageHandle = async (type: number) => {
    const batchIsUse = selectedRowKeys.map((key) => requestEditChannelGroupIsUse({ groupId: key }));
    const res = await Promise.all(batchIsUse);
    if (res.some((item) => item.isUsed === 1)) {
      Modal.warn({ title: '操作提醒', centered: true, content: `该数据无法${type === 1 ? '停用' : '删除'}` });
    } else {
      Modal.confirm({
        title: '操作提示',
        content: `确定批量${type === 1 ? '停用' : '删除'}标签组吗？`,
        async onOk () {
          setBtnLoading(true);
          const res = await requestManageChannelGroup({ type, groupIdList: selectedRowKeys });
          if (res) {
            const { current: pageNum, pageSize } = pagination;
            message.success(`批量${type === 1 ? '停用' : '删除'}成功`);
            setSelectedRowKeys([]);
            getList({ ...formParam, pageNum: pageNum, pageSize });
          }
          setBtnLoading(false);
        }
      });
    }
  };

  const rowSelection: any = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: Key[], records: IChannelItem[]) => {
      setSelectedRowKeys(selectedRowKeys);
      setRecordItem(records[0]);
    },
    getCheckboxProps: (record: IChannelItem) => {
      return {
        disabled: record.canDel === 2 || (recordItem?.status && record.status !== recordItem?.status)
      };
    }
  };
  useEffect(() => {
    getList();
  }, []);
  return (
    <>
      <h1>渠道标签</h1>
      <div className={style.content}>
        <NgFormSearch onSearch={onSearchHandle} searchCols={SearchCols} onReset={onResetHandle} />
        <Button className={style.addBtn} type="primary" icon={<PlusOutlined />} onClick={addTagHandle}>
          新增渠道标签
        </Button>
        <NgTable
          setRowKey={(record: IChannelItem) => record.groupId}
          className={style.table}
          dataSource={list}
          columns={TableColumns(editHandle, manageChannelGroupHandle)}
          loading={tableLoading}
          rowSelection={rowSelection}
          pagination={{ ...pagination }}
          paginationChange={paginationChange}
        />
        <div className={style.batch}>
          <Button
            className={style.batchStop}
            loading={btnLoading}
            disabled={recordItem?.status === 2 || selectedRowKeys.length === 0}
            onClick={() => batchManageHandle(1)}
          >
            批量停用
          </Button>
          <Button
            className={style.batchDel}
            loading={btnLoading}
            disabled={selectedRowKeys.length === 0}
            onClick={() => batchManageHandle(2)}
          >
            批量删除
          </Button>
        </div>
      </div>
      <AddTagModal value={addTagValue} visible={addTagVisible} onCancel={addTagModalOnCancelHandle} onOk={onOkHandle} />
    </>
  );
};
export default ChannelTag;
