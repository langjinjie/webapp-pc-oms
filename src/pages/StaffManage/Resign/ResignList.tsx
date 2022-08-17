// 客户列表
import { Avatar, Breadcrumb, Button, Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import classNames from 'classnames';
import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import styles from './style.module.less';

const plainOptions = ['Apple', 'Pear', 'Orange', 'green'];
const StaffClineList: React.FC<RouteComponentProps> = ({ history }) => {
  const [checkedList, setCheckedList] = useState<any[]>([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setCheckedList(e.target.checked ? plainOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  const onChange = (list: any[]) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
  };
  const navigatorToList = () => {
    history.push('/resign');
  };

  return (
    <div className="container">
      <div className={'breadcrumbWrap'}>
        <span>当前位置：</span>
        <Breadcrumb>
          <Breadcrumb.Item onClick={() => navigatorToList()}>离职职分配</Breadcrumb.Item>
          <Breadcrumb.Item className="text-primary">客户列表</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      {/* <Tabs defaultActiveKey={'key1'} onChange={onTabsChange}>
        {clientTypeList.map((item) => {
          return <Tabs.TabPane tab={item.title + ` (${item.value})`} key={item.key}></Tabs.TabPane>;
        })}
      </Tabs> */}

      {/* <NgFormSearch className="mt10" searchCols={searchCols1} isInline onSearch={onSearch}></NgFormSearch> */}

      <div className="">
        <Button type="primary" shape="round" ghost>
          分配记录
        </Button>
      </div>

      <div className={classNames(styles.clientWrap, 'mt24')}>
        <div className={styles.header}>
          <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
            全选
          </Checkbox>
          *待分配客户共10位
        </div>

        <div>
          <Checkbox.Group value={checkedList} onChange={onChange}>
            <div className={styles.clientList}>
              {plainOptions.map((item) => {
                return (
                  <div key={item} className={classNames(styles.clientItem, 'flex align-center justify-between ph20')}>
                    <div>
                      <Checkbox value={item}></Checkbox>
                      <span className="ml24">
                        <Avatar src="https://joeschmoe.io/api/v1/random" />
                      </span>
                      <span className="ml6">{'李白'}</span>
                    </div>
                    <div>近3天有联系</div>
                  </div>
                );
              })}
            </div>
          </Checkbox.Group>
        </div>
      </div>
      <div className="pt40 flex justify-center ">
        <Button type="primary" shape="round" className="f16" style={{ width: '128px', height: '40px' }}>
          分配客户
        </Button>
      </div>
    </div>
  );
};

export default StaffClineList;
