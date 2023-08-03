import React from 'react';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { SelectStaff /* , TagModal */ } from 'src/pages/StaffManage/components';
import { AuthBtn } from 'src/components';
import { UNKNOWN } from 'src/utils/base';
import classNames from 'classnames';
import style from './style.module.less';

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
      customNode: <SelectStaff type="staff" />
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
      customNode: <SelectStaff type="dept" />
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
  return [
    { title: '客户经理', dataIndex: 'staffName' },
    { title: '所属团队长', dataIndex: 'leaderName' },
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
    { title: '未登录日期', dataIndex: 'unloginDate' },
    { title: '上次登录时间', dataIndex: 'lastLoginTime' },
    { title: '本周内未登录天数', dataIndex: 'unloginCountWeek', align: 'center' },
    {
      title: '操作',
      width: 200,
      render: () => {
        return (
          isShow && (
            <AuthBtn path="/contactStaff">
              <Button type="link" disabled={true}>
                催催他
              </Button>
            </AuthBtn>
          )
        );
      }
    }
  ];
};
