import React from 'react';
import { Button, Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { AuthBtn } from 'src/components';

export const searchCols: SearchCol[] = [
  {
    name: 'sceneCode',
    type: 'input',
    label: '车牌号',
    width: '160px',
    placeholder: '请输入'
  },
  {
    name: 'sceneName',
    type: 'input',
    label: '客户名称',
    placeholder: '请输入',
    width: '160px'
  },
  {
    name: 'sceneName',
    type: 'date',
    label: '创建时间',
    placeholder: '请输入',
    width: '160px'
  },
  {
    name: 'sceneName',
    type: 'input',
    label: '客户名称',
    placeholder: '请输入',
    width: '160px'
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
  onOperate: (sceneId: string) => void;
}
export const tableColumnsFun = (args: OperateProps): ColumnsType<SceneColumns> => {
  return [
    { title: '沟通编号', dataIndex: 'sceneCode', key: 'sceneCode', width: 200 },
    {
      title: '客户经理',
      dataIndex: 'sceneName',
      key: 'sceneName',
      width: 200
    },

    {
      title: '客户名称',
      dataIndex: 'typeName',
      width: 260,
      align: 'center'
    },
    {
      title: '车牌号',
      dataIndex: 'nodeName',
      width: 260,
      align: 'center'
    },
    {
      title: '创建时间',
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
          <Space>
            <AuthBtn path="/view">
              <Button type="link" key={record.sceneId} onClick={() => args.onOperate(record.sceneId)}>
                查看详细沟通记录
              </Button>
            </AuthBtn>
            <AuthBtn path="/view">
              <Button type="link" key={record.sceneId} onClick={() => args.onOperate(record.sceneId)}>
                查看企业微会话
              </Button>
            </AuthBtn>
          </Space>
        );
      }
    }
  ];
};
