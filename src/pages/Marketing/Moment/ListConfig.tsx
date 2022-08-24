import React from 'react';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { UNKNOWN } from 'src/utils/base';

export const tplTypeOptions = [
  {
    id: 1,
    name: '文章'
  },
  {
    id: 2,
    name: '产品'
  },
  {
    id: 3,
    name: '活动'
  },
  {
    id: 6,
    name: '单张海报'
  },
  {
    id: 5,
    name: '9宫格海报'
  }
];
export const searchColsFun = (): SearchCol[] => {
  return [
    {
      name: 'name',
      type: 'input',
      label: '内容名称',
      width: '180px',
      placeholder: '请输入'
    },
    {
      name: 'tplType',
      type: 'select',
      label: '展示模板',
      placeholder: '请输入',
      width: 180,

      options: tplTypeOptions
    }
  ];
};

export interface MomentColumns {
  feedId: string;
  nodeCode: string;
  typeName: string;
  nodeName: string;
  createBy: string;
  createTime: string;
}

interface OperateProps {
  onOperate: (feedId: string, index: number) => void;
}
export const tableColumnsFun = (args: OperateProps): ColumnsType<MomentColumns> => {
  return [
    { title: '内容Id', dataIndex: 'feedId', key: 'feedId', width: 200 },
    {
      title: '展示模版',
      dataIndex: 'tplType',
      key: 'tplType',
      width: 200,
      render: (tplType) => {
        return tplTypeOptions.filter((option) => option.id === tplType)[0]?.name;
      }
    },
    {
      title: '内容名称',
      dataIndex: 'name',
      width: 180,
      key: 'name',
      ellipsis: true,
      render: (categoryName: string) => categoryName || UNKNOWN
    },
    {
      title: '营销话术',
      dataIndex: 'speechcraft',
      width: 180,
      key: 'speechcraft',
      ellipsis: true
    },
    {
      title: '创建人',
      dataIndex: 'createBy',
      width: 100
    },

    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 260
    },
    {
      title: '操作',
      width: 80,
      align: 'center',
      fixed: 'right',
      render: (value, record, index) => {
        return (
          <Button type="link" onClick={() => args.onOperate(record.feedId, index)}>
            编辑
          </Button>
        );
      }
    }
  ];
};
