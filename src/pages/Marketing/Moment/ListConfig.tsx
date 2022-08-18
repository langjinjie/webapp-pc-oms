import React from 'react';
import { Button, Popconfirm } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { UNKNOWN } from 'src/utils/base';

export const searchColsFun = (options: any[]): SearchCol[] => {
  return [
    {
      name: 'nodeCode',
      type: 'input',
      label: '内容名称',
      width: '180px',
      placeholder: '请输入'
    },
    {
      name: 'nodeTypeCode',
      type: 'select',
      label: '展示模板',
      placeholder: '请输入',
      width: 180,
      selectNameKey: 'typeName',
      selectValueKey: 'typeCode',
      options: options
    }
  ];
};

export interface NodeColumns {
  nodeId: string;
  nodeCode: string;
  typeName: string;
  nodeName: string;
  createBy: string;
  createTime: string;
}

interface OperateProps {
  onOperate: (nodeId: string, index: number) => void;
}
export const tableColumnsFun = (args: OperateProps): ColumnsType<NodeColumns> => {
  return [
    { title: '内容Id', dataIndex: 'nodeCode', key: 'nodeCode', width: 200 },
    {
      title: '展示模版',
      dataIndex: 'typeName',
      key: 'typeName',
      width: 200
    },
    {
      title: '内容名称',
      dataIndex: 'nodeName',
      width: 180,
      key: 'nodeName',
      ellipsis: true,
      render: (categoryName: string) => categoryName || UNKNOWN
    },
    {
      title: '营销话术',
      dataIndex: 'nodeDesc',
      width: 180,
      key: 'nodeDesc',
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
          <Popconfirm title="删除后会影响所有机构，确定要删除?" onConfirm={() => args.onOperate(record.nodeId, index)}>
            <Button type="link">编辑</Button>
          </Popconfirm>
        );
      }
    }
  ];
};
