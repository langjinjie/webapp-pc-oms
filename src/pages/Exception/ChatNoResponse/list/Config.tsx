import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { UNKNOWN } from 'src/utils/base';

export const searchCols: SearchCol[] = [
  {
    name: 'nodeRuleCode',
    type: 'input',
    label: '规则名称',
    width: '200px',
    placeholder: '请输入'
  },
  {
    name: 'nodeRuleName',
    type: 'input',
    label: '超时提醒接收人',
    placeholder: '请输入',
    width: '200px'
  },
  {
    name: 'nodeRuleName',
    type: 'input',
    label: '升级提醒接收人',
    placeholder: '请输入',
    width: '200px'
  }
];
export const logSearchCols: SearchCol[] = [
  {
    name: 'nodeRuleCode',
    type: 'input',
    label: '客户经理姓名',
    width: '200px',
    placeholder: '请输入'
  },
  {
    name: 'nodeRuleName',
    type: 'input',
    label: '超时提醒时间',
    placeholder: '请输入',
    width: '200px'
  },
  {
    name: 'nodeRuleName',
    type: 'select',
    label: '提醒后是否回复',
    placeholder: '请输入',
    width: '200px'
  },
  {
    name: 'nodeRuleName',
    type: 'select',
    label: '升级后是否回复',
    placeholder: '请输入',
    width: '200px'
  }
];

interface RuleColumns {
  [prop: string]: any;
}
export const tableColumns: ColumnsType<RuleColumns> = [
  {
    title: '规则名称',
    dataIndex: 'nodeRuleCode',
    key: 'nodeRuleCode',
    ellipsis: true,
    width: 200
  },
  {
    title: '超时提醒时间段',
    dataIndex: 'nodeRuleName',
    key: 'nodeRuleName',
    width: 220
  },
  {
    title: '超时时间',
    dataIndex: 'nodeTypeName',
    width: 160,
    key: 'nodeTypeName',
    align: 'center',
    render: (categoryName: string) => categoryName || UNKNOWN
  },
  {
    title: '超时提醒接收人',
    dataIndex: 'nodeName',
    width: 260,
    align: 'center'
  },
  {
    title: '管理范围',
    dataIndex: 'logicName',
    width: 260,
    align: 'center'
  },
  {
    title: '工作日提醒升级',
    dataIndex: 'updateBy',
    width: 260,
    align: 'center'
  },
  {
    title: '升级提醒时间',
    dataIndex: 'updateTime',
    width: 260,
    render: (updateTime: string) => updateTime || UNKNOWN
  },
  {
    title: '升级提醒接收人',
    dataIndex: 'updateTime',
    width: 260,
    render: (updateTime: string) => updateTime || UNKNOWN
  },
  {
    title: '操作',
    dataIndex: 'updateTime',
    width: 260,
    render: () => (
      <>
        <Button type="link"> 编辑</Button>
        <Button type="link">删除</Button>
      </>
    )
  }
];
export const logTableColumns: ColumnsType<RuleColumns> = [
  {
    title: '客户经理姓名',
    dataIndex: 'nodeRuleCode',
    key: 'nodeRuleCode',
    ellipsis: true,
    width: 200
  },
  {
    title: '客户经理企微账号',
    dataIndex: 'nodeRuleName',
    key: 'nodeRuleName',
    width: 220
  },
  {
    title: '超时提醒时间',
    dataIndex: 'nodeTypeName',
    width: 160,
    key: 'nodeTypeName',
    align: 'center',
    render: (categoryName: string) => categoryName || UNKNOWN
  },
  {
    title: '提醒后是否回复',
    dataIndex: 'nodeName',
    width: 260,
    align: 'center'
  },
  {
    title: '升级后是否回复',
    dataIndex: 'logicName',
    width: 260,
    align: 'center'
  },
  {
    title: '客户昵称',
    dataIndex: 'updateBy',
    width: 260,
    align: 'center'
  },
  {
    title: '外包联系人ID',
    dataIndex: 'updateTime',
    width: 260,
    render: (updateTime: string) => updateTime || UNKNOWN
  }
];
