import React, { Key, useEffect, useState } from 'react';
import { Modal, NgTable } from 'src/components';
import { requestGetChatTagList } from 'src/apis/systemSettings';
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
  onOk?: (list: Key[]) => void;
  onClose: () => void;
}

const UpdateTagModal: React.FC<IUpdateTagModalProps> = ({ visible, analyseId, title, onClose, onOk }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [list, setList] = useState<IUpdateChatTagItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
    simple: true
  });

  // 重置
  const onReset = () => {
    setSelectedRowKeys([]);
    setPagination((pagination) => ({ ...pagination, current: 1 }));
  };

  // 获取可更新的解析标签列表接口
  const getChatTagList = async (values?: { pageNum?: number }) => {
    const res = await requestGetChatTagList({ analyseId, ...values });
    if (res) {
      const { list, total } = res;
      setList(list);
      setPagination((pagination) => ({ ...pagination, total }));
    }
  };

  // 切换分页
  const paginationChange = (pageNum: number) => {
    setPagination((pagination) => ({ ...pagination, current: pageNum }));
    getChatTagList({ pageNum });
  };

  const rowSelection = {
    hideSelectAll: true,
    selectedRowKeys,
    onChange (selectedRowKeys: Key[]) {
      setSelectedRowKeys(selectedRowKeys);
    }
  };

  const onOkHandle = async () => {
    setLoading(true);
    await onOk?.(selectedRowKeys);
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
      onClose={onClose}
      okButtonProps={{
        loading
      }}
    >
      <div className={style.clientInfo}>
        <div>客户昵称：{'李斯'}</div>
        <div className={style.externalUserid}>外部联系人id：{'12hhdgagas277812'}</div>
      </div>
      <div className={style.chatInfo}>聊天内容：{'我老婆想给孩子买个熊孩子险，想先了解一下。'}</div>
      <NgTable
        className={style.table}
        scroll={{ x: 662 }}
        columns={[{ title: '标签' }, { title: '标签值' }]}
        dataSource={list}
        rowSelection={rowSelection}
        pagination={pagination}
        paginationChange={paginationChange}
      />
    </Modal>
  );
};
export default UpdateTagModal;
