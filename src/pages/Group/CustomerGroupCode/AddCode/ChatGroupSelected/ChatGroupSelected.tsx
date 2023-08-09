import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, Table } from 'antd';
import React, { useState } from 'react';
import { getChatGroupList } from 'src/apis/group';
import { NgModal } from 'src/components';

import style from './style.module.less';
import classNames from 'classnames';

interface ChatGroupType {
  chatId: string;
  staffName: string;
}

interface ChatGroupSelectedProps {
  value?: any;
  readonly?: boolean;
  onChange?: (value: any) => void;
}
const ChatGroupSelected: React.FC<ChatGroupSelectedProps> = ({ value, onChange, readonly }) => {
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
    const res = await getChatGroupList({ ...params });
    console.log(res);
    setPagination(pagination);
    setGroupList(res.list || []);
  };

  const onRemove = (staffId: string) => {
    const filteredStaffList = selectedRows.filter((item) => item.staffId !== staffId);
    const filteredKeys = selectedRowKeys.filter((item) => item !== staffId);
    setSelectedRows(filteredStaffList);
    setSelectedRowKeys(filteredKeys);
  };

  const handleOk = () => {
    onChange?.(selectedRows);
    setVisible(false);
  };
  return (
    <>
      <div>
        {value?.map(
          (item: any, index: number) =>
            index < 5 && (
              <span key={item.staffId} style={{ display: 'inline-block' }}>
                {item.staffName}
                {index < value?.length - 1 && index < 4 ? '，' : ''}
              </span>
            )
        )}
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
                columns={[{ key: 'chatName', dataIndex: 'chatName', title: '群名称' }]}
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
                  type: 'checkbox',
                  preserveSelectedRowKeys: true,
                  selectedRowKeys: selectedRowKeys,
                  getCheckboxProps: (record: ChatGroupType) => {
                    return {
                      disabled: selectedRows.length === 5 && !selectedRowKeys.includes(record.staffId)
                    };
                  },
                  onChange (selectedRowKeys, selectedRows) {
                    setSelectedRows(selectedRows);
                    setSelectedRowKeys(selectedRowKeys);
                  }
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
                  <div key={item.chatId} className={classNames(style.checkItem, 'flex justify-between align-center')}>
                    <span>{item.staffName}</span>
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
