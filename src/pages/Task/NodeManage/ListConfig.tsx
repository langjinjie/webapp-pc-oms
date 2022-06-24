import React from 'react';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { UNKNOWN } from 'src/utils/base';

export const searchCols: SearchCol[] = [
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
    options: [{ name: '112', id: '12111' }]
  }
];

export interface NodeColumns {
  nodeId: string;
  nodeCode: string;
  typeName: string;
  nodeName: string;
  createBy: string;
  createTime: string;
}

interface OperateProps {
  onOperate: () => void;
}
export const tableColumnsFun = (args: OperateProps): ColumnsType<NodeColumns> => {
  return [
    { title: '节点编号', dataIndex: 'sceneCode', key: 'sceneCode', width: 200 },
    {
      title: '节点类别',
      dataIndex: 'sceneName',
      key: 'sceneName',
      width: 200
    },
    {
      title: '节点名称',
      dataIndex: 'categoryName',
      width: 160,
      key: 'categoryName',
      align: 'center',
      render: (categoryName: string) => categoryName || UNKNOWN
    },
    {
      title: '节点新增人',
      dataIndex: 'nodeId',
      width: 260,
      align: 'center'
    },

    {
      title: '节点新增时间',
      dataIndex: 'updateTime',
      width: 260,
      align: 'center'
    },
    {
      title: '操作',
      dataIndex: 'fromSource',
      width: 80,
      align: 'center',
      fixed: 'right',
      render: (value, record) => {
        return (
          <Button type="link" key={record.nodeId} onClick={() => args.onOperate()}>
            删除
          </Button>
        );
      }
    }
  ];
};
