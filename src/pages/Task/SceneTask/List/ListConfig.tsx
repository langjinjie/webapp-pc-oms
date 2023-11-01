import React from 'react';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol, AuthBtn } from 'src/components';

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
    { title: '场景编号', dataIndex: 'sceneCode', key: 'sceneCode', width: 200 },
    {
      title: '场景名称',
      dataIndex: 'sceneName',
      key: 'sceneName',
      width: 200
    },

    {
      title: '场景关联节点类别',
      dataIndex: 'typeName',
      width: 260,
      align: 'center'
    },
    {
      title: '场景关联节点',
      dataIndex: 'nodeName',
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
          <AuthBtn path="/view">
            <Button type="link" key={record.sceneId} onClick={() => args.onOperate(record.sceneId)}>
              查看
            </Button>
          </AuthBtn>
        );
      }
    }
  ];
};
