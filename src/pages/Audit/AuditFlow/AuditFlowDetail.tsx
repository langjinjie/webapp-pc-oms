import { Breadcrumb, Button, message } from 'antd';
import { PaginationProps } from 'antd/es/pagination';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { batchDeleteAuditFlow, getAuditFlowList } from 'src/apis/audit';
import { AuthBtn, NgModal, NgTable } from 'src/components';
import { urlSearchParams } from 'src/utils/base';
import { AuditFlowProps, TableColsFunOfDetail } from './AuditFlowConfig';

const AuditFlowDetail: React.FC<RouteComponentProps> = ({ history, location }) => {
  const [dataSource, setDataSource] = useState<AuditFlowProps[]>([]);
  const [visible, setVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });
  const navigatorToList = () => {
    history.goBack();
  };

  const getList = async (params?: { pageNum: number; pageSize?: number }) => {
    const pageNum = params?.pageNum || pagination.current;
    const pageSize = params?.pageSize || pagination.pageSize;
    const { type } = urlSearchParams(location.search);
    const res = await getAuditFlowList({
      type,
      pageNum,
      pageSize
    });
    if (res) {
      const { list, total } = res;
      const myList = list.map((item: any) => ({ ...item, ...item.nodeList[0] }));

      setDataSource(myList);
      setPagination((pagination) => ({ ...pagination, total, pageSize, current: pageNum }));
    }
  };

  const onDelete = async (isBatch: boolean, record?: AuditFlowProps) => {
    if (isBatch) setVisible(false);
    let list: { flowId: React.Key }[] = [];
    if (isBatch) {
      list = selectedRowKeys.map((item) => ({ flowId: item }));
    } else {
      list = [{ flowId: record?.flowId as string }];
    }
    const res = await batchDeleteAuditFlow({ list });
    if (res) {
      message.success('删除成功');
      getList();
    }
  };

  useEffect(() => {
    getList();
  }, []);

  const onPaginationChange = (pageNum: number, pageSize?: number) => {
    getList({
      pageNum,
      pageSize
    });
  };
  return (
    <div>
      <div className={'breadcrumbWrap ml25'}>
        <span>当前位置：</span>
        <Breadcrumb>
          <Breadcrumb.Item onClick={() => navigatorToList()}>审核链管理</Breadcrumb.Item>
          <Breadcrumb.Item>审核链详情</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="ml25">
        <AuthBtn path="/preview/delete">
          <Button type="primary" shape="round" disabled={selectedRowKeys.length === 0} onClick={() => setVisible(true)}>
            批量删除
          </Button>
        </AuthBtn>
        <div className="mt20">
          <NgTable
            rowKey={'flowId'}
            rowSelection={{
              defaultSelectedRowKeys: [],
              type: 'checkbox',
              onChange: (selectedRowKeys) => {
                setSelectedRowKeys(selectedRowKeys);
              },
              getCheckboxProps: (record) => {
                return {
                  disabled: false,
                  name: record.launchStaffName
                };
              }
            }}
            dataSource={dataSource}
            loading={false}
            pagination={pagination}
            paginationChange={onPaginationChange}
            columns={TableColsFunOfDetail({ onOperate: (record) => onDelete(false, record) })}
          ></NgTable>
        </div>
      </div>

      <NgModal title="温馨提示" onCancel={() => setVisible(false)} visible={visible} onOk={() => onDelete(true)}>
        <p>确定要删除选中的审批链？</p>
      </NgModal>
    </div>
  );
};

export default AuditFlowDetail;
