import React, { useEffect, useState } from 'react';
import { Button, PaginationProps, Space } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import { NgFormSearch, NgTable } from 'src/components';
import { searchCols, tableColumnsFun } from './Config';
import { requestGetPackageList } from 'src/apis/CrowdsManage';

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
    const res = await requestGetPackageList({ ...values });
    console.log('res', res);
    const res1 = {
      total: 134,
      list: [
        {
          packageId: '00001',
          packageName: '关注慢性病',
          refreshType: 1,
          computeStatus: 1,
          createTime: '2022-10-20 16:11:12',
          opName: '孙思瑶',
          runStatus: 1,
          clientNum: 450,
          staffNum: 10,
          updateTime: '2022-10-20 16:15:31'
        },
        {
          packageId: '00002',
          packageName: '有老人',
          refreshType: 2,
          computeStatus: 2,
          createTime: '2022-10-20 14:31:12',
          opName: '吴桐',
          runStatus: 1,
          clientNum: 450,
          staffNum: 10,
          updateTime: '2022-10-20 14:31:12'
        },
        {
          packageId: '00003',
          packageName: '有子女',
          refreshType: 1,
          computeStatus: 3,
          createTime: '2022-10-20 14:11:45',
          opName: '吴桐',
          runStatus: 1,
          clientNum: 450,
          staffNum: 10,
          updateTime: '2022-10-01 10:01:20'
        },
        {
          packageId: '00004',
          packageName: '女性防癌',
          refreshType: 1,
          computeStatus: 1,
          createTime: '2022-10-19 09:40:46',
          opName: '吴桐',
          runStatus: 1,
          clientNum: 450,
          staffNum: 10,
          updateTime: '2022-10-19 09:40:46'
        },
        {
          packageId: '00005',
          packageName: '年金收益',
          refreshType: 1,
          computeStatus: 1,
          createTime: '2022-10-18 16:40:46',
          opName: '吴桐',
          runStatus: 1,
          clientNum: 450,
          staffNum: 10,
          updateTime: '2022-10-18 16:40:46'
        },
        {
          packageId: '00006',
          packageName: '续保犹豫',
          refreshType: 1,
          computeStatus: 1,
          createTime: '2022-10-17 13:40:22',
          opName: '吴桐',
          runStatus: 1,
          clientNum: 450,
          staffNum: 10,
          updateTime: '2022-10-17 13:40:22'
        },
        {
          packageId: '00007',
          packageName: '转保风险高',
          refreshType: 1,
          computeStatus: 1,
          createTime: '2022-10-17 10:40:00',
          opName: '吴桐',
          runStatus: 1,
          clientNum: 450,
          staffNum: 10,
          updateTime: '2022-10-17 10:40:00'
        },
        {
          packageId: '00008',
          packageName: '出险理赔群',
          refreshType: 1,
          computeStatus: 1,
          createTime: '2022-10-17 09:42:03',
          opName: '吴桐',
          runStatus: 1,
          clientNum: 450,
          staffNum: 10,
          updateTime: '2022-10-17 09:44:37'
        }
      ]
    };
    if (res1) {
      setList(res1.list);
      setSelectedRowKeys([]);
      // setRecordItem(undefined);
      setPagination((pagination) => ({ ...pagination, total: res1.total }));
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
    console.log('values', values);
    const { createTime, updateTime } = values;
    let createTimeBegin;
    let createTimeEnd;
    let updateTimeBegin;
    let updateTimeEnd;
    if (createTime) {
      createTimeBegin = createTime[0].startOf('day').format('YYYY-MM-DD HH:mm:ss');
      createTimeEnd = createTime[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');
    }
    if (updateTime) {
      updateTimeBegin = updateTime[0].startOf('day').format('YYYY-MM-DD HH:mm:ss');
      updateTimeEnd = updateTime[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');
    }
    delete values.createTime;
    delete values.updateTime;
    const param = {
      ...values,
      createTimeBegin,
      createTimeEnd,
      updateTimeBegin,
      updateTimeEnd
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
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    getCheckboxProps: (record: any) => {
      return {
        disabled: false,
        name: record.title
      };
    }
  };

  // 批量删除
  const batchDelHandle = () => {
    console.log('selectedRowKeys', selectedRowKeys);
  };

  const navigatorToDownload = () => {
    history.push('/tagCrowds/download');
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
        rowKey={'packageId'}
        columns={tableColumnsFun({
          getList: () => getList({ ...formParam, pageNum: pagination.current, pageSize: pagination.pageSize })
        })}
        dataSource={list}
        pagination={pagination}
        paginationChange={paginationChange}
        loading={tableLoading}
        rowSelection={rowSelection}
      />
      <div className={'operationWrap'}>
        <Button type="primary" ghost shape="round" disabled={selectedRowKeys.length === 0} onClick={batchDelHandle}>
          批量删除
        </Button>
      </div>
    </div>
  );
};

export default TagGroupList;
