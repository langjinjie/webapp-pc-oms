import React, { useEffect, useState } from 'react';

import OrgTreeSelect from 'src/components/OrgTreeSelect/OrgTreeSelect';
import { NgFormSearch, NgTable } from 'src/components';
import { GroupColType, searchCols, tableColsFun } from './Config';
import { Button, Modal, message } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import { MyPaginationProps } from 'src/components/TableComponent/TableComponent';
import { downloadGroupList, queryGroupList } from 'src/apis/group';
import { exportFile } from 'src/utils/base';

const CustomerGroup: React.FC<RouteComponentProps> = ({ history }) => {
  const [deptId, setDeptId] = useState<string>();
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
      deptId,
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
    history.push('/customergroup/member?id=' + record.chatId);
  };

  const downloadList = () => {
    Modal.confirm({
      title: '确认导出群信息?',

      onOk: async () => {
        const res = await downloadGroupList(formValue);
        console.log(res);

        if (res && res.headers['content-disposition']?.split('=')[1]) {
          const fileName = decodeURI(res.headers['content-disposition']?.split('=')[1]);
          exportFile(res.data, fileName.split('.')[0], fileName.split('.')[1]);
        } else {
          message.warning('导出群信息异常');
        }
      }
    });
  };

  const onOrgTreeChange = (val: any) => {
    console.log(val);
    setDeptId(val.deptId);
  };
  return (
    <div className="container">
      {/* <div className={style.desc}>
        客户群，是由具有客户群使用权限的成员创建的外部群。成员在手机端创建群后，自动显示在后台列表中，群聊上限人数500人，包含群主+员工+客户。
      </div> */}

      <div className="pt20 flex">
        <OrgTreeSelect onChange={onOrgTreeChange} selectedKey={deptId} />
        <div className="container cell ml20">
          <div className="flex align-end">
            <div className="cell">
              <NgFormSearch
                isInline={false}
                firstRowChildCount={3}
                searchCols={searchCols}
                onSearch={onSearch}
                onReset={(values) => {
                  onSearch({ deptId: undefined, ...values });
                  setDeptId(undefined);
                }}
              />
            </div>
            <Button className="fixed flex mb10" type="primary" shape="round" onClick={() => downloadList()}>
              导出群信息
            </Button>
          </div>
          <NgTable
            rowKey="chatId"
            className="mt10"
            loadData={getList}
            columns={tableColsFun(onOperate)}
            dataSource={dataSource}
            pagination={pagination}
          ></NgTable>
        </div>
      </div>
    </div>
  );
};

export default CustomerGroup;
