import { Button, Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import React from 'react';
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
      { id: 1, name: '未上架' },
      { id: 2, name: '已上架' },
      { id: 3, name: '已下架' }
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
  const { handleOperate } = args;
  return [
    {
      title: '下载ID',
      dataIndex: 'fileId',
      width: 200,
      ellipsis: {
        showTitle: false
      }
    },
    {
      title: '报表名称',
      dataIndex: 'fileName',
      width: 120,
      render: (text: String) => {
        return text || UNKNOWN;
      }
    },
    {
      title: '筛选条件',
      dataIndex: 'filter',
      width: 120,
      render: (text: String) => {
        return text || UNKNOWN;
      }
    },
    {
      title: '生成状态',
      dataIndex: 'status',
      align: 'center',
      width: 120,
      render: (text: String) => {
        return text || UNKNOWN;
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
      width: 120,
      render: (text: String) => {
        return text || UNKNOWN;
      }
    },

    {
      title: '操作',
      dataIndex: 'status',
      width: 120,
      align: 'left',
      fixed: 'right',
      render: (status: number, record: any) => (
        <Space size={10} className="spaceWrap">
          {/* <AuthBtn path="/top">
          </AuthBtn> */}
          <Button type="link" onClick={() => handleOperate(record)}>
            下载文件
          </Button>
        </Space>
      )
    }
  ];
};
