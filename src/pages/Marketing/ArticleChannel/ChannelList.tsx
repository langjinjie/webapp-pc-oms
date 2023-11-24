import React, { useEffect, useState } from 'react';
import { NgTable } from 'src/components';
import { tableColumnsFun, IColumn } from './config';
import { Button, message } from 'antd';
import { IPagination } from 'src/utils/interface';
import {
  requestChannelAddNotify,
  requestChannelList,
  requestChannelNotify,
  requestEditChannel
} from 'src/apis/marketing';
import AddModal, { IAddModalValues } from './AddModal';
import AddNotice, { INoticeValue } from './AddNotice';

const ChannelList: React.FC = () => {
  const [list, setList] = useState<any[]>([]);
  const [editVisible, setEditVisible] = useState(false);
  const [noticeVisible, setNoticeVisible] = useState(false);
  const [pagination, setPagination] = useState<IPagination>({ current: 1, pageSize: 10, total: 0 });
  const [currentRow, setCurrentRow] = useState<any>();
  const [loading, setLoading] = useState(true);

  // 获取列表
  const getList = async (values?: { [key: string]: any }) => {
    const { pageNumber = 1, pageSize = 10 } = values || {};
    setLoading(true);
    const res = await requestChannelList({ ...values });
    setLoading(false);
    console.log('res', res);
    if (res) {
      const { list, total } = res;
      setPagination((pagination) => ({ ...pagination, current: pageNumber, pageSize, total }));
      setList(list || []);
    } else {
      setList([
        {
          channelId: '1',
          channelName: '1',
          channelCode: '1',
          articleCnt: '1',
          articleUsedCnt: '1',
          articlePercent: '1'
        },
        {
          channelId: '2',
          channelName: '2',
          channelCode: '2',
          articleCnt: '2',
          articleUsedCnt: '2',
          articlePercent: '2'
        }
      ]);
    }
  };

  const addChannel = () => {
    setEditVisible(true);
    setCurrentRow(undefined);
  };

  const paginationOnChange = (pageNum: number, pageSize: number) => {
    const currentPage = pageSize === pagination.pageSize ? pageNum : 1;
    getList({ pageNum: currentPage, pageSize });
  };

  // 新增/编辑机构渠道
  const onOperate = (row: IColumn) => {
    setEditVisible(true);
    setCurrentRow(row);
  };

  // 关闭新增/编辑机构渠道弹框
  const addChannelOnCancel = () => {
    setEditVisible(false);
  };

  // 提交新增/编辑
  const addChannelOnOk = async (values: IAddModalValues) => {
    const res = await requestEditChannel(values);
    if (res) {
      message.success(`机构渠道${values.channelId ? '编辑' : '新增'}成功`);
      addChannelOnCancel();
    }
    return res;
  };

  // 查询机构渠道通知人
  const getChannelNotifyList = async (channelId: string) => {
    const res = await requestChannelNotify({ channelId });
    return res;
  };

  // 打开添加人弹框
  const addNotice = async (row: IColumn) => {
    const res = await getChannelNotifyList(row.channelId);
    if (!res) {
      const notifyList = [
        { staffId: 'bafd444062c548468e07737f2ee97a64', staffName: '郎金杰', userId: 'LangJinJie1' },
        { staffId: '5309a5f8e0d0f7e24c474f47d4018ad6', staffName: '孙广东', userId: 'SunGuangDong' }
      ];
      // useState放进Promise会变成同步,需要保证
      setCurrentRow({
        ...row,
        ...res,
        // SelectOrg组件接受的是一个数组,需要对数据进行格式化
        notifyList: notifyList.map((item) => ({ staff: [item] }))
      });
      setNoticeVisible(true);
    }
  };

  // 关闭添加提醒人弹框
  const addNoticeOnCancel = async () => {
    setNoticeVisible(false);
  };

  // 提交设置通知人
  const addNoticeOnOk = async (value: INoticeValue) => {
    const { channelId, notifyList } = value;
    console.log('value', value);
    // 格式化notifyList,notifyList只需要传userId的string[]
    const res = await requestChannelAddNotify({
      channelId,
      notifyList: notifyList.map(({ staff }) => staff[0].userId)
    });
    if (res) {
      message.success('通知人设置成功');
      setNoticeVisible(false);
    }
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
        loading={loading}
        dataSource={list}
        columns={tableColumnsFun({ onOperate, addNotice })}
        pagination={pagination}
        // scroll={{ x: 'max-content' }}
        paginationChange={paginationOnChange}
      />
      <AddModal value={currentRow} visible={editVisible} onClose={addChannelOnCancel} onOk={addChannelOnOk} />
      <AddNotice value={currentRow} visible={noticeVisible} onCancel={addNoticeOnCancel} onOk={addNoticeOnOk} />
    </div>
  );
};

export default ChannelList;
