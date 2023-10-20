import React, { useEffect, useState } from 'react';
import { Button, message, Modal, PaginationProps, Space } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import { AuthBtn, NgFormSearch, NgTable } from 'src/components';
import { searchCols, tableColumnsFun, ICrowdsPackageRow } from './Config';
import {
  requestGetPackageList,
  requestGetDelPackage,
  requestManagePackageRun,
  requestGetPackageCompute,
  requestExportPackage
} from 'src/apis/CrowdsPackage';

const TagGroupList: React.FC<RouteComponentProps> = ({ history }) => {
  const [list, setList] = useState<any[]>([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [formParam, setFormParam] = useState<{ [key: string]: any }>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [btnLoadingPackageId, setBtnLoadingPackageId] = useState<{
    export: string; // 导出按钮
    compute: string; // 计算按钮
  }>({ export: '', compute: '' });
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
    getList({ ...values, pageSize: pagination.pageSize });
    setPagination((pagination) => ({ ...pagination, current: 1 }));
    setFormParam(values);
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

  // 查看分群详情
  const viewDetail = ({ packageId, packageType }: ICrowdsPackageRow) => {
    // 分群类型，1-标签属性；2-人员属性；3-手工导入文件
    if (packageType === 3) {
      history.push('/tagPackage/create?packageId=' + packageId + '&packageType=' + packageType, {
        navList: [{ name: '标签分群', path: '/tagPackage' }, { name: '分群详情' }]
      });
    } else {
      history.push('/tagPackage/detail?packageId=' + packageId);
    }
  };

  // 开启/暂停 status： 1-开启；2-暂停
  const manageHandle = async (row: ICrowdsPackageRow) => {
    setBtnLoadingPackageId((param) => ({ ...param, manage: row.packageId }));
    const { packageId, runStatus } = row;
    const res = await requestManagePackageRun({ packageId, status: runStatus === 1 ? 2 : 1 });
    if (res) {
      message.success(`人群包${runStatus === 1 ? '暂停' : '开启'}成功`);
      getList();
    } else {
      message.error(`人群包${runStatus === 1 ? '暂停' : '开启'}失败`);
    }
    setBtnLoadingPackageId((param) => ({ ...param, manage: '' }));
  };

  // 删除人群包
  const deleteHandle = async (row: ICrowdsPackageRow) => {
    const { packageId } = row;
    const res = await requestGetDelPackage({ list: [{ packageId }] });
    if (res) {
      message.success('人群包删除成功');
      getList();
    }
  };
  // 计算人群包
  const computeHandle = async (row: ICrowdsPackageRow) => {
    setBtnLoadingPackageId((param) => ({ ...param, compute: row.packageId }));
    const { packageId } = row;
    const res = await requestGetPackageCompute({ packageId });
    if (res) {
      message.success('计算成功');
      getList();
    }
    setBtnLoadingPackageId((param) => ({ ...param, compute: '' }));
  };

  // 导出人群包
  const exportGroup = async (row: ICrowdsPackageRow) => {
    setBtnLoadingPackageId((param) => ({ ...param, export: row.packageId }));
    const { packageId, computeRecordId } = row;
    const res = await requestExportPackage({ packageId, computeRecordId });
    if (res) {
      Modal.confirm({
        title: '操作提示',
        centered: true,
        content: '人群包导出成功，是否跳转到人群包下载列表？',
        onOk () {
          history.push('/tagPackage/download', {
            navList: [{ name: '标签分群', path: '/tagPackage' }, { name: '查看人群包下载列表' }]
          });
        }
      });
    }
    setBtnLoadingPackageId((param) => ({ ...param, export: '' }));
  };

  useEffect(() => {
    getList();
  }, []);
  return (
    <div className="container">
      <AuthBtn path="/query">
        <NgFormSearch
          isInline={false}
          firstRowChildCount={4}
          searchCols={searchCols}
          onSearch={onFinishHandle}
          onReset={onResetHandle}
        />
      </AuthBtn>
      <Space size={20}>
        <AuthBtn path="/add">
          <Button className="mt10 mb20" type="primary" shape="round" onClick={createGroup}>
            创建分群
          </Button>
        </AuthBtn>
        <AuthBtn path="/viewDownloadList">
          <Button className="mt10 mb20" type="primary" shape="round" onClick={navigatorToDownload}>
            查看人群包下载列表
          </Button>
        </AuthBtn>
      </Space>
      <NgTable
        rowKey={'packageId'}
        columns={tableColumnsFun({
          btnLoadingPackageId,
          viewDetail,
          manageHandle,
          deleteHandle,
          computeHandle,
          exportGroup
        })}
        dataSource={list}
        pagination={pagination}
        paginationChange={paginationChange}
        loading={tableLoading}
        rowSelection={rowSelection}
      />
      <AuthBtn path="/batchDel">
        {list.length !== 0 && (
          <div className={'operationWrap'}>
            <Button type="primary" ghost shape="round" disabled={selectedRowKeys.length === 0} onClick={batchDelHandle}>
              批量删除
            </Button>
          </div>
        )}
      </AuthBtn>
    </div>
  );
};

export default TagGroupList;
