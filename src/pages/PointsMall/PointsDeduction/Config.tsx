import React from 'react';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { UNKNOWN } from 'src/utils/base';
import { Button } from 'antd';

export const searchCols: SearchCol[] = [
  {
    name: 'name',
    type: 'input',
    label: '客户经理姓名',
    placeholder: '请输入',
    width: 320
  },
  {
    name: 'time',
    type: 'rangePicker',
    label: '日期'
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
    dataIndex: 'name',
    width: 100
  },
  {
    title: '客户经理ID',
    dataIndex: 'userId',
    align: 'left',
    width: 200,
    ellipsis: {
      showTitle: false
    }
  },
  {
    title: '日期',
    dataIndex: 'jobNumber',
    align: 'left',
    width: 180,
    render: (value) => <span>{value || UNKNOWN}</span>
  },
  {
    title: '积分扣减',
    align: 'left',
    dataIndex: 'position',
    width: 200,
    render: (value) => <span>{value || UNKNOWN}</span>
  },
  {
    title: '积分扣减原因',
    dataIndex: 'freeType',
    width: 200,
    render: (value: string) => {
      return value.split(',').map((item, index: number) => {
        if (item === '1') {
          return <span>排行榜 {index + 1 < value.length ? '、' : ''}</span>;
        } else {
          return <span>战报</span>;
        }
      });
    }
    // <span>
    //   {value.indexOf('1') > -1 ? '排行榜 ' : null} {value.indexOf('2') > -1 ? ' 战报' : null}
    // </span>
  },
  {
    title: '删除的客户昵称',
    align: 'left',
    dataIndex: 'deptName',
    width: 200,
    render: (value) => <span>{value || UNKNOWN}</span>
  },
  {
    title: '操作',
    render: () => <Button type="link">扣减</Button>
  }
];
