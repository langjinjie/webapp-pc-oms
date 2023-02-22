/**
 * @desc 审核链管理
 */
import React, { useEffect, useState } from 'react';
import { Button, message, PaginationProps, Space } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import { getAuditFlowModalUrl, getAuditFlowUploadLog, uploadAuditFlows } from 'src/apis/audit';
import { AuthBtn, ExportModal, NgTable } from 'src/components';
import { TableColsFun } from './AuditFlowConfig';

const AuditList: React.FC<RouteComponentProps> = ({ history }) => {
  const [dataSource, setDataSource] = useState<[]>();
  const [visible, setVisible] = useState(false);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });
  const getList = async (params?: { pageNum: number; pageSize?: number }) => {
    const pageNum = params?.pageNum || pagination.current;
    const pageSize = params?.pageSize || pagination.pageSize;
    const res = await getAuditFlowUploadLog();

    if (res) {
      const { list, total } = res;
      setPagination((pagination) => ({ ...pagination, pageSize, current: pageNum, total }));
      setDataSource(list);
    }
  };
  const preViewDetail = (record: any) => {
    console.log(record);
    history.push('/audit/flow/detail?type=' + record.type);
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

  const onUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('fileName', file);
    const res = await uploadAuditFlows(formData);
    if (res) {
      message.success('导入成功！');
    }
  };

  const onDownload = async () => {
    const res = await getAuditFlowModalUrl();
    if (res) {
      window.location.href = res.tplUrl;
    }
  };

  return (
    <div className="container">
      <Space size={20}>
        <AuthBtn path="/upload">
          <Button type="primary" className="mb20" shape="round" onClick={() => setVisible(true)}>
            导入数据
          </Button>
        </AuthBtn>
      </Space>
      <ExportModal
        title="导入审核链"
        visible={visible}
        onCancel={() => setVisible(false)}
        onOK={onUpload}
        onDownLoad={onDownload}
      />
      <div className="mt15">
        <NgTable
          rowKey={'opTime'}
          paginationChange={onPaginationChange}
          pagination={pagination}
          columns={TableColsFun({ preView: preViewDetail })}
          dataSource={dataSource}
        ></NgTable>
      </div>
    </div>
  );
};

export default AuditList;
