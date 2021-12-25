import React from 'react';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { UNKNOWN } from 'src/utils/base';
import { Tooltip } from 'antd';

export const searchCols: SearchCol[] = [
  {
    name: 'name',
    type: 'input',
    label: '客户姓名',
    placeholder: '搜索客户姓名/车牌号码/外部联系人ID',
    width: 280
  },
  {
    name: 'name',
    type: 'input',
    label: '客户经理',
    placeholder: '',
    width: 180
  },
  {
    name: 'name',
    type: 'input',
    label: '添加理由',
    placeholder: '员工姓名',
    width: 180
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
    title: '客户姓名',
    dataIndex: 'name',
    width: 100,
    render: (value) => <span>{value || UNKNOWN}</span>
  },
  {
    title: '昵称',
    dataIndex: 'userId',
    align: 'left',
    width: 200,
    ellipsis: {
      showTitle: false
    }
  },
  {
    title: '车牌号码',
    dataIndex: 'userId',
    align: 'left',
    width: 200,
    ellipsis: {
      showTitle: false
    }
  },
  {
    title: '客户经理',
    dataIndex: 'jobNumber',
    align: 'left',
    width: 180,
    ellipsis: {
      showTitle: false
    },
    render: (name) => (
      <Tooltip placement="topLeft" title={name}>
        {name || UNKNOWN}
      </Tooltip>
    )
  },
  {
    title: '添加时间',
    align: 'left',
    dataIndex: 'position',
    width: 200,
    render: (value) => <span>{value || UNKNOWN}</span>
  },
  {
    title: '删除时间',
    align: 'left',
    dataIndex: 'position',
    width: 200,
    render: (value) => <span>{value || UNKNOWN}</span>
  },
  {
    title: '添加理由',
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
  }
];
