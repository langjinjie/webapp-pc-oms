import React from 'react';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { UNKNOWN } from 'src/utils/base';
import { transferStatusList } from '../DistributeList/Config';
import { Form } from 'antd';
import { SelectStaff } from 'src/pages/StaffManage/components';
import classNames from 'classnames';

export const searchCols: SearchCol[] = [
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
    customNode: (
      <Form.Item key={'staffList'} name="staffList" label="所属客户经理">
        <SelectStaff key={1} />
      </Form.Item>
    )
  },
  {
    name: 'transferStatus',
    type: 'select',
    width: 160,
    label: '接替状态',
    placeholder: '请选择',
    options: transferStatusList
  }
];

// 分配记录
export interface IClientAssignRecord {
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

export const tableColumns: ColumnsType<IClientAssignRecord> = [
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
    render: (status) => (
      <span>
        <span>
          <i
            className={classNames(
              'status-point',
              { 'status-point-gray': status === 1 },
              { 'status-point-red': [3, 5].includes(status) }
            )}
          />
          {transferStatusList.find((findItem) => findItem.id === status)?.name}
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

export const clientTypeList = [
  {
    key: '1',
    title: '在职分配记录'
  },
  {
    key: '2',
    title: '离职分配记录'
  }
];
