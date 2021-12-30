import React from 'react';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { Button } from 'antd';

export const searchCols: SearchCol[] = [
  {
    name: 'name',
    type: 'input',
    label: '客户经理姓名',
    placeholder: '请输入',
    width: 320
  }
];
export interface StaffProps {
  name: string; // 坐席姓名
  userId: string; // 企微账号
  seatsId: string; // 工号
  staffId: string;
  position: string; // 岗位名称
  freeType: string; // 免统计模块 1、排行榜，2、战报 多个用,分开
}

export const tableColumns = (): ColumnsType<StaffProps> => [
  {
    title: '客户经理姓名',
    dataIndex: 'name'
  },
  {
    title: '积分余额',
    dataIndex: 'userId',
    align: 'left'
  },
  {
    title: '操作',
    render: () => (
      <>
        <Button type="link">增加</Button>
        <Button type="link">扣减</Button>
      </>
    )
  }
];
