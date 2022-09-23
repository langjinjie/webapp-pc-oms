import React from 'react';
import { Button, Form } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { SelectStaff /* , TagModal */ } from 'src/pages/StaffManage/components';

export const searchCols: (reasonCodeList: any[]) => SearchCol[] = () => {
  return [
    {
      name: 'leaderName',
      type: 'input',
      label: '所属团队长',
      placeholder: '请输入'
    },
    {
      name: 'staffNames',
      type: 'custom',
      label: '客户经理',
      customNode: (
        <Form.Item key={'staffNames'} name="staffNames" label="客户经理">
          <SelectStaff key={1} type="staff" />
        </Form.Item>
      )
    },
    {
      name: 'date',
      type: 'date',
      label: '选择时间'
      // width: '140px',
      // placeholder: '请输入'
    },
    {
      name: 'deptIds',
      type: 'custom',
      width: 120,
      label: '组织架构',
      customNode: (
        <Form.Item key={'deptIds'} name="deptIds" label="组织架构">
          <SelectStaff key={1} type="dept" />
        </Form.Item>
      )
    },
    {
      name: 'unloginCountWeek',
      label: '近7日未登录次数',
      type: 'inputNumber',
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

export const tableColumnsFun = (isShow: boolean): ColumnsType<IUnLoginStaffList> => {
  // 催催他
  const viewChatList = (row: IUnLoginStaffList) => {
    console.log('催催他', row);
  };

  return [
    { title: '客户经理', dataIndex: 'staffName' },
    { title: '所属团队长', dataIndex: 'leaderName' },
    { title: '组织架构', dataIndex: 'deptName' },
    { title: '未登录日期', dataIndex: 'unloginDate' },
    { title: '上次登录时间', dataIndex: 'lastLoginTime' },
    { title: '本周内未登录天数', dataIndex: 'unloginCountWeek' },
    {
      title: '操作',
      width: 200,
      render: (row: IUnLoginStaffList) => {
        return (
          isShow && (
            <Button type="link" onClick={() => viewChatList(row)} disabled={true}>
              催催他
            </Button>
          )
        );
      }
    }
  ];
};
