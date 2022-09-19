import React from 'react';
import { Button, Form } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
// import { UNKNOWN } from 'src/utils/base';
import { SelectStaff /* , TagModal */ } from 'src/pages/StaffManage/components';
// import classNames from 'classnames';

export const searchCols: (reasonCodeList: any[]) => SearchCol[] = () => {
  return [
    {
      name: 'staffList',
      type: 'custom',
      label: '所属客户经理',
      customNode: (
        <Form.Item key={'staffList'} name="staffList" label="所属客户经理">
          <SelectStaff key={1} type="staff" />
        </Form.Item>
      )
    },
    {
      name: 'type',
      type: 'input',
      label: '删除客户',
      placeholder: '请输入'
    },
    {
      name: 'assignTime',
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
      customNode: (
        <Form.Item key={'deptList'} name="deptList" label="所属客户经理">
          <SelectStaff key={1} type="dept" />
        </Form.Item>
      )
    },
    {
      name: 'takeoverTime',
      label: '客户经理上级',
      type: 'input',
      placeholder: '请输入'
    }
  ];
};

export interface IUnLoginStaffList {
  staffId: string;
  staffName: string;
  leaderName: string;
  deptName: string;
  unloginDate: string;
  lastLoginTime: string;
  unloginCountWeek: number;
}

export const tableColumnsFun = (): ColumnsType<IUnLoginStaffList> => {
  // 催催他
  const viewChatList = (row: IUnLoginStaffList) => {
    console.log('催催他', row);
  };

  return [
    { title: '客户经理', dataIndex: 'staffName' },
    { title: '所属团队长', dataIndex: 'IUnLoginStaffList' },
    { title: '组织架构', dataIndex: 'deptName' },
    { title: '分配原因', dataIndex: 'reasonName' },
    { title: '未登录日期', dataIndex: 'unloginDate' },
    { title: '上次登录时间', dataIndex: 'lastLoginTime' },
    { title: '近7天未登录次数', dataIndex: 'unloginCountWeek' },
    {
      title: '操作',
      width: 200,
      render: (row: IUnLoginStaffList) => {
        return (
          <Button type="link" onClick={() => viewChatList(row)}>
            催催TA
          </Button>
        );
      }
    }
  ];
};
