import React from 'react';
import { Button, Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { UNKNOWN } from 'src/utils/base';

export const searchCols: SearchCol[] = [
  {
    name: 'sceneCode',
    type: 'input',
    label: '场景编号',
    width: '180px',
    placeholder: '请输入'
  },
  {
    name: 'sceneName',
    type: 'input',
    label: '场景名称',
    placeholder: '请输入',
    width: '280px'
  },
  {
    name: 'nodeId',
    type: 'select',
    label: '场景关联节点',
    placeholder: '请输入',
    width: '180'
  }
];

export interface SceneColumns {
  sceneId: string;
  sceneCode: string;
  sceneName: string;
  nodeId: string;
  nodeName: string;
  updateTime: string;
  updateBy: string;
}

interface OperateProps {
  onOperate: () => void;
}
export const tableColumnsFun = (args: OperateProps): ColumnsType<SceneColumns> => {
  return [
    { title: '场景编号', dataIndex: 'sceneCode', key: 'sceneCode', width: 200 },
    {
      title: '场景名称',
      dataIndex: 'sceneName',
      key: 'sceneName',
      width: 200
    },
    {
      title: '场景说明',
      dataIndex: 'categoryName',
      width: 160,
      key: 'categoryName',
      align: 'center',
      render: (categoryName: string) => categoryName || UNKNOWN
    },
    {
      title: '场景关联节点类别',
      dataIndex: 'nodeId',
      width: 260,
      align: 'center'
    },
    {
      title: '场景关联节点',
      dataIndex: 'nodeId',
      width: 260,
      align: 'center'
    },
    {
      title: '场景修改人',
      dataIndex: 'updateBy',
      width: 260,
      align: 'center'
    },
    {
      title: '场景修改时间',
      dataIndex: 'updateTime',
      width: 260,
      align: 'center'
    },
    {
      title: '操作',
      dataIndex: 'fromSource',
      width: 260,
      align: 'center',
      render: (value, record) => {
        return (
          <Space size={20}>
            <Button type="link" key={record.sceneId} onClick={() => args.onOperate()}>
              查看
            </Button>
          </Space>
        );
      }
    }
  ];
};
