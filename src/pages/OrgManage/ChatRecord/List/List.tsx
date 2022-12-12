import { PaginationProps, Divider, PageHeader, Drawer } from 'antd';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { getChatList } from 'src/apis/orgManage';
import { AuthBtn, NgFormSearch, NgTable } from 'src/components';
import { useDocumentTitle } from 'src/utils/base';
import CreateDrawer from '../Components/CreateDrawer';
import { SceneColumns, searchCols, tableColumnsFun } from './ListConfig';
import { OperateType } from 'src/utils/interface';
import ChatLog from 'src/pages/Exception/DeletionReminder/ChatLog/ChatLog';
interface SearchParamsProps {
  carNumber?: string;
  externalName?: string;
  staffIds?: string[];
  startTime?: string;
  endTime?: string;
}
const ChatRecordList: React.FC<RouteComponentProps> = () => {
  const [tableSource, setTableSource] = useState<Partial<SceneColumns>[]>([]);
  const [visible, setVisible] = useState(false);
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [chatValue, setChatValue] = useState<any>();
  const [drawerValue, setdrawerValue] = useState<any>();
  const [userId, setUserId] = useState<string>();
  const [externalUserId, setExternalUserId] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [chatProposalId, setChatProposalId] = useState<string>();
  const [queryParams, setQueryParams] = useState<SearchParamsProps>({});
  useDocumentTitle('合规管理-聊天记录查询');
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });

  const getList = async (params?: any) => {
    setLoading(true);
    const pageNum = params?.pageNum || pagination.current;
    const pageSize = params?.pageSize || pagination.pageSize;
    const res: any = await getChatList({
      ...queryParams,
      ...params,
      pageNum,
      pageSize
    });

    if (res) {
      const { list, total } = res;
      setTableSource(list || []);
      setPagination((pagination) => ({ ...pagination, total, current: pageNum, pageSize }));
    }
    setLoading(false);
  };

  useEffect(() => {
    getList();
  }, []);

  const onSearch = (values: any) => {
    const { carNumber, externalName, staffList, rangePicker } = values;
    const staffIds = staffList?.map((mapItem: { staffId: string }) => mapItem.staffId);
    let startTime: string | undefined;
    let endTime: string | undefined;
    if (rangePicker && rangePicker.length > 0) {
      startTime = rangePicker[0].startOf('days').format('YYYY-MM-DD HH:mm:ss');
      endTime = rangePicker[1].endOf('days').format('YYYY-MM-DD HH:mm:ss');
    }
    getList({ carNumber, externalName, staffIds, startTime, endTime, pageNum: 1 });
    setQueryParams((queryParams) => ({ ...queryParams, carNumber, externalName, staffIds, startTime, endTime }));
  };

  const paginationChange = (pageNum: number, pageSize?: number) => {
    getList({ pageNum, pageSize });
  };

  // 查询场景详情
  const chatDetail = async (operateType: OperateType, record: SceneColumns) => {
    if (operateType === 'view') {
      setChatProposalId(record.proposalId);
      setVisible(true);
      setChatValue({ ...record });
    } else if (operateType === 'edit') {
      setVisibleDrawer(true);
      setUserId(record.userId);
      setExternalUserId(record.externalUserId);
      setdrawerValue({ ...record });
    }
  };

  return (
    <div className={'container'}>
      <PageHeader title="聊天记录查询" style={{ padding: '0' }}></PageHeader>
      <Divider style={{ marginTop: '21px' }} />
      <AuthBtn path="/query">
        <NgFormSearch searchCols={searchCols} isInline firstRowChildCount={3} onSearch={onSearch} />
      </AuthBtn>

      <div className="mt20">
        <NgTable
          columns={tableColumnsFun({
            onOperate: chatDetail
          })}
          loading={loading}
          dataSource={tableSource}
          pagination={pagination}
          paginationChange={paginationChange}
          setRowKey={(record: SceneColumns) => {
            return record.proposalId;
          }}
        />
      </div>
      <CreateDrawer
        visible={visible}
        value={chatValue}
        chatProposalId={chatProposalId}
        onClose={() => {
          setVisible(false);
        }}
      />
      <Drawer
        width={1200}
        visible={visibleDrawer}
        onClose={() => {
          setVisibleDrawer(false);
        }}
      >
        <ChatLog userId={userId} externalUserId={externalUserId} value={drawerValue} />
      </Drawer>
    </div>
  );
};

export default ChatRecordList;
