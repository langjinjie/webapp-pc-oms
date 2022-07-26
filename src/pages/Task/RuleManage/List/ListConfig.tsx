import React from 'react';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { UNKNOWN } from 'src/utils/base';

export const ruleTypeOptions = [
  {
    value: '1',
    title: '节点规则管理'
  },
  {
    value: '2',
    title: '动作规则管理'
  }
];

export const nodeSearchCols: SearchCol[] = [
  {
    name: 'nodeRuleCode',
    type: 'input',
    label: '节点规则编号',
    width: '220px',
    placeholder: '请输入'
  },
  {
    name: 'nodeRuleName',
    type: 'input',
    label: '节点规则名称',
    placeholder: '请输入',
    width: '220px'
  }
];
export const actionSearchCols: SearchCol[] = [
  {
    name: 'actionRuleCode',
    type: 'input',
    label: '动作规则编号',
    width: '220px',
    placeholder: '请输入'
  },
  {
    name: 'actionRuleType',
    type: 'select',
    label: '动作规则类型',
    placeholder: '请输入',
    width: '220px',
    options: [
      { id: 1, name: '文章' },
      { id: 2, name: '海报' },
      { id: 3, name: '产品' },
      { id: 4, name: '活动' },
      { id: 5, name: '话术' }
    ]
  },
  {
    name: 'contentSource',
    type: 'select',
    label: '内容来源',
    placeholder: '请输入',
    width: '220px',
    options: [
      { id: 1, name: '公有库' },
      { id: 2, name: '机构库' }
    ]
  }
];

export interface RuleColumns {
  nodeRuleId: string;
  nodeRuleCode: string;
  nodeRuleName: string;
  nodeTypeName: string;
  nodeName: string;
  logicName: string;
  updateTime: string;
  updateBy: string;
}

interface OperateProps {
  onOperate: (actionRuleId: string) => void;
}

export const tableColumns: ColumnsType<RuleColumns> = [
  {
    title: '节点规则编号',
    dataIndex: 'nodeRuleCode',
    key: 'nodeRuleCode',
    width: 200
  },
  {
    title: '节点规则名称',
    dataIndex: 'nodeRuleName',
    key: 'nodeRuleName',
    width: 200
  },
  {
    title: '节点类别',
    dataIndex: 'nodeTypeName',
    width: 160,
    key: 'nodeTypeName',
    align: 'center',
    render: (categoryName: string) => categoryName || UNKNOWN
  },
  {
    title: '触发节点',
    dataIndex: 'nodeName',
    width: 260,
    align: 'center'
  },
  {
    title: '触发逻辑',
    dataIndex: 'logicName',
    width: 260,
    align: 'center'
  },
  {
    title: '规则修改人',
    dataIndex: 'updateBy',
    width: 260,
    align: 'center'
  },
  {
    title: '规则修改时间',
    dataIndex: 'updateTime',
    width: 260,
    render: (updateTime: string) => updateTime || UNKNOWN
  }
];

export interface ActionRuleColumns {
  actionRuleId: string;
  actionRuleCode: string;
  actionRuleName: string;
  actionRuleType: number;
  contentSource: number;
  updateTime: string;
  updateBy: string;
}
export const actionTableColumnsFun = (args: OperateProps): ColumnsType<ActionRuleColumns> => {
  return [
    {
      title: '动作规则编号',
      dataIndex: 'actionRuleCode',
      key: 'actionRuleCode',
      width: 200
    },
    {
      title: '动作类型',
      dataIndex: 'actionRuleName',
      key: 'actionRuleName',
      width: 160,
      render: (actionRuleType) => actionRuleType
    },
    {
      title: '内容来源',
      dataIndex: 'contentSource',
      width: 140,
      key: 'contentSource',
      align: 'center',
      render: (contentSource) => <span>{contentSource === 1 ? '公有库' : '机构库'} </span>
    },
    {
      title: '动作规则修改人',
      dataIndex: 'updateBy',
      width: 130
    },
    {
      title: '动作规则修改时间',
      dataIndex: 'updateTime',
      width: 260,
      render: (updateTime: string) => updateTime || UNKNOWN
    },
    {
      title: '操作',
      width: 260,
      align: 'center',
      render: (value, record) => {
        return (
          <Button type="link" key={record.actionRuleId} onClick={() => args.onOperate(record.actionRuleId)}>
            查看
          </Button>
        );
      }
    }
  ];
};
