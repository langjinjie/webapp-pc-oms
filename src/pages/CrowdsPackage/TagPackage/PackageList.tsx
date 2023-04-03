import React, { useEffect, useState } from 'react';
import { Button, message, Modal, PaginationProps, Space } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import { NgFormSearch, NgTable } from 'src/components';
import { searchCols, tableColumnsFun } from './Config';
import { requestGetPackageList, requestGetDelPackage } from 'src/apis/CrowdsPackage';
import { formatDate } from 'src/utils/base';

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
    setTableLoading(true);
    const res = await requestGetPackageList({ ...values });
    if (res) {
      setList(res.list);
      setSelectedRowKeys([]);
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
    // createTime已经在组件内被格式化，可以直接用 updateTime 需要自己格式化
    const { beginTime: createTimeBegin, endTime: createTimeEnd, updateTime } = values;
    const [updateTimeBegin, updateTimeEnd] = formatDate(updateTime);
    delete values.createTime;
    delete values.updateTime;
    delete values.beginTime;
    delete values.endTime;
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
    history.push('/tagPackage/create', {
      navList: [{ name: '标签分群', path: '/tagPackage' }, { name: '创建分群' }]
    });
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
    Modal.confirm({
      title: '操作提示',
      centered: true,
      content: `确定删除选中的${selectedRowKeys.length}个人群包吗？`,
      async onOk () {
        const list = selectedRowKeys.map((packageId) => ({ packageId }));
        const res = await requestGetDelPackage({ list });
        if (res) {
          message.success('人群包批量删除成功');
          const { current: pageNum, pageSize } = pagination;
          getList({ ...formParam, pageNum, pageSize });
        }
      }
    });
  };

  const navigatorToDownload = () => {
    history.push('/tagPackage/download', {
      navList: [{ name: '标签分群', path: '/tagPackage' }, { name: '查看人群包下载列表' }]
    });
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
      {list.length !== 0 && (
        <div className={'operationWrap'}>
          <Button type="primary" ghost shape="round" disabled={selectedRowKeys.length === 0} onClick={batchDelHandle}>
            批量删除
          </Button>
        </div>
      )}
    </div>
  );
};

export default TagGroupList;
