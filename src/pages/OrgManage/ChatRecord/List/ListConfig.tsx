import React from 'react';
import { Button, Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { AuthBtn } from 'src/components';

export const searchCols: SearchCol[] = [
  {
    name: 'carNumber',
    type: 'input',
    label: '车牌号',
    width: '160px',
    placeholder: '请输入'
  },
  {
    name: 'externalName',
    type: 'input',
    label: '客户名称',
    placeholder: '请输入',
    width: '160px'
  },
  {
    name: 'rangePicker',
    type: 'rangePicker',
    label: '创建时间',
    width: '160px'
  },
  {
    name: 'staffId',
    type: 'input',
    label: '客户经理',
    placeholder: '请输入',
    width: '160px'
  }
];

// export interface SceneColumns {
//   proposalId: string;
//   staffId: string;
//   sceneName: string;
//   carNumber: string;
//   externalName: string;
//   dateCreated: string;
// }
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
  onOperate: (proposalId: string) => void;
}
export const tableColumnsFun = (args: OperateProps): ColumnsType<SceneColumns> => {
  return [
    { title: '沟通编号', dataIndex: 'proposalId', key: 'proposalId', width: 200 },
    {
      title: '客户经理',
      // dataIndex: 'staffId',
      dataIndex: 'sceneName',
      key: 'staffId',
      width: 200
    },

    {
      title: '客户名称',
      // dataIndex: 'externalName',
      dataIndex: 'sceneName',
      width: 260,
      align: 'center'
    },
    {
      title: '车牌号',
      // dataIndex: 'carNumber',
      dataIndex: 'sceneName',
      width: 260,
      align: 'center'
    },
    {
      title: '创建时间',
      // dataIndex: 'dateCreated',
      dataIndex: 'sceneName',
      width: 260,
      align: 'center'
    },
    {
      title: '操作',
      // dataIndex: 'fromSource',
      dataIndex: 'sceneName',
      width: 260,
      align: 'center',
      render: (value, record) => {
        return (
          <Space>
            <AuthBtn path="/view">
              {/* <Button type="link" key={record.proposalId} onClick={() => args.onOperate(record.proposalId)}>
               */}
              <Button type="link" key={record.sceneId} onClick={() => args.onOperate(record.sceneId)}>
                查看详细沟通记录
              </Button>
            </AuthBtn>
            <AuthBtn path="/view">
              {/* <Button type="link" key={record.proposalId} onClick={() => args.onOperate(record.proposalId)}> */}
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
