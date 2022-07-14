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
      label: '节点编号',
      width: '180px',
      placeholder: '请输入'
    },
    {
      name: 'codeName',
      type: 'input',
      label: '节点名称',
      placeholder: '请输入',
      width: '280px'
    },
    {
      name: 'nodeTypeCode',
      type: 'select',
      label: '节点类别',
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
    { title: '节点编号', dataIndex: 'nodeCode', key: 'nodeCode', width: 200 },
    {
      title: '节点类别',
      dataIndex: 'typeName',
      key: 'typeName',
      width: 200
    },
    {
      title: '节点名称',
      dataIndex: 'nodeName',
      width: 160,
      key: 'nodeName',
      render: (categoryName: string) => categoryName || UNKNOWN
    },
    {
      title: '节点新增人',
      dataIndex: 'createBy',
      width: 260,
      align: 'center'
    },

    {
      title: '节点新增时间',
      dataIndex: 'createTime',
      width: 260,
      align: 'center'
    },
    {
      title: '操作',
      width: 80,
      align: 'center',
      fixed: 'right',
      render: (value, record, index) => {
        return (
          <Popconfirm title="删除后会影响所有机构，确定要删除?" onConfirm={() => args.onOperate(record.nodeId, index)}>
            <Button type="link">删除</Button>
          </Popconfirm>
        );
      }
    }
  ];
};
