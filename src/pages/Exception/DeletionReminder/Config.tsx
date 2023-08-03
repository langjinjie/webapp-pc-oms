import React from 'react';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { useHistory } from 'react-router-dom';
import { SelectStaff /* , TagModal */ } from 'src/pages/StaffManage/components';
import style from './style.module.less';
import { AuthBtn } from 'src/components';
import { UNKNOWN } from 'src/utils/base';
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

export const searchCols: () => SearchCol[] = () => {
  return [
    {
      name: 'staffName',
      type: 'custom',
      label: '所属客户经理',
      customNode: <SelectStaff type="staff" />
    },
    {
      name: 'clientName',
      type: 'input',
      label: '删除客户',
      placeholder: '请输入'
    },
    {
      name: 'beginTime-endTime',
      type: 'rangePicker',
      label: '选择删除时间'
      // width: '140px',
      // placeholder: '请输入'
    },
    {
      name: 'deptList',
      type: 'custom',
      width: 120,
      label: '组织架构',
      customNode: <SelectStaff type="dept" />
    },
    {
      name: 'leaderName',
      type: 'input',
      label: '客户经理上级',
      placeholder: '请输入'
    }
  ];
};

export interface IDelStaffList {
  id: string;
  staffId: string;
  userid: string;
  staffName: string;
  leaderName: string;
  deptName: string;
  externalUserid: string;
  clientName: string;
  clientAvatar: string;
  deleteTime: string;
  addTime: string;
  isChatsyn: number;
}

export const tableColumnsFun = (): ColumnsType<IDelStaffList> => {
  const history = useHistory();

  // 查看用户信息
  const viewClientDetail = (row: IDelStaffList) => {
    history.push(
      '/deletionReminder/clientDetail?externalUserid=' + row.externalUserid + '&followStaffId=' + row.staffId,
      {
        navList: [
          {
            name: '删人提醒',
            path: '/deletionReminder'
          },
          {
            name: '客户详情'
          }
        ]
      }
    );
  };
  // 查看聊天记录
  const viewChatList = (row: IDelStaffList) => {
    history.push('/deletionReminder/chatLog?partnerId=' + row.externalUserid + '&userId=' + row.userid, {
      clientInfo: row,
      navList: [
        { name: '删人提醒', path: '/deletionReminder' },
        { name: (row?.clientName ? row?.clientName + '的' : '') + '聊天记录' }
      ]
    });
  };

  return [
    {
      title: '删除客户',
      render (row: IDelStaffList) {
        return (
          <>
            <img className={style.avatar} src={row.clientAvatar} alt="头像" />
            <span className={style.nickName}>{row.clientName}</span>
          </>
        );
      }
    },
    {
      title: '所属客户经理',
      dataIndex: 'staffName',
      render (staffName: string) {
        return <>{staffName || UNKNOWN}</>;
      }
    },
    {
      title: '组织架构',
      dataIndex: 'deptName',
      render (deptName: string) {
        return (
          <span className={classNames(style.deptName, 'ellipsis')} title={deptName}>
            {deptName || UNKNOWN}
          </span>
        );
      }
    },
    { title: '客户经理上级', dataIndex: 'leaderName' },
    { title: '删除时间', dataIndex: 'deleteTime' },
    { title: '添加时间', dataIndex: 'addTime' },
    {
      title: '操作',
      width: 260,
      fixed: 'right',
      render: (row: IDelStaffList) => {
        return (
          <span className={style.operation}>
            <AuthBtn path="/clientInfo">
              <Button type="link" onClick={() => viewClientDetail(row)}>
                查看客户信息
              </Button>
            </AuthBtn>
            <AuthBtn path="/chatRecord">
              <Button type="link" disabled={row.isChatsyn === 0} onClick={() => viewChatList(row)}>
                查看聊天信息
              </Button>
            </AuthBtn>
            <AuthBtn path="/contactStaff">
              <Button disabled type="link">
                联系坐席
              </Button>
            </AuthBtn>
          </span>
        );
      }
    }
  ];
};
