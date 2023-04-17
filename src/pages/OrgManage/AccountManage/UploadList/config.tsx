import React from 'react';
import { ColumnsType } from 'antd/lib/table';
import { Button, Popconfirm } from 'antd';

export interface SyncStaffColumn {
  staffId: string;
  userid: string;
  staffName: string;
  ascopeStatus: number;
  ascopeOpenTime: string;
  bscopeStatus: number;
  bscopeOpenTime: string;
  workStatus: number;
  deptId: string;
  deptFullName: string;
  oldDeptId: string;
  oldDeptFullName: string;
  syncType: number;
  syncTime: string;
}

export interface UploadColumn {
  importId: string;
  importTime: string;
  fileName: string;
  opName: string;
  processStatus: number;
  succCount: number;
  totalCount: number;
}
export const tableColumnsUpload = (download: (record: UploadColumn) => void): ColumnsType<UploadColumn> => {
  return [
    {
      title: '导入时间',
      dataIndex: 'importTime',
      width: 140
    },
    {
      title: '导入人',
      dataIndex: 'opName',
      width: 140
    },
    {
      title: '导入文件',
      dataIndex: 'fileName',
      width: 140
    },
    {
      title: '状态',
      dataIndex: 'processStatus',
      width: 100,
      render: (text) => (text === 0 ? '处理中' : '处理完毕')
    },
    {
      title: '处理结果',
      width: 140,
      render: (text, record) => {
        return `${record.succCount || 0} / ${record.totalCount || 0}`;
      }
    },
    {
      title: '操作',
      dataIndex: 'importId',
      width: 80,
      fixed: 'right',
      render: (text, record) => {
        return (
          <>
            {record.processStatus === 0
              ? (
                  '/'
                )
              : (
              <Popconfirm title="确定下载失败文件" onConfirm={() => download(record)}>
                <Button type="link">下载失败文件</Button>
              </Popconfirm>
                )}
          </>
        );
      }
    }
  ];
};
