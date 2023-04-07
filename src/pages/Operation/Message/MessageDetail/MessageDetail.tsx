import { Button, Divider, Input, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { getMassDetail, getMassWithMember } from 'src/apis/marquee';
import { BreadCrumbs, Preview } from 'src/components';
import NewTableComponent, { MyPaginationProps } from 'src/components/TableComponent/NewTableComponent';
import { urlSearchParams } from 'src/utils/base';
import style from './style.module.less';

const MessageDetail: React.FC<RouteComponentProps> = ({ location }) => {
  const [massDetail, setMassDetail] = useState<{ batchId: string; batchNo: string; [prop: string]: any }>();
  const [pageInfo, setPageInfo] = useState({
    clientAll: false,
    queryType: 1
  });
  const [inputValue, setInputValue] = useState<string>();
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [pagination, setPagination] = useState<MyPaginationProps>({
    total: 0,
    pageNum: 1,
    pageSize: 10,
    simple: true
  });
  const getDetail = async () => {
    const { id } = urlSearchParams<{ id: string }>(location.search);

    const res = await getMassDetail({ batchId: id });

    res && setMassDetail(res);
  };

  const getMemberList = async (params?: any) => {
    const { id } = urlSearchParams<{ id: string }>(location.search);
    const res = await getMassWithMember({
      batchId: id,
      queryType: pageInfo.queryType,
      name: inputValue || '',
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      ...params
    });
    if (res) {
      setPageInfo((pageInfo) => ({ ...pageInfo, clientAll: res.clientAll }));
      setDataSource(res.list);
      setPagination((pagination) => ({ ...pagination, total: res.total, pageNum: params?.pageNum || 1 }));
    }
  };
  useEffect(() => {
    getDetail();
    getMemberList();
  }, []);

  const onTabsChange = async (activeKey: string) => {
    setDataSource([]);
    setInputValue('');
    setPageInfo((pageInfo) => ({ ...pageInfo, queryType: +activeKey }));
    await getMemberList({ queryType: +activeKey, pageNum: 1, name: '' });
  };

  const onPressEnter = (target: any) => {
    const inputVal = target.value;
    setInputValue(inputVal);
    setPageInfo((pageInfo) => ({ ...pageInfo, name: inputVal }));
    getMemberList({ name: inputVal, pageNum: 1 });
  };
  return (
    <div className="container">
      <BreadCrumbs
        navList={[
          {
            name: '群发停用',
            path: '/messagestop'
          },
          { name: '群发详情' }
        ]}
      />

      <div className="mt40">
        <h3>
          <span className="f18">群发编码</span> <Divider type="vertical" />
          <span className="color-text-secondary">{massDetail?.batchNo}</span>
        </h3>
        <Divider></Divider>

        <div className="flex">
          <Tabs defaultActiveKey="1" className={style.tabsWrap} onChange={onTabsChange}>
            <Tabs.TabPane tab="客户经理" key="1">
              {pageInfo.clientAll
                ? (
                <div className="color-danger">此群发消息选择的为全部员工，可到组织架构查看所有人员</div>
                  )
                : (
                <>
                  <div className="mb20">
                    客户经理：
                    <Input
                      value={inputValue}
                      className="width160"
                      placeholder="请输入"
                      onChange={(e) => setInputValue(e.target.value)}
                      allowClear
                      onPressEnter={(e) => onPressEnter(e.target)}
                    />
                  </div>
                  <NewTableComponent
                    loadData={getMemberList}
                    scroll={{ x: 'auto' }}
                    dataSource={dataSource}
                    rowKey={'memberId'}
                    pagination={pagination}
                    columns={[
                      { title: '客户经理企微', key: 'memberId', dataIndex: 'memberId' },
                      { title: '客户经理', key: 'memberName', dataIndex: 'memberName' },
                      { title: '组织架构', key: 'deptFullName', dataIndex: 'deptFullName' }
                    ]}
                  ></NewTableComponent>
                </>
                  )}
            </Tabs.TabPane>
            <Tabs.TabPane tab="客户" key="2">
              {pageInfo.clientAll
                ? (
                <div className="color-danger">此群发消息选择的为所有客户，可到客户信息功能内查看所有人员</div>
                  )
                : (
                <>
                  <div className="mb20">
                    客户：
                    <Input
                      className="width160"
                      placeholder="请输入"
                      allowClear
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onPressEnter={(e) => onPressEnter(e.target)}
                    />
                  </div>
                  <NewTableComponent
                    scroll={{ x: 'auto' }}
                    dataSource={dataSource}
                    rowKey={'memberId'}
                    loadData={getMemberList}
                    columns={[
                      { title: '外部联系人ID', key: 'memberId', dataIndex: 'memberId' },
                      { title: '客户昵称', key: 'key2', dataIndex: 'memberName' }
                    ]}
                  />
                </>
                  )}
            </Tabs.TabPane>
          </Tabs>
          <div className="ml50">
            <div>群发内容</div>
            <Preview
              value={{
                speechcraft: massDetail?.speechcraft,
                pushTime: massDetail?.pushTime,
                actionRule: {
                  contentType: massDetail?.contentype, // 动作规则类型: 1-文章、2-海报、3-产品、4-活动、5-销售宝典话术
                  itemIds: massDetail?.itemIds || []
                }
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center mt40">
        <Button
          className="width112"
          style={{ width: '112px' }}
          onClick={() => history.go(-1)}
          type="primary"
          shape="round"
        >
          关闭
        </Button>
      </div>
    </div>
  );
};

export default MessageDetail;
