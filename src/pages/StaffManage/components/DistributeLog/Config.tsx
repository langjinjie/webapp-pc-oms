import React from 'react';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol, SelectOrg } from 'src/components';
import { UNKNOWN } from 'src/utils/base';
import { onJobTransferStatusList, resignTransferStatusList } from '../DistributeList/Config';
import classNames from 'classnames';

export const searchCols: (queryType: '1' | '2') => SearchCol[] = (queryType) => {
  const cols: SearchCol[] = [
    {
      name: 'clientName',
      type: 'input',
      label: '客户昵称',
      width: 180,
      placeholder: '请输入'
    },
    {
      name: 'staffList',
      type: 'custom',
      label: '所属客户经理',
      placeholder: '请输入',
      customNode: <SelectOrg />
    },
    {
      name: 'transferStatus',
      type: 'select',
      width: 160,
      label: '转接状态',
      placeholder: '请选择',
      options: queryType === '1' ? onJobTransferStatusList : resignTransferStatusList
    }
  ];
  return cols;
};

// 分配记录
export interface IClientAssignRecord {
  detailId?: string;
  externalUserid: string;
  nickName: string;
  handoverStaffId: string;
  handoverStaffName: string;
  takeoverStaffId: string;
  takeoverStaffName: string;
  transferStatus: number;
  opName: string;
  assignTime: string;
}

export const tableColumns: (queryType: '1' | '2') => ColumnsType<IClientAssignRecord> = (queryType) => {
  const columns: ColumnsType<IClientAssignRecord> = [
    { title: '客户昵称', dataIndex: 'nickName' },
    {
      title: '所属客户经理',
      dataIndex: 'handoverStaffName'
    },
    {
      title: '接替客户经理',
      dataIndex: 'takeoverStaffName',
      width: 160,
      key: 'key3',
      align: 'center',
      render: (nodeName: string) => nodeName || UNKNOWN
    },
    {
      title: '转接状态',
      dataIndex: 'transferStatus',
      render: (status: number) => (
        <span>
          <span>
            <i
              className={classNames(
                'status-point',
                { 'status-point-gray': status === 1 },
                { 'status-point-red': [3, 5].includes(status) }
              )}
            />
            {onJobTransferStatusList.find((findItem) => findItem.id === status)?.name}
          </span>
        </span>
      )
    },
    {
      title: '转接时间',
      dataIndex: 'takeoverTime'
    },
    {
      title: '分配时间',
      dataIndex: 'assignTime'
    },
    {
      title: '操作人',
      dataIndex: 'opName'
    }
  ];
  if (queryType === '1') {
    columns.splice(columns.length - 1, 0, {
      title: '转接原因',
      dataIndex: 'reasonName'
    });
  }
  return columns;
};

export const clientTypeList = [
  {
    key: '1',
    title: '在职分配记录',
    authorKey: '/assignRecord' // 此处要与在职分配的分配记录的按钮path对应
  },
  {
    key: '2',
    title: '离职分配记录',
    authorKey: '/dimissionRecord' // 此处要与离职分配的分配记录的按钮path对应
  }
];
