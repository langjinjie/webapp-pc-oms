import React from 'react';
import { Button, Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { UNKNOWN } from 'src/utils/base';

export const searchCols: SearchCol[] = [
  {
    name: 'title',
    type: 'input',
    label: '策略任务模板编号',
    width: '180px',
    placeholder: '请输入'
  },
  {
    name: 'categoryId',
    type: 'input',
    label: '策略任务模板名称',
    placeholder: '请输入',
    width: '320px'
  }
];

export interface StrategyTaskProps {
  id: string;
}

interface OperateProps {
  onOperate: () => void;
}
export const tableColumnsFun = (args: OperateProps): ColumnsType<StrategyTaskProps> => {
  return [
    { title: '策略任务模板编号', dataIndex: 'newsId', key: 'newsId', width: 200 },
    {
      title: '策略任务模板名称',
      dataIndex: 'title',
      key: 'title',
      width: 200
    },
    {
      title: '策略修改时间',
      dataIndex: 'categoryName',
      width: 160,
      key: 'categoryName',
      align: 'center',
      render: (categoryName: string) => categoryName || UNKNOWN
    },
    {
      title: '修改人',
      dataIndex: 'fromSource',
      width: 260,
      align: 'center'
    },
    {
      title: '状态',
      dataIndex: 'fromSource',
      width: 260,
      align: 'center'
    },

    {
      title: '操作',
      dataIndex: 'fromSource',
      width: 180,
      align: 'center',
      render: (value, record) => {
        return (
          <Space size={20}>
            <Button type="link" key={record.id} onClick={() => args.onOperate()}>
              查看
            </Button>
            <Button type="link" key={record.id} onClick={() => args.onOperate()}>
              下架
            </Button>
            <Button type="link" key={record.id} onClick={() => args.onOperate()}>
              编辑
            </Button>
          </Space>
        );
      }
    }
  ];
};
