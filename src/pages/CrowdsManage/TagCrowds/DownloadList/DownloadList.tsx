import { PaginationProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { BreadCrumbs, NgFormSearch, NgTable } from 'src/components';
import { searchCols, tableColumnsFun } from './Config';

const DownloadList: React.FC<RouteComponentProps> = () => {
  const [list, setList] = useState<any[]>([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [formParam, setFormParam] = useState<{ [key: string]: any }>({});
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });
  // 获取列表
  const getList = async (values?: any) => {
    console.log('values', values);
    setTableLoading(true);
    // const res = await requestGetStaffLiveList({ ...values });
    const res = {
      total: 4,
      list: [
        {
          key1: 'D00000021',
          key2: 'G000001',
          key3: '关注慢性病',
          key4: 199,
          key5: 10,
          key6: '2022-10-01 10:01:20',
          key7: 1,
          key8: '2022-09-01 10:01:20',
          key9: '爱德华'
        },
        {
          key1: 'D00000031',
          key2: 'G000002',
          key3: '女性防癌',
          key4: 20,
          key5: '4',
          key6: '2022-10-02 14:01:12',
          key7: 1,
          key8: '2022-10-01 10:01:20',
          key9: '吴向前',
          key10: '2022-10-01 10:01:20'
        },
        {
          key1: 'D00000022',
          key2: 'G000003',
          key3: '年金收益',
          key4: 321,
          key5: '31',
          key6: '2022-09-21 16:32:23',
          key7: 1,
          key8: '2022-08-21 13:01:20',
          key9: '李爱珍',
          key10: '2022-10-01 10:01:20'
        },
        {
          key1: 'D00000003',
          key2: 'G001003',
          key3: '续保犹豫',
          key4: 108,
          key5: 9,
          key6: '2022-09-11 12:32:03',
          key7: 1,
          key8: '2022-08-01 10:00:20',
          key9: '王振',
          key10: '2022-10-01 10:01:20'
        }
      ]
    };
    if (res) {
      setList(res.list);
      // setRecordItem(undefined);
      setPagination((pagination) => ({ ...pagination, total: res.total }));
    }
    setTableLoading(false);
  };

  const onFinishHandle = (values?: any) => {
    const { expireDay, createTime, updateTime, staffId } = values;
    let beginCreateTime;
    let endCreateTime;
    let beginUpdateTime;
    let endUpdateTime;
    if (createTime) {
      beginCreateTime = createTime[0].startOf('day').format('YYYY-MM-DD HH:mm:ss');
      endCreateTime = createTime[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');
    }
    if (updateTime) {
      beginUpdateTime = updateTime[0].startOf('day').format('YYYY-MM-DD HH:mm:ss');
      endUpdateTime = updateTime[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');
    }
    if (expireDay) {
      values.expireDay = expireDay.endOf('day').format('YYYY-MM-DD HH:mm:ss');
    }
    delete values.createTime;
    delete values.updateTime;
    const param = {
      ...values,
      beginCreateTime,
      endCreateTime,
      beginUpdateTime,
      endUpdateTime,
      staffId: staffId?.[0]?.staffId
    };
    getList(param);
    setPagination((pagination) => ({ ...pagination, current: 1 }));
    setFormParam(param);
  };
  // 切换分页
  const paginationChange = (current: number, pageSize?: number) => {
    const pageNum = pageSize !== pagination.pageSize ? 1 : current;
    setPagination((pagination) => ({ ...pagination, current: pageNum, pageSize: pageSize as number }));
    getList({ ...formParam, pageNum, pageSize: pageSize as number });
  };
  // 重置
  const onResetHandle = async () => {
    getList();
    setPagination((pagination) => ({ ...pagination, current: 1, pageSize: 10 }));
    setFormParam({});
  };
  useEffect(() => {
    getList();
  }, []);

  return (
    <div className="container">
      <BreadCrumbs navList={[{ name: '标签分群', path: '/tagCrowds' }, { name: '查看人群包下载列表' }]} />
      <NgFormSearch
        className="mt20"
        isInline={false}
        firstRowChildCount={4}
        searchCols={searchCols}
        onSearch={onFinishHandle}
        onReset={onResetHandle}
      />

      <NgTable
        className="mt20"
        rowKey={'key1'}
        loading={tableLoading}
        columns={tableColumnsFun()}
        dataSource={list}
        paginationChange={paginationChange}
        pagination={pagination}
      />
    </div>
  );
};

export default DownloadList;
