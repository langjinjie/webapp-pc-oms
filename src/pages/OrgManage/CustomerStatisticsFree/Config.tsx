import React from 'react';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components';
import { UNKNOWN } from 'src/utils/base';
import { Tooltip } from 'antd';

export const searchCols: SearchCol[] = [
  {
    name: 'condition',
    type: 'input',
    label: '客户姓名',
    placeholder: '搜索客户姓名/车牌号码/外部联系人ID',
    width: 280
  },
  {
    name: 'staffName',
    type: 'input',
    label: '客户经理',
    placeholder: '待输入',
    width: 180
  },
  {
    name: 'addReason',
    type: 'input',
    label: '添加理由',
    placeholder: '待输入',
    width: 180
  }
];
export interface CustomerProps {
  name: string; // 坐席姓名
  userId: string; // 企微账号
  seatsId: string; // 工号
  staffId: string;
  position: string; // 岗位名称
  freeType: string; // 免统计模块 1、排行榜，2、战报 多个用,分开
  externalUserId: string;
  isDeleted: boolean;
}

export const tableColumns = (): ColumnsType<CustomerProps> => [
  {
    title: '客户姓名',
    dataIndex: 'remarkName',
    width: 130,
    render: (value) => <span>{value || UNKNOWN}</span>
  },
  {
    title: '外部联系人Id',
    dataIndex: 'externalUserId',
    width: 320,
    render: (value) => <span>{value || UNKNOWN}</span>
  },
  {
    title: '昵称',
    dataIndex: 'name',
    align: 'left',
    width: 140,
    ellipsis: {
      showTitle: false
    }
  },
  {
    title: '车牌号码',
    dataIndex: 'carNumber',
    align: 'left',
    width: 140,
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
    title: '客户经理',
    dataIndex: 'staffNames',
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
    dataIndex: 'dateCreated',
    width: 200,
    render: (value) => <span>{value || UNKNOWN}</span>
  },
  {
    title: '删除时间',
    align: 'left',
    dataIndex: 'dateDeleted',
    width: 200,
    render: (value) => <span>{value || UNKNOWN}</span>
  },
  {
    title: '添加理由',
    dataIndex: 'addReason',
    width: 180,
    ellipsis: {
      showTitle: false
    },
    render: (name) => (
      <Tooltip placement="topLeft" title={name}>
        {name || UNKNOWN}
      </Tooltip>
    )
  }
];
