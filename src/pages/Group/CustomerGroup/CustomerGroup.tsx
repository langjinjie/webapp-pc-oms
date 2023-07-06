import React, { useEffect, useState } from 'react';

import OrgTreeSelect from 'src/components/OrgTreeSelect/OrgTreeSelect';
import { NgFormSearch, NgTable } from 'src/components';
import { GroupColType, searchCols, tableColsFun } from './Config';
import { Button } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import { MyPaginationProps } from 'src/components/TableComponent/TableComponent';
import { queryGroupList } from 'src/apis/group';

const CustomerGroup: React.FC<RouteComponentProps> = ({ history }) => {
  const [formValue, setFormValues] = useState({
    title: ''
  });
  const [pagination, setPagination] = useState<MyPaginationProps>({
    total: 0,
    pageNum: 1,
    pageSize: 10
  });
  const [dataSource, setDateSource] = useState<GroupColType[]>([]);
  const getList = async (params?: any) => {
    const res = await queryGroupList({
      pageNum: pagination.pageNum,
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

  useEffect(() => {
    getList();
  }, []);

  const onOperate = (type: any, record: GroupColType) => {
    console.log(record);
    history.push('/customergroup/member');
  };
  return (
    <div className="container">
      {/* <div className={style.desc}>
        客户群，是由具有客户群使用权限的成员创建的外部群。成员在手机端创建群后，自动显示在后台列表中，群聊上限人数500人，包含群主+员工+客户。
      </div> */}

      <div className="pt20 flex">
        <OrgTreeSelect />
        <div className="container cell ml20">
          <div className="flex align-end">
            <div className="cell">
              <NgFormSearch isInline={false} firstRowChildCount={3} searchCols={searchCols} onSearch={onSearch} />
            </div>
            <Button className="fixed flex mb10" type="primary" shape="round">
              导出群信息
            </Button>
          </div>
          <NgTable
            rowKey="chatId"
            className="mt10"
            loadData={getList}
            columns={tableColsFun(onOperate)}
            dataSource={dataSource}
          ></NgTable>
        </div>
      </div>
    </div>
  );
};

export default CustomerGroup;
