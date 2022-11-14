import { PaginationProps, Divider, PageHeader } from 'antd';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
// import { getChatList,getChatDetail } from 'src/apis/orgManage';
import { getSceneList } from 'src/apis/task';
import { AuthBtn, NgFormSearch, NgTable } from 'src/components';
import { useDocumentTitle } from 'src/utils/base';
import CreateDrawer from '../Components/CreateDrawer';
import { SceneColumns, searchCols, tableColumnsFun } from './ListConfig';
const ChatRecordList: React.FC<RouteComponentProps> = () => {
  const [tableSource, setTableSource] = useState<Partial<SceneColumns>[]>([]);
  const [visible, setVisible] = useState(false);
  const [chatValue, setChatValue] = useState<any>();
  const [queryParams, setQueryParams] = useState<any>();
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
    console.log(params, '-------------------params');
    const pageNum = params?.pageNum || pagination.current;
    const pageSize = params?.pageSize || pagination.pageSize;
    // const res = await getChatList({ getSceneList
    const res = await getSceneList({
      ...queryParams,
      ...params,
      pageNum,
      pageSize
    });
    console.log(res, '-------------res');
    if (res) {
      const { list, total } = res;
      setTableSource(list || []);
      setPagination((pagination) => ({ ...pagination, total, current: pageNum, pageSize }));
    }
  };

  useEffect(() => {
    getList();
  }, []);

  const onSearch = (values: any) => {
    const { carNumber = '', externalName = '', staffId = '', rangePicker = '' } = values;
    let startTime = '';
    let endTime = '';
    if (rangePicker && rangePicker.length > 0) {
      startTime = rangePicker[0].format('YYYY-MM-DD');
      endTime = rangePicker[1].format('YYYY-MM-DD');
    }
    getList({ carNumber, externalName, staffId, startTime, endTime, pageNum: 1 });
    setQueryParams({ carNumber, externalName, staffId, startTime, endTime });
  };

  const onValuesChange = (changeValues: any, values: any) => {
    setQueryParams(values);
  };

  const paginationChange = (pageNum: number, pageSize?: number) => {
    getList({ pageNum, pageSize });
  };

  // 查询场景详情
  const chatDetail = async (sceneId: string) => {
    console.log(sceneId, '---------------record');
    // const res = await getChatDetail({ proposalId: record.proposalId });
    setVisible(true);
    // setChatValue({ ...record, retdata: res });
    setChatValue(sceneId);
  };

  return (
    <div className={'container'}>
      <PageHeader title="聊天记查询" style={{ padding: '0' }}></PageHeader>
      <Divider style={{ marginTop: '21px' }} />
      <AuthBtn path="/query">
        <NgFormSearch
          searchCols={searchCols}
          isInline
          firstRowChildCount={3}
          onSearch={onSearch}
          onValuesChange={onValuesChange}
        />
      </AuthBtn>

      <div className="mt20">
        <NgTable
          columns={tableColumnsFun({
            onOperate: chatDetail
          })}
          dataSource={tableSource}
          pagination={pagination}
          paginationChange={paginationChange}
          setRowKey={(record: SceneColumns) => {
            // return record.proposalId;
            return record.sceneId;
          }}
        />
      </div>
      <CreateDrawer
        visible={visible}
        value={chatValue}
        onClose={() => {
          setVisible(false);
        }}
      />
    </div>
  );
};

export default ChatRecordList;
