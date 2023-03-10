import { Button, PaginationProps, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { NgFormSearch, NgTable } from 'src/components';
import { OperateType } from 'src/utils/interface';
import { searchCols, tableColumnsFun } from './Config';

const TagGroupList: React.FC<RouteComponentProps> = ({ history }) => {
  const [list, setList] = useState<any[]>([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [formParam, setFormParam] = useState<{ [key: string]: any }>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0
  });
  // 获取列表
  const getList = async (values?: any) => {
    console.log('values', values);
    setTableLoading(true);
    // const res = await requestGetStaffLiveList({ ...values });
    const res = {
      total: 134,
      list: [
        {
          key1: '00001',
          key2: '关注慢性病',
          key3: 1,
          key4: 1,
          key5: '2022-10-20 16:11:12',
          key6: '孙思瑶',
          key7: 1,
          key8: 450,
          key9: 10,
          key10: '2022-10-20 16:15:31'
        },
        {
          key1: '00002',
          key2: '有老人',
          key3: 2,
          key4: 2,
          key5: '2022-10-20 14:31:12',
          key6: '吴桐',
          key7: 1,
          key8: 450,
          key9: 10,
          key10: '2022-10-20 14:31:12'
        },
        {
          key1: '00003',
          key2: '有子女',
          key3: 1,
          key4: 3,
          key5: '2022-10-20 14:11:45',
          key6: '吴桐',
          key7: 1,
          key8: 450,
          key9: 10,
          key10: '2022-10-01 10:01:20'
        },
        {
          key1: '00004',
          key2: '女性防癌',
          key3: 1,
          key4: 1,
          key5: '2022-10-19 09:40:46',
          key6: '吴桐',
          key7: 1,
          key8: 450,
          key9: 10,
          key10: '2022-10-19 09:40:46'
        },
        {
          key1: '00005',
          key2: '年金收益',
          key3: 1,
          key4: 1,
          key5: '2022-10-18 16:40:46',
          key6: '吴桐',
          key7: 1,
          key8: 450,
          key9: 10,
          key10: '2022-10-18 16:40:46'
        },
        {
          key1: '00006',
          key2: '续保犹豫',
          key3: 1,
          key4: 1,
          key5: '2022-10-17 13:40:22',
          key6: '吴桐',
          key7: 1,
          key8: 450,
          key9: 10,
          key10: '2022-10-17 13:40:22'
        },
        {
          key1: '00007',
          key2: '转保风险高',
          key3: 1,
          key4: 1,
          key5: '2022-10-17 10:40:00',
          key6: '吴桐',
          key7: 1,
          key8: 450,
          key9: 10,
          key10: '2022-10-17 10:40:00'
        },
        {
          key1: '00008',
          key2: '出险理赔群',
          key3: 1,
          key4: 1,
          key5: '2022-10-17 09:42:03',
          key6: '吴桐',
          key7: 1,
          key8: 450,
          key9: 10,
          key10: '2022-10-17 09:44:37'
        }
      ]
    };
    if (res) {
      setList(res.list);
      setSelectedRowKeys([]);
      // setRecordItem(undefined);
      setPagination((pagination) => ({ ...pagination, total: res.total }));
    }
    setTableLoading(false);
  };
  // 重置
  const onResetHandle = async () => {
    await getList();
    setPagination((pagination) => ({ ...pagination, current: 1, pageSize: 10 }));
    setFormParam({});
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

  // 创建分群
  const createGroup = () => {
    history.push('/tagCrowds/create');
  };

  // 切换分页
  const paginationChange = (current: number, pageSize?: number) => {
    const pageNum = pageSize !== pagination.pageSize ? 1 : current;
    setPagination((pagination) => ({ ...pagination, current: pageNum, pageSize: pageSize as number }));
    getList({ ...formParam, pageNum, pageSize: pageSize as number });
  };

  // 表格RowSelection配置项
  const rowSelection = {
    hideSelectAll: false,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      console.log(selectedRowKeys, selectedRows);
      setSelectedRowKeys(selectedRowKeys);
    },
    getCheckboxProps: (record: any) => {
      return {
        disabled: false,
        name: record.title
      };
    }
  };

  const navigatorToDownload = () => {
    history.push('/tagCrowds/download');
  };

  const onOperation = (type: OperateType) => {
    if (type === 'view') {
      history.push('/tagCrowds/detail');
    }
  };
  useEffect(() => {
    getList();
  }, []);
  return (
    <div className="container">
      <NgFormSearch
        isInline={false}
        firstRowChildCount={4}
        searchCols={searchCols}
        onSearch={onFinishHandle}
        onReset={onResetHandle}
      />
      <Space size={20}>
        <Button className="mt10 mb20" type="primary" shape="round" onClick={createGroup}>
          创建分群
        </Button>
        <Button className="mt10 mb20" type="primary" shape="round" onClick={navigatorToDownload}>
          查看人群包下载列表
        </Button>
      </Space>
      <NgTable
        rowKey={'key1'}
        columns={tableColumnsFun(onOperation)}
        dataSource={list}
        pagination={pagination}
        paginationChange={paginationChange}
        loading={tableLoading}
        rowSelection={rowSelection}
      />
      <div className={'operationWrap'}>
        <Button type="primary" ghost shape="round" disabled={selectedRowKeys.length === 0}>
          批量删除
        </Button>
      </div>
    </div>
  );
};

export default TagGroupList;
