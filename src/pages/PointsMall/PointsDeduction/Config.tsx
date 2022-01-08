import React from 'react';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { UNKNOWN } from 'src/utils/base';
import { Button, Tooltip } from 'antd';

export const searchCols: SearchCol[] = [
  {
    name: 'staffName',
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
export interface DeductProps {
  deductId: string;
  points: number;
  date: string;
  externalUserid: string;
  clientNickName: string;
  clientAvatar: string;
  deductPoints: number;
  reason: string;
  name: string; // 坐席姓名
  userId: string; // 企微账号
  seatsId: string; // 工号
  staffId: string;
  position: string; // 岗位名称
  freeType: string; // 免统计模块 1、排行榜，2、战报 多个用,分开
}

export const tableColumns = (): ColumnsType<DeductProps> => [
  {
    title: '客户经理姓名',
    dataIndex: 'staffName',
    width: 140
  },
  {
    title: '客户经理ID',
    dataIndex: 'staffId',
    align: 'left',
    width: 200,
    ellipsis: {
      showTitle: false
    }
  },
  {
    title: '日期',
    dataIndex: 'date',
    align: 'left',
    width: 180,
    render: (value) => <span>{value || UNKNOWN}</span>
  },
  {
    title: '积分扣减',
    align: 'left',
    dataIndex: 'deductPoints',
    width: 200,
    render: (value) => <span>{value || UNKNOWN}</span>
  },
  {
    title: '积分扣减原因',
    dataIndex: 'reason',
    width: 200,
    ellipsis: { showTitle: false },
    render: (text) => {
      return (
        <Tooltip placement="topLeft" title={text}>
          {text || UNKNOWN}
        </Tooltip>
      );
    }
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
