/**
 * @description 选择群主
 */
import React, { useEffect, useState } from 'react';
import { Button, Input, Table } from 'antd';
import { NgModal, OrgTreeSelect } from 'src/components';
import { queryGroupList } from 'src/apis/group';
import style from './style.module.less';
import classNames from 'classnames';
import { UNKNOWN } from 'src/utils/base';

interface IGroupChatItem {
  chatId: string;
  groupName: string;
}

interface SetGroupChatProps {
  readonly?: boolean;
  value?: any;
  onChange?: (value: any) => void;
  title?: string;
  className?: string;
}
const SetGroupChat: React.FC<SetGroupChatProps> = ({ value, onChange, readonly, title, className }) => {
  const [visible, setVisible] = useState(false);
  const [queryValues, setQueryValues] = useState({
    isGroupOwner: 1,
    deptType: 0,
    queryType: 1,
    isDeleted: 0,
    chatName: '',
    deptId: ''
  });
  const [staffList, setStaffList] = useState<IGroupChatItem[]>([]);
  const [selectedStaffList, setSelectedStaffList] = useState<IGroupChatItem[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [pagination, setPagination] = useState({
    pageNum: 1,
    pageSize: 10,
    total: 0
  });

  const getStaffGroupOwner = async (params?: any) => {
    const pageNum = params?.pageNum || pagination.pageNum;
    const res = await queryGroupList({
      ...queryValues,
      ...params,
      pageNum
    });
    if (res) {
      const { list, total } = res;
      setPagination((pagination) => ({ ...pagination, total, pageNum }));
      setStaffList(list);
    }
  };

  const onRemove = (chatId: string) => {
    const filteredStaffList = selectedStaffList.filter((item) => item.chatId !== chatId);
    const filteredKeys = selectedRowKeys.filter((item) => item !== chatId);
    setSelectedStaffList(filteredStaffList);
    setSelectedRowKeys(filteredKeys);
  };

  const handleOk = () => {
    onChange?.(selectedStaffList);
    setVisible(false);
  };

  useEffect(() => {
    getStaffGroupOwner();
  }, []);

  return (
    <div>
      <NgModal
        className={style.modalWrap}
        visible={visible}
        title={title || '选择群'}
        width={960}
        onCancel={() => setVisible(false)}
        onOk={() => handleOk()}
      >
        <div className={style.colWrap}>
          <h4 className={style.panelHeader}>部门列表</h4>
          <OrgTreeSelect
            className="ml20"
            onChange={({ deptId }) => {
              setQueryValues((queryValues) => ({ ...queryValues, deptId, chatName: '' }));
              getStaffGroupOwner({ deptId, chatName: '', pageNum: 1 });
            }}
          />
        </div>
        <div className={style.colWrap}>
          <h4 className={style.panelHeader}>
            <span>群聊列表</span>
            <span className="f12 float-right">共{pagination.total}个</span>
          </h4>
          <div className={style.staffList}>
            <Input.Search
              value={queryValues.chatName}
              placeholder="请输入群名称"
              onChange={(value) => setQueryValues((queryValues) => ({ ...queryValues, chatName: value.target.value }))}
              onSearch={(val) => getStaffGroupOwner({ chatName: val })}
            />
            <div className={classNames('mt22')}>
              <Table
                columns={[
                  {
                    dataIndex: 'groupName',
                    title: '群名称',
                    render (groupName: string) {
                      return <>{groupName || UNKNOWN}</>;
                    },
                    ellipsis: true,
                    width: 240
                  }
                ]}
                rowKey="chatId"
                pagination={{
                  current: pagination.pageNum,
                  pageSize: pagination.pageSize,
                  total: pagination.total,
                  position: ['bottomRight'],
                  simple: true,
                  onChange: (pageNum) => {
                    getStaffGroupOwner({ pageNum });
                  }
                }}
                dataSource={staffList}
                rowSelection={{
                  type: 'checkbox',
                  preserveSelectedRowKeys: true,
                  selectedRowKeys: selectedRowKeys,
                  onChange (selectedRowKeys, selectedRows) {
                    setSelectedStaffList(selectedRows);
                    setSelectedRowKeys(selectedRowKeys);
                  }
                }}
                scroll={{
                  x: 280
                }}
              />
            </div>
          </div>
        </div>
        <div className={classNames(style.colWrap)}>
          <h4 className={classNames(style.panelHeader, 'color-text-regular')}>
            已选群聊
            <span className="f12 float-right">共{selectedRowKeys.length}个</span>
          </h4>
          <div className="ph20">
            <div className={classNames(style.colTitle, 'flex justify-between color-text-regular')}>
              <span>群名称</span>
              <span>操作</span>
            </div>
            <div className={classNames(style.staffWrap)}>
              {selectedStaffList.map((item) => (
                <div key={item.chatId} className={classNames(style.checkItem, 'flex justify-between align-center')}>
                  <span className={classNames(style.groupName, 'ellipsis')} title={item.groupName}>
                    {item.groupName}
                  </span>
                  <Button type="link" onClick={() => onRemove(item.chatId)}>
                    删除
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </NgModal>
      <div className={className}>
        {value?.map(
          (item: IGroupChatItem, index: number) =>
            index < 5 && (
              <span key={item.chatId} style={{ display: 'inline-block' }}>
                {item.groupName}
                {index < value?.length - 1 && index < 4 ? '，' : ''}
              </span>
            )
        )}
        {value?.length > 5 && ' ...... '}
        {!!value?.length && <span className="mr20"> 共{value?.length || 0}个群聊</span>}
        <Button type="primary" ghost shape="round" disabled={readonly} onClick={() => setVisible(true)}>
          请选择群
        </Button>
      </div>
    </div>
  );
};

export default SetGroupChat;
