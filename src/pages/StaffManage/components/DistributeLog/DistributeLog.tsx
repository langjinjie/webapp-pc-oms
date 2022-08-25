/**
 * @desc 在职分配
 */
import React, { MutableRefObject, useEffect, useState, useRef, useMemo } from 'react';
import { Tabs } from 'antd';
import { NgFormSearch, NgTable, BreadCrumbs } from 'src/components';
import { clientTypeList, searchCols, IClientAssignRecord, tableColumns } from './Config';
import { requestGetTransferClientRecord } from 'src/apis/roleMange';
import classNames from 'classnames';

interface IDistributeLogProps {
  distributeLisType: 1 | 2; // 1: 在职继承 2: 离职继承
}

const DistributeLog: React.FC<IDistributeLogProps> = ({ distributeLisType }) => {
  const [activeKey, setActiveKey] = useState(distributeLisType.toString());
  const [formValue, setFormValue] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(false);
  const [tableSource, setTableSource] = useState<{ total: number; list: IClientAssignRecord[] }>({
    total: 0,
    list: []
  });
  const [pagination, setPagination] = useState<{ pageNum: number; pageSize: number }>({
    pageNum: 1,
    pageSize: 10
  });

  const searchRef: MutableRefObject<any> = useRef(null);

  // 获取记录
  const getRecordList = async (param?: { [key: string]: any }) => {
    setLoading(true);
    const res = await requestGetTransferClientRecord({ queryType: activeKey, ...param });
    if (res) {
      const { total, list } = res;
      setTableSource({ total, list: list });
    }
    setLoading(false);
  };

  // 搜索
  const onSearch = (values: { [key: string]: any }) => {
    const { clientName, staffList, transferStatus } = values || {};
    setFormValue({
      clientName,
      staffList: staffList?.map(({ staffId }: { staffId: string }) => staffId),
      transferStatus
    });
    getRecordList({
      clientName,
      staffList: staffList?.map(({ staffId }: { staffId: string }) => staffId),
      transferStatus
    });
  };

  // 重置
  const onResetHandle = () => {
    setPagination({ pageNum: 1, pageSize: 10 });
    setFormValue({});
    getRecordList({});
  };

  // 分页
  const paginationChange = (pageNum: number, pageSize?: number) => {
    setPagination((pagination) => ({ ...pagination, pageNum, pageSize: pageSize as number }));
    getRecordList(formValue);
  };

  // 切换记录类型 : 离职/在职
  const onTabsChange = (activeKey: string) => {
    searchRef.current.handleReset();
    setActiveKey(activeKey);
    setPagination({ pageNum: 1, pageSize: 10 });
    setFormValue({});
    getRecordList({ queryType: activeKey });
  };

  const navList = useMemo(() => {
    return [{ name: distributeLisType === 1 ? '在职分配' : '离职分配' }, { name: '分配记录' }];
  }, []);

  useEffect(() => {
    getRecordList();
  }, []);
  return (
    <div>
      <div className={classNames('ml10', 'pt10', 'pageTitle')}>
        <BreadCrumbs navList={navList} />
        <Tabs defaultActiveKey={activeKey} onChange={onTabsChange}>
          {clientTypeList.map((item) => {
            return <Tabs.TabPane tab={item.title} key={item.key}></Tabs.TabPane>;
          })}
        </Tabs>
      </div>
      <div className="container">
        <NgFormSearch
          searchRef={searchRef}
          defaultValues={formValue}
          searchCols={searchCols}
          isInline
          onSearch={onSearch}
          onReset={onResetHandle}
        />

        <div className="mt20">
          <NgTable
            columns={tableColumns}
            loading={loading}
            dataSource={tableSource.list}
            pagination={{
              current: pagination.pageNum,
              pageSize: pagination.pageSize,
              total: tableSource.total
            }}
            paginationChange={paginationChange}
            setRowKey={(record: IClientAssignRecord) => {
              return record.externalUserid + '-' + record.handoverStaffId + '-' + record.takeoverStaffId;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DistributeLog;
