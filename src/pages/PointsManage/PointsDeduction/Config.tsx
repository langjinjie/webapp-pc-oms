import React from 'react';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { UNKNOWN } from 'src/utils/base';
import { Avatar, Button, Popconfirm, Tooltip } from 'antd';
import moment from 'moment';
import { AuthBtn } from 'src/components';

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
    label: '日期',
    placeholder: ['开始时间', '结束时间']
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

export const tableColumns = (batchDeduct: (record: DeductProps) => void): ColumnsType<DeductProps> => [
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
    title: '日期',
    dataIndex: 'date',
    align: 'left',
    width: 180,
    render: (value) => <span>{moment(value).format('YYYY-MM-DD') || UNKNOWN}</span>
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
    dataIndex: 'clientNickName',
    width: 200,
    render: (value, record) => (
      <div>
        <Avatar className="margin-right10" src={record.clientAvatar} alt="头像" />
        <span>{value}</span>
      </div>
    )
  },
  {
    title: '操作',
    fixed: 'right',
    render: (value, record) => (
      <AuthBtn path="/edit">
        <Popconfirm title="积分扣减提醒，是否确定扣减该客户经理积分？" onConfirm={() => batchDeduct(record)}>
          <Button type="link">扣减</Button>
        </Popconfirm>
      </AuthBtn>
    )
  }
];
