import React from 'react';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { UNKNOWN } from 'src/utils/base';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';

export const takeoverTypeList: any[] = [
  { id: 1, name: '在职转接' },
  { id: 2, name: '离职继承' }
];

export const transferStatusList = [
  { id: 1, name: '转接中' },
  { id: 2, name: '已转接' },
  { id: 3, name: '已拒绝' },
  { id: 4, name: '已转接（90天无法转接）' },
  { id: 5, name: '已拒绝（成员已超过最大客户数）' }
];

export const searchCols: (reasonCodeList: any[]) => SearchCol[] = (reasonCodeList) => {
  return [
    {
      name: 'clientName',
      type: 'input',
      label: '客户昵称',
      // width: '140px',
      placeholder: '请输入'
    },
    {
      name: 'type',
      type: 'select',
      label: '转接类型',
      width: 100,
      placeholder: '请输入',
      options: takeoverTypeList
    },
    {
      name: 'assignTime',
      type: 'rangePicker',
      label: '分配时间',
      // width: '140px',
      placeholder: '请输入'
    },
    {
      name: 'reasonCode',
      type: 'select',
      width: 120,
      label: '分配原因',
      options: reasonCodeList
    },
    {
      name: 'takeoverTime',
      label: '转接时间',
      type: 'rangePicker'
    },
    {
      name: 'transferStatus',
      label: '转接状态',
      type: 'select',
      width: 320,
      options: transferStatusList
    }
  ];
};

export interface IAssignClient {
  detailId: string;
  externalUserid: string;
  avatar: string;
  nickName: string;
  type: number;
  transferStatus: number;
  reasonName: string;
  takeoverTime: string;
  assignTime: string;
  handoverStaffId: string;
  handoverUserid: string;
  handoverStaffName: string;
}

export const tableColumnsFun = (): ColumnsType<IAssignClient> => {
  const history = useHistory();
  // 查看聊天记录
  const viewChatList = (row: IAssignClient) => {
    history.push('/inherited/chatLog?partnerId=' + row.externalUserid + '&userId=' + row.handoverUserid, {
      clientInfo: row
    });
  };

  return [
    { title: '客户昵称', dataIndex: 'nickName' },
    {
      title: '转接类型',
      dataIndex: 'type',
      render (type: number) {
        return <>{takeoverTypeList.find((findItem) => findItem.id === type)?.name}</>;
      }
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
                { 'status-point-danger': [3, 5].includes(status) }
              )}
            />
            {transferStatusList.find((findItem) => findItem.id === status)?.name}
          </span>
        </span>
      )
    },
    { title: '分配原因', dataIndex: 'reasonName' },
    {
      title: '转接时间',
      dataIndex: 'takeoverTime',
      render (takeoverTime: string) {
        return <>{takeoverTime || UNKNOWN}</>;
      }
    },
    { title: '分配时间', align: 'center', dataIndex: 'assignTime' },
    {
      title: '操作',
      width: 260,
      render: (row: IAssignClient) => {
        return (
          [2, 4].includes(row.transferStatus) && (
            <Button type="link" onClick={() => viewChatList(row)}>
              查看聊天记录
            </Button>
          )
        );
      }
    }
  ];
};
