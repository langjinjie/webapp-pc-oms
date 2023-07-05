import React from 'react';

import style from './style.module.less';
import OrgTreeSelect from 'src/components/OrgTreeSelect/OrgTreeSelect';
import { NgFormSearch, NgTable } from 'src/components';
import { GroupColType, searchCols, tableColsFun } from './Config';
import { Button } from 'antd';
import { RouteComponentProps } from 'react-router-dom';

const CustomerGroup: React.FC<RouteComponentProps> = ({ history }) => {
  const onSearch = (values: any) => {
    console.log(values);
  };

  const onOperate = (type: any, record: GroupColType) => {
    console.log(record);
    history.push('/customergroup/member');
  };
  return (
    <div className="container">
      <div className={style.desc}>
        客户群，是由具有客户群使用权限的成员创建的外部群。成员在手机端创建群后，自动显示在后台列表中，群聊上限人数500人，包含群主+员工+客户。
      </div>

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
          <NgTable className="mt10" columns={tableColsFun(onOperate)} dataSource={[{}]}></NgTable>
        </div>
      </div>
    </div>
  );
};

export default CustomerGroup;
