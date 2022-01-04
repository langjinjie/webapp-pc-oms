import React from 'react';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { UNKNOWN } from 'src/utils/base';

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
  },
  {
    name: 'time',
    type: 'select',
    label: '积分加减',
    placeholder: '请选择',
    width: 120,
    options: [
      {
        id: 1,
        name: '增加'
      },
      {
        id: 2,
        name: '扣减'
      }
    ]
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
    width: 130
  },
  {
    title: '积分加减',
    dataIndex: 'userId',
    align: 'left',
    width: 200,
    ellipsis: {
      showTitle: false
    }
  },
  {
    title: '操作人',
    dataIndex: 'userId',
    align: 'left',
    width: 200,
    ellipsis: {
      showTitle: false
    }
  },
  {
    title: '操作时间',
    dataIndex: 'userId',
    align: 'left',
    width: 200,
    ellipsis: {
      showTitle: false
    }
  },
  {
    title: '积分余额',
    dataIndex: 'userId',
    align: 'left',
    width: 200,
    ellipsis: {
      showTitle: false
    }
  },
  {
    title: '备注',
    align: 'left',
    dataIndex: 'position',
    width: 200,
    render: (value) => <span>{value || UNKNOWN}</span>
  }
];
