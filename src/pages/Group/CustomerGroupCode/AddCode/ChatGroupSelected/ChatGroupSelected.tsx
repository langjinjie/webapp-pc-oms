import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Tag } from 'antd';
import React, { Key, useEffect, useState } from 'react';
import { getChatGroupList } from 'src/apis/group';
import { NgModal } from 'src/components';

import style from './style.module.less';
import classNames from 'classnames';

interface ChatGroupType {
  chatId: string;
  chatName: string;
}

interface ChatGroupSelectedProps {
  value?: any;
  readonly?: boolean;
  max?: number;
  onChange?: (value: any) => void;
}
const ChatGroupSelected: React.FC<ChatGroupSelectedProps> = ({ value, onChange, readonly, max = 5 }) => {
  const [visible, setVisible] = useState(false);
  const [queryValues, setQueryValues] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<ChatGroupType[]>([]);
  const [groupList, setGroupList] = useState<ChatGroupType[]>([]);
  const [pagination, setPagination] = useState({
    pageNum: 1,
    pageSize: 10,
    total: 0
  });
  const getList = async (params?: any) => {
    const res = await getChatGroupList({ ...params, name: queryValues });
    if (res) {
      const { list, total } = res;
      setPagination((pagination) => ({ ...pagination, total, pageNum: params?.pageNum || 1 }));
      setGroupList(list || []);
    }
  };

  const onRemove = (chatId: string) => {
    const filteredStaffList = selectedRows.filter((item) => item.chatId !== chatId);
    const filteredKeys = selectedRowKeys.filter((item) => item !== chatId);
    setSelectedRows(filteredStaffList);
    setSelectedRowKeys(filteredKeys);
  };

  const handleOk = () => {
    onChange?.(selectedRows);
    setVisible(false);
  };

  useEffect(() => {
    if (visible) {
      getList();
      value && setSelectedRowKeys(value?.map((item: ChatGroupType) => item.chatId));
      value && setSelectedRows(value);
    }
  }, [visible]);

  const onSelectionChange = (selectedRowKeys: Key[], selectedRows: (ChatGroupType | undefined)[]) => {
    setSelectedRowKeys(selectedRowKeys);

    const res = selectedRows.map((item, index) => {
      if (!item) {
        item = value.find((originValue: ChatGroupType) => originValue.chatId === selectedRowKeys[index]);
      }
      return item;
    });

    setSelectedRows(res as ChatGroupType[]);
  };
  return (
    <>
      <div>
        <Space className="mr10 mb10" wrap>
          {value?.map(
            (item: any, index: number) =>
              index < 5 && (
                <Tag key={item.chatId} style={{ display: 'inline-block' }}>
                  {item.chatName || item.chatId}
                </Tag>
              )
          )}
        </Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          disabled={readonly}
          ghost
          shape="round"
          onClick={() => setVisible(true)}
        >
          选择客户群
        </Button>
      </div>
      <NgModal
        width={800}
        visible={visible}
        title="请选择客户群"
        onOk={() => handleOk()}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <div className="flex">
          <div className={classNames(style.staffList, 'cell mr20')}>
            <Input.Search
              value={queryValues}
              placeholder="请输入群名称"
              onChange={(value) => setQueryValues(value.target.value)}
              onSearch={(val) => {
                getList({ name: val });
              }}
            ></Input.Search>
            <div className={'mt10'}>
              <Table
                size="small"
                columns={[
                  {
                    key: 'chatName',
                    dataIndex: 'chatName',
                    title: '群名称',
                    render: (value, record) => value || record.chatId
                  }
                ]}
                rowKey={'chatId'}
                pagination={{
                  current: pagination.pageNum,
                  pageSize: pagination.pageSize,
                  total: pagination.total,
                  position: ['bottomRight'],
                  simple: true,
                  onChange: (pageNum) => {
                    getList({ pageNum });
                  }
                }}
                dataSource={groupList}
                rowSelection={{
                  hideSelectAll: true,
                  type: 'checkbox',
                  preserveSelectedRowKeys: true,
                  selectedRowKeys: selectedRowKeys,
                  getCheckboxProps: (record: ChatGroupType) => {
                    return {
                      disabled: selectedRows.length >= max && !selectedRowKeys.includes(record.chatId)
                    };
                  },
                  onChange: onSelectionChange
                }}
              ></Table>
            </div>
          </div>

          <div className={classNames(style.colWrap, 'cell')}>
            <h4 className={style.panelHeader}>已选择了{selectedRowKeys.length}个群聊</h4>
            <div className="ph20 ">
              <div className={classNames(style.colTitle, 'flex justify-between color-text-regular')}>
                <span>群名称</span>
                <span>操作</span>
              </div>
              <div className={classNames(style.staffWrap)}>
                {selectedRows.map((item) => (
                  <div key={item?.chatId} className={classNames(style.checkItem, 'flex justify-between align-center')}>
                    <span className="cell ellipsis">{item?.chatName || item?.chatId}</span>
                    <Button type="link" onClick={() => onRemove(item.chatId)}>
                      删除
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </NgModal>
    </>
  );
};

export default ChatGroupSelected;
