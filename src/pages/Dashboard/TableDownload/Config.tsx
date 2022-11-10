import { Button, Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import React, { useState } from 'react';
import { AuthBtn } from 'src/components';
// import { AuthBtn } from 'src/components';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { UNKNOWN } from 'src/utils/base';

export const SearchCols: SearchCol[] = [
  {
    name: 'activityName',
    type: 'select',
    label: '报表类别',
    width: '268px',
    options: [
      { id: 1, name: '每日战报数据' },
      { id: 2, name: '战报黑名单数据' }
    ]
  },
  {
    name: '日期',
    type: 'rangePicker',
    width: 160,
    label: '状态'
  }
];

export interface fileProps {
  id: number;
  fileId: string;
  reportName: string;
  status: number;
  fileName: string;
  finishTime: string;
  creater: string;
  filter: string;
}
interface OperateProps {
  handleOperate: (record: fileProps) => void;
}

export const columns = (args: OperateProps): ColumnsType<fileProps> => {
  const [loadingId, setLoadingId] = useState('');
  const { handleOperate } = args;
  const downLoadFile = async (record: any) => {
    setLoadingId(record.fileId);
    await handleOperate(record);
    setLoadingId('');
  };
  return [
    {
      title: '下载ID',
      dataIndex: 'fileId',
      width: 130,
      ellipsis: {
        showTitle: false
      }
    },
    {
      title: '报表名称',
      dataIndex: 'fileName',
      ellipsis: true,
      width: 180,
      render: (text: String) => {
        return text || UNKNOWN;
      }
    },
    {
      title: '筛选条件',
      dataIndex: 'filter',
      ellipsis: true,
      width: 160,
      render: (text, record) => {
        return record.reportName + ' ' + text;
      }
    },
    {
      title: '生成状态',
      dataIndex: 'status',
      align: 'center',
      width: 120,
      render: (status: number) => {
        return status === 1 ? '成功' : status === 2 ? '处理中' : '失败';
      }
    },
    {
      title: '生成日期',
      dataIndex: 'finishTime',
      align: 'center',
      width: 120,
      render: (text: string) => {
        return <span>{(text && moment(text).format('YYYY-MM-DD HH:mm')) || UNKNOWN}</span>;
      }
    },
    {
      title: '处理人',
      dataIndex: 'creater',
      width: 100,
      render: (text: String) => {
        return text || UNKNOWN;
      }
    },

    {
      title: '操作',
      dataIndex: 'status',
      width: 80,
      align: 'left',
      fixed: 'right',
      render: (status: number, record: any) => (
        <Space size={10} className="spaceWrap">
          <AuthBtn path="/export">
            {status === 1
              ? (
              <Button loading={loadingId === record.fileId} type="link" onClick={() => downLoadFile(record)}>
                下载文件
              </Button>
                )
              : (
                  '/'
                )}
          </AuthBtn>
        </Space>
      )
    }
  ];
};
