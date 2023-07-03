import React, { Key, useEffect, useState } from 'react';
import { NgTable } from 'src/components';
import { Modal } from 'antd';
import { requestGetChatTagList } from 'src/apis/tagConfig';
import { PaginationConfig } from 'antd/es/pagination';
import style from './style.module.less';

interface IUpdateChatTagItem {
  detailId: string; // 是 解析标签id
  tagGroupName: string; // 是 映射的标签组名称
  tagName: string; // 是 映射的标签名称
  updateTag: number; // 是 是否已更新标签，0-否，1-是
}

interface IUpdateTagModalProps {
  visible: boolean;
  analyseId?: string; // 会存解析ID
  title?: string;
  onOk?: (param: any) => void;
  onClose: () => void;
}

const UpdateTagModal: React.FC<IUpdateTagModalProps> = ({ visible, analyseId, title, onClose, onOk }) => {
  const [selectedRows, setSelectedRows] = useState<IUpdateChatTagItem[]>([]);
  const [updateTagInfo, setUpdateTagInfo] = useState<{
    clientName: string;
    externalUserid: string;
    msgContent: string;
    list: IUpdateChatTagItem[];
  }>({
    clientName: '',
    externalUserid: '',
    msgContent: '',
    list: []
  });
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
    simple: true
  });

  // 重置
  const onReset = () => {
    setSelectedRows([]);
    setPagination((pagination) => ({ ...pagination, current: 1 }));
  };

  // 获取可更新的解析标签列表接口
  const getChatTagList = async (values?: { pageNum?: number }) => {
    const res = await requestGetChatTagList({ analyseId, ...values });
    if (res) {
      const { clientName, externalUserid, msgContent, list, total } = res;
      setUpdateTagInfo({ clientName, externalUserid, msgContent, list: list || [] });
      setPagination((pagination) => ({ ...pagination, current: values?.pageNum || 1, total }));
    }
  };

  // 切换分页
  const paginationChange = (pageNum: number) => {
    getChatTagList({ pageNum });
  };

  const rowSelection = {
    selectedRowKeys: selectedRows.map(({ detailId }) => detailId),
    preserveSelectedRowKeys: true,
    onChange (_: Key[], selectedRows: IUpdateChatTagItem[]) {
      setSelectedRows(selectedRows);
    },
    getCheckboxProps: (record: IUpdateChatTagItem) => {
      return {
        disabled: record.updateTag === 1,
        name: ''
      };
    }
  };

  const onOkHandle = async () => {
    setLoading(true);
    const list = selectedRows.map(({ detailId, tagGroupName, tagName }) => ({ detailId, tagGroupName, tagName }));
    await onOk?.({ analyseId, list });
    setLoading(false);
  };

  useEffect(() => {
    if (visible) {
      getChatTagList();
    } else {
      onReset();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      title={title || '选择标签更新'}
      width={710}
      centered
      className={style.wrap}
      onOk={onOkHandle}
      onCancel={onClose}
      okButtonProps={{
        loading: loading,
        disabled: selectedRows.length === 0
      }}
    >
      <div className={style.clientInfo}>
        <div>客户昵称：{updateTagInfo.clientName}</div>
        <div className={style.externalUserid}>外部联系人id：{updateTagInfo.externalUserid}</div>
      </div>
      <div className={style.chatInfo}>聊天内容：{updateTagInfo.msgContent}</div>
      <NgTable
        className={style.table}
        rowKey="detailId"
        scroll={{ x: 662 }}
        columns={[
          { title: '标签', dataIndex: 'tagGroupName' },
          { title: '标签值', dataIndex: 'tagName' }
        ]}
        dataSource={updateTagInfo.list}
        rowSelection={rowSelection}
        pagination={pagination}
        paginationChange={paginationChange}
      />
    </Modal>
  );
};
export default UpdateTagModal;
