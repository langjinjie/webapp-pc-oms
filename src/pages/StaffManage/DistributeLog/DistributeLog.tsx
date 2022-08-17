/**
 * @desc 在职分配
 */
import React, { useEffect, useState } from 'react';
import { PaginationProps, Tabs } from 'antd';
import { NgFormSearch, NgTable } from 'src/components';
import { clientTypeList, searchCols, StaffColumns, tableColumns, tableColumns2 } from './Config';
import { RouteComponentProps } from 'react-router-dom';

const OnJob: React.FC<RouteComponentProps> = () => {
  const [tableSource, setTableSource] = useState<Partial<StaffColumns>[]>([
    {
      key1: '李思思',
      key2: '非车险拓客组',
      key3: '齐加成',
      key4: '是',
      key5: '李志辉',
      key6: '2022-05-10 10:03',
      key7: '休假需跟进，客户继承成功后原员工无法再与客户间发起会话。客户继承成功后90天保护期内无法再次继承。'
    },
    {
      key1: '颜武晨',
      key2: '非车险拓客组',
      key3: '齐加成',
      key4: '是',
      key5: '李志辉',
      key6: '2022-05-10 10:03',
      key7: '人员异动'
    },
    {
      key1: '陶黛晓',
      key2: '非车险拓客组',
      key3: '汪福',
      key4: '是',
      key5: '李志辉',
      key6: '2022-05-10 10:03',
      key7: '长病假'
    }
  ]);
  const [activeKey, setActiveKey] = useState('key1');

  useEffect(() => {
    setTableSource([
      {
        key1: '李思思',
        key2: '非车险拓客组',
        key3: '齐加成',
        key4: '是',
        key5: '李志辉',
        key6: '2022-05-10 10:03',
        key7: '休假需跟进，客户继承成功后原员工无法再与客户间发起会话。客户继承成功后90天保护期内无法再次继承。'
      },
      {
        key1: '颜武晨',
        key2: '非车险拓客组',
        key3: '齐加成',
        key4: '是',
        key5: '李志辉',
        key6: '2022-05-10 10:03',
        key7: '人员异动'
      },
      {
        key1: '陶黛晓',
        key2: '非车险拓客组',
        key3: '汪福',
        key4: '是',
        key5: '李志辉',
        key6: '2022-05-10 10:03',
        key7: '长病假'
      }
    ]);
  }, []);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });
  const onSearch = () => {
    console.log('onSearch');
  };

  const paginationChange = (pageSize: number) => {
    console.log();
    setPagination((pagination) => ({ ...pagination, pageSize }));
  };

  const onTabsChange = (activeKey: string) => {
    console.log(activeKey);
    setActiveKey(activeKey);
    if (activeKey === 'key2') {
      setTableSource([
        {
          key1: '李心洁',
          key2: '林丹均',
          key3: '张政',
          key4: '2',
          key5: '林经理',
          key6: '2022-05-10 10:03'
        },
        {
          key1: '颜武晨',
          key2: '非车险拓客组',
          key3: '齐加成',
          key4: '1',
          key5: '李志辉',
          key6: '2022-05-10 10:03'
        },
        {
          key1: '陶黛晓',
          key2: '非车险拓客组',
          key3: '汪福',
          key4: '0',
          key5: '李志辉',
          key6: '2022-05-10 10:03'
        }
      ]);
    } else {
      setTableSource([
        {
          key1: '李思思',
          key2: '非车险拓客组',
          key3: '齐加成',
          key4: '2',
          key5: '李志辉',
          key6: '2022-05-10 10:03',
          key7: '休假需跟进，客户继承成功后原员工无法再与客户间发起会话。客户继承成功后90天保护期内无法再次继承。'
        },
        {
          key1: '颜武晨',
          key2: '非车险拓客组',
          key3: '齐加成',
          key4: '2',
          key5: '李志辉',
          key6: '2022-05-10 10:03',
          key7: '人员异动'
        },
        {
          key1: '陶黛晓',
          key2: '非车险拓客组',
          key3: '汪福',
          key4: '0',
          key5: '李志辉',
          key6: '2022-05-10 10:03',
          key7: '长病假'
        }
      ]);
    }
  };
  return (
    <div>
      <div className="pageTitle">
        <Tabs defaultActiveKey={activeKey} onChange={onTabsChange}>
          {clientTypeList.map((item) => {
            return <Tabs.TabPane tab={item.title} key={item.key}></Tabs.TabPane>;
          })}
        </Tabs>
      </div>
      <div className="container">
        <NgFormSearch searchCols={searchCols} isInline onSearch={onSearch}></NgFormSearch>

        <div className="mt20">
          <NgTable
            columns={activeKey === 'key1' ? tableColumns : tableColumns2}
            dataSource={tableSource}
            pagination={pagination}
            paginationChange={paginationChange}
            setRowKey={(record: StaffColumns) => {
              return record.key1;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default OnJob;
