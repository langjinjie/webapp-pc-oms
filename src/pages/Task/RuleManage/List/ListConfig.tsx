import React from 'react';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { UNKNOWN } from 'src/utils/base';
import { AuthBtn } from 'src/components';

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
export const actionTypeList = [
  { id: 1, name: '文章' },
  { id: 2, name: '海报' },
  { id: 3, name: '产品' },
  { id: 4, name: '活动' },
  { id: 5, name: '话术' },
  {
    id: 11,
    name: '朋友圈Feed-文章'
  },
  {
    id: 12,
    name: '朋友圈Feed-产品'
  },
  {
    id: 13,
    name: '朋友圈Feed-活动'
  },
  {
    id: 14,
    name: '朋友圈Feed-单张海报'
  },
  { id: 15, name: '朋友圈Feed-9宫格海报' }
];
export const nodeSearchColsFun = (options: any[]): SearchCol[] => [
  {
    name: 'nodeRuleCode',
    type: 'input',
    label: '节点规则编号',
    width: '200px',
    placeholder: '请输入'
  },
  {
    name: 'nodeRuleName',
    type: 'input',
    label: '节点规则名称',
    placeholder: '请输入',
    width: '200px'
  },
  {
    name: 'nodeTypeCode',
    type: 'select',
    label: '节点类别',
    options: options,
    selectNameKey: 'typeName',
    selectValueKey: 'typeCode',
    placeholder: '请输入',
    width: '150px'
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
    options: actionTypeList
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
      dataIndex: 'actionRuleType',
      key: 'actionRuleName',
      width: 120,
      render: (actionRuleType) => actionTypeList.filter((item) => item.id === actionRuleType)[0]?.name || UNKNOWN
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
          <AuthBtn path="/view">
            <Button type="link" key={record.actionRuleId} onClick={() => args.onOperate(record.actionRuleId)}>
              查看
            </Button>
          </AuthBtn>
        );
      }
    }
  ];
};
