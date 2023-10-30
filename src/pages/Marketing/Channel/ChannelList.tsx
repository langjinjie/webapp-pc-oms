import React, { useEffect, useState } from 'react';
import { NgTable } from 'src/components';
import { tableColumnsFun } from './config';
import { Button } from 'antd';
import { IPagination } from 'src/utils/interface';
import AddModal from './AddModal';
import AddNotice from './AddNotice';

const ChannelList: React.FC = () => {
  const [list, setList] = useState<any[]>([]);
  const [editVisible, setEditVisible] = useState(false);
  const [noticeVisible, setNoticeVisible] = useState(false);
  const [pagination, setPagination] = useState<IPagination>({ current: 1, pageSize: 10, total: 0 });
  const [currentRow, setCurrentRow] = useState<any>();

  // getList
  const getList = async (values?: { [key: string]: any }) => {
    const { pageNumber = 1, pageSize = 10, ...otherValues } = values || {};
    console.log('otherValues', otherValues);
    setPagination((pagination) => ({ ...pagination, current: pageNumber, pageSize }));
    setList([{ channelId: '1' }]);
  };

  const addChannel = () => {
    setEditVisible(true);
  };

  const paginationOnChange = (pageNum: number, pageSize: number) => {
    const currentPage = pageSize === pagination.pageSize ? pageNum : 1;
    getList({ pageNum: currentPage, pageSize });
  };

  const onOperate = (row: any) => {
    console.log('操作');
    setCurrentRow(row);
    setEditVisible(true);
  };

  const addNotice = (row: any) => {
    console.log('添加提醒人');
    setCurrentRow(row);
    setNoticeVisible(true);
  };

  useEffect(() => {
    getList();
  }, []);
  return (
    <div className="container">
      <Button type="primary" shape="round" onClick={addChannel}>
        新增机构渠道
      </Button>
      <NgTable
        rowKey="channelId"
        className="mt20"
        dataSource={list}
        columns={tableColumnsFun({ onOperate, addNotice })}
        pagination={pagination}
        // scroll={{ x: 'max-content' }}
        paginationChange={paginationOnChange}
      />
      <AddModal value={currentRow} visible={editVisible} onClose={() => setEditVisible(false)} />
      <AddNotice visible={noticeVisible} onCancel={() => setNoticeVisible(false)} />
    </div>
  );
};

export default ChannelList;
