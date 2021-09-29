import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { requestGetCorpList } from 'src/apis/OrgManage';
import { ICorpList } from 'src/utils/interface';
import style from './style.module.less';

const AccountManage: React.FC = () => {
  const [corpList, setCorpList] = useState<ICorpList[]>();
  const [isLoading, setIsloading] = useState<boolean>(false);

  // 获取企业列表
  const getCorpList = async () => {
    const res = await requestGetCorpList({});
    setCorpList(res.list);
    res && setIsloading(false);
  };

  // 表格标题
  const columns = [
    { title: '企业名称', dataIndex: 'corpName' },
    { title: '企业ID', dataIndex: 'coprId' },
    { title: '编辑', render: () => <span className={style.detail}>详情</span> }
  ];

  useEffect(() => {
    setIsloading(true);
    getCorpList();
  }, []);
  return (
    <div>
      <Table
        bordered
        loading={isLoading}
        columns={columns}
        className={style.tableWrap}
        dataSource={corpList}
        pagination={false}
        rowKey={'coprId'}
      />
    </div>
  );
};
export default AccountManage;
