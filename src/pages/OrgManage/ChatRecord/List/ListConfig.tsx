import React from 'react';
import { Button, Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol, AuthBtn } from 'src/components';

import { SelectStaff /* , TagModal */ } from 'src/pages/StaffManage/components';
import { OperateType } from 'src/utils/interface';

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
    name: 'startTime-endTime',
    type: 'rangePicker',
    label: '创建时间',
    width: '160px'
  },
  {
    name: 'staffList',
    type: 'custom',
    width: '160px',
    label: '客户经理',
    customNode: <SelectStaff type="staff" />
  }
];

export interface SceneColumns {
  proposalId: string;
  staffId: string;
  sceneName: string;
  carNumber: string;
  externalName: string;
  dateCreated: string;
  externalUserId: string;
  userId: string;
  staffName: string;
  isChatsyn: number;
}
interface OperateProps {
  onOperate: (operateType: OperateType, proposalId: SceneColumns) => void;
}
export const tableColumnsFun = (args: OperateProps): ColumnsType<SceneColumns> => {
  return [
    { title: '沟通编号', dataIndex: 'proposalId', key: 'proposalId', width: 200 },
    {
      title: '客户经理',
      dataIndex: 'staffName',
      key: 'staffId',
      width: 200
    },

    {
      title: '客户名称',
      dataIndex: 'externalName',
      width: 260,
      align: 'center'
    },
    {
      title: '车牌号',
      dataIndex: 'carNumber',
      width: 260,
      align: 'center'
    },
    {
      title: '创建时间',
      dataIndex: 'dateCreated',
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
              <Button type="link" key={record.proposalId} onClick={() => args.onOperate('view', record)}>
                查看详细沟通记录
              </Button>
            </AuthBtn>
            <AuthBtn path="/query">
              <Button
                type="link"
                key={record.proposalId}
                disabled={record.isChatsyn === 0}
                onClick={() => args.onOperate('edit', record)}
              >
                查看企业微会话
              </Button>
            </AuthBtn>
          </Space>
        );
      }
    }
  ];
};
