import { Button, message } from 'antd';
import { PaginationProps } from 'antd/es/pagination';
import React, { useEffect, useState } from 'react';
import { exportErrorFile, exportExcelWithScope, getExcelDownloadUrl, getExportLog } from 'src/apis/orgManage';
import { BreadCrumbs, ExportModal, NgTable } from 'src/components';
import { exportFile } from 'src/utils/base';
import { tableColumnsUpload, UploadColumn } from './config';

const UploadLog: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [dataSource, setDataSource] = useState<UploadColumn[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });
  const getList = async (params?: any) => {
    const pageNum = params?.pageNum || pagination.current;
    const pageSize = params?.pageSize || pagination.pageSize;
    const res = await getExportLog({
      ...params,
      pageNum,
      pageSize
    });
    if (res) {
      const { list, total } = res;
      console.log(res);
      setDataSource(list || []);
      setPagination((pagination) => ({ ...pagination, current: pageNum, total, pageSize }));
    }
  };

  useEffect(() => {
    getList();
  }, []);

  const onPaginationChange = (pageNum: number, pageSize?: number) => {
    getList({ pageNum, pageSize });
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('fileName', file);
    const res = await exportExcelWithScope(formData);
    if (res) {
      message.success('导入成功！');
    }
  };

  const handleDownload = async () => {
    const res = await getExcelDownloadUrl();
    if (res) {
      //
      window.location.href = res;
    }
  };

  const downloadItem = async (record: UploadColumn) => {
    const { data } = await exportErrorFile({ importId: record.importId });
    exportFile(data, record.fileName || '导入失败文件');
  };

  return (
    <div className="container">
      <BreadCrumbs
        navList={[
          {
            name: '员工账号管理',
            path: '/orgManage/detail'
          },

          {
            name: '批量处理员工账号'
          }
        ]}
      />
      <Button type="primary" className="mt20" shape="round" onClick={() => setVisible(true)}>
        批量新增
      </Button>
      <NgTable
        className="mt20"
        dataSource={dataSource}
        pagination={pagination}
        rowKey={'importId'}
        paginationChange={onPaginationChange}
        columns={tableColumnsUpload(downloadItem)}
      ></NgTable>

      <ExportModal
        visible={visible}
        onCancel={() => setVisible(false)}
        onOK={handleUpload}
        onDownLoad={handleDownload}
      />
    </div>
  );
};

export default UploadLog;
