import React from 'react';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { UNKNOWN } from 'src/utils/base';

export const searchCols: SearchCol[] = [
  {
    name: 'name',
    type: 'input',
    label: '员工姓名',
    placeholder: '员工姓名',
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
    title: '姓名',
    dataIndex: 'name',
    width: 100
  },
  {
    title: '企微账号',
    dataIndex: 'userId',
    align: 'left',
    width: 200,
    ellipsis: {
      showTitle: false
    }
  },
  {
    title: '员工工号',
    dataIndex: 'jobNumber',
    align: 'left',
    width: 180,
    render: (value) => <span>{value || UNKNOWN}</span>
  },
  {
    title: '职务',
    align: 'left',
    dataIndex: 'position',
    width: 200,
    render: (value) => <span>{value || UNKNOWN}</span>
  },
  {
    title: '免统计模块',
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
    title: '部门',
    align: 'left',
    dataIndex: 'deptName',
    width: 200,
    render: (value) => <span>{value || UNKNOWN}</span>
  }
];
