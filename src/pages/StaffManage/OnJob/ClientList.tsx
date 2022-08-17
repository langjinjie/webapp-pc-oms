// 客户列表
import { Avatar, Breadcrumb, Button, Checkbox, Tabs } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import classNames from 'classnames';
import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { NgFormSearch } from 'src/components';
import { clientTypeList, searchCols1 } from './Config';

import styles from './style.module.less';

const plainOptions: any = [];
const StaffClineList: React.FC<RouteComponentProps> = ({ history }) => {
  const [checkedList, setCheckedList] = useState<any[]>([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [list, setList] = useState<any[]>(plainOptions);
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
    history.push('/onjob');
  };

  const onTabsChange = (activeKey: string) => {
    const count = clientTypeList.filter((item) => item.key === activeKey)[0].value;
    console.log(count);
    if (count === 8) {
      const res = plainOptions.slice(4, 11);
      return setList(res);
    }
    setList(plainOptions.slice(0, count));
  };

  const onSearch = () => {
    console.log('');
  };
  return (
    <div className="container">
      <div className={'breadcrumbWrap'}>
        <span>当前位置：</span>
        <Breadcrumb>
          <Breadcrumb.Item onClick={() => navigatorToList()}>在职分配</Breadcrumb.Item>
          <Breadcrumb.Item className="text-primary">客户列表</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <Tabs defaultActiveKey={'key1'} onChange={onTabsChange}>
        {clientTypeList.map((item) => {
          return <Tabs.TabPane tab={item.title + ` (${item.value})`} key={item.key}></Tabs.TabPane>;
        })}
      </Tabs>

      <NgFormSearch className="mt10" searchCols={searchCols1} isInline onSearch={onSearch}></NgFormSearch>

      <div className="mt20">
        <Button type="primary" shape="round" ghost onClick={() => history.push('/distributelog')}>
          分配记录
        </Button>
      </div>

      <div className={classNames(styles.clientWrap, 'mt24')}>
        <div className={styles.header}>
          <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
            全选
          </Checkbox>
          *待分配客户共109位
        </div>

        <div>
          <Checkbox.Group value={checkedList} onChange={onChange}>
            <div className={styles.clientList}>
              {list.map((item) => {
                return (
                  <div
                    key={item.id}
                    className={classNames(styles.clientItem, 'flex align-center justify-between ph20')}
                  >
                    <div>
                      <Checkbox value={item}></Checkbox>
                      <span className="ml24">
                        <Avatar src={item.pic} />
                      </span>
                      <span className="ml6">{item.name}</span>
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
