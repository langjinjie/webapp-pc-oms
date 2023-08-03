import { Button, Divider, Modal, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { AuthBtn, BreadCrumbs, NgFormSearch, NgTable } from 'src/components';
import { memberColType, searchCols, tableCols } from './Config';

import style from './style.module.less';
import { MyPaginationProps } from 'src/components/TableComponent/TableComponent';
import { queryGroupMemberList, getGroupStatDetail, downloadGroupMemberList } from 'src/apis/group';
import { exportFile, urlSearchParams } from 'src/utils/base';
import { RouteComponentProps } from 'react-router-dom';

const GroupMember: React.FC<RouteComponentProps> = ({ location }) => {
  const [groupDetail, setGroupDetail] = useState({
    count: 0,
    externalCount: 0,
    yesterdayJoinCount: 0,
    groupName: '',
    staffName: '',
    outCount: 0
  });

  const [formValue, setFormValues] = useState({
    title: ''
  });
  const [pagination, setPagination] = useState<MyPaginationProps>({
    total: 0,
    pageNum: 1,
    pageSize: 10
  });
  const [dataSource, setDateSource] = useState<memberColType[]>([]);
  const getList = async (params?: any) => {
    const { id } = urlSearchParams<{ id: string }>(location.search);
    const res = await queryGroupMemberList({
      pageNum: pagination.pageNum,
      chatId: id,
      pageSize: pagination.pageSize,
      ...formValue,
      ...params
    });
    if (res) {
      const { total, list } = res;
      setPagination((pagination) => ({
        ...pagination,
        total,
        pageNum: params?.pageNum || 1,
        pageSize: params?.pageSize || pagination.pageSize
      }));
      setDateSource(list || []);
    }
  };
  const onSearch = (values: any) => {
    setFormValues(values);
    getList({ ...values, pageNum: 1 });
  };

  const getStatDetail = async () => {
    const { id } = urlSearchParams<{ id: string }>(location.search);
    const res = await getGroupStatDetail({ chatId: id });
    res && setGroupDetail(res);
  };
  useEffect(() => {
    getList();
    getStatDetail();
  }, []);

  const downloadList = () => {
    Modal.confirm({
      title: '确认导出群成员信息?',

      onOk: async () => {
        const { id } = urlSearchParams<{ id: string }>(location.search);
        const res = await downloadGroupMemberList({ ...formValue, chatId: id });

        if (res && res.headers['content-disposition']?.split('=')[1]) {
          const fileName = decodeURI(res.headers['content-disposition']?.split('=')[1]);
          exportFile(res.data, fileName.split('.')[0], fileName.split('.')[1]);
        } else {
          message.warning('导出群成员信息异常');
        }
      }
    });
  };
  return (
    <div className="container">
      <BreadCrumbs
        navList={[
          {
            name: '客户群管理'
          },
          { name: '群详情' }
        ]}
      />

      <h3 className="mt20 f20 bold">
        {groupDetail.groupName}（群主：{groupDetail.staffName}）
      </h3>
      <Divider />

      <div className={style.dataWrap}>
        <h4 className="f16 mb20">取数据</h4>
        <div className="flex">
          <dl className={style.dataItem}>
            <dt className={style.dataTitle}>群总人数</dt>
            <dd>{groupDetail.count}</dd>
          </dl>
          <dl className={style.dataItem}>
            <dt className={style.dataTitle}>外部联系人</dt>
            <dd>{groupDetail.externalCount}</dd>
          </dl>
          <dl className={style.dataItem}>
            <dt className={style.dataTitle}>昨日进群人数</dt>
            <dd>{groupDetail.yesterdayJoinCount}</dd>
          </dl>
          <dl className={style.dataItem}>
            <dt className={style.dataTitle}>退群人数</dt>
            <dd>{groupDetail.outCount}</dd>
          </dl>
        </div>
      </div>

      <div className="cell pt25">
        <div className="flex align-end">
          <div className="cell">
            <NgFormSearch searchCols={searchCols} onSearch={onSearch} />
          </div>
          <AuthBtn path="/detail/download">
            <Button className="fixed flex mb10" type="primary" shape="round" onClick={downloadList}>
              导出群成员信息
            </Button>
          </AuthBtn>
        </div>
      </div>
      <NgTable
        pagination={pagination}
        className="pt15"
        setRowKey={(record) => record.groupNickname + record.joinTime}
        loadData={getList}
        columns={tableCols}
        dataSource={dataSource}
      ></NgTable>
    </div>
  );
};

export default GroupMember;
