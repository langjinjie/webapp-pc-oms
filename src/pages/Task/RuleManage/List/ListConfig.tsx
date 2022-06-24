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
    name: 'sceneCode',
    type: 'input',
    label: '节点规则编号',
    width: '220px',
    placeholder: '请输入'
  },
  {
    name: 'sceneName',
    type: 'input',
    label: '节点规则名称',
    placeholder: '请输入',
    width: '220px'
  },
  {
    name: 'sceneName',
    type: 'input',
    label: '触发节点',
    placeholder: '请输入',
    width: '220px'
  },
  {
    name: 'sceneName',
    type: 'input',
    label: '节点类别',
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
  onOperate: () => void;
}
export const tableColumnsFun = (args: OperateProps): ColumnsType<RuleColumns> => {
  return [
    {
      title: '节点规则编号',
      dataIndex: 'sceneCode',
      key: 'sceneCode',
      width: 200
    },
    {
      title: '节点规则名称',
      dataIndex: 'sceneName',
      key: 'sceneName',
      width: 200
    },
    {
      title: '节点类别',
      dataIndex: 'categoryName',
      width: 160,
      key: 'categoryName',
      align: 'center',
      render: (categoryName: string) => categoryName || UNKNOWN
    },
    {
      title: '触发节点',
      dataIndex: 'nodeId',
      width: 260,
      align: 'center'
    },
    {
      title: '触发逻辑',
      dataIndex: 'nodeId',
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
      align: 'center'
    },
    {
      title: '操作',
      dataIndex: 'fromSource',
      width: 260,
      align: 'center',
      render: (value, record) => {
        return (
          <Button type="link" key={record.nodeRuleId} onClick={() => args.onOperate()}>
            查看
          </Button>
        );
      }
    }
  ];
};
export const actionTableColumnsFun = (args: OperateProps): ColumnsType<RuleColumns> => {
  return [
    {
      title: '动作规则编号',
      dataIndex: 'sceneCode',
      key: 'sceneCode',
      width: 200
    },
    {
      title: '动作类型',
      dataIndex: 'sceneName',
      key: 'sceneName',
      width: 200
    },
    {
      title: '内容来源',
      dataIndex: 'categoryName',
      width: 160,
      key: 'categoryName',
      align: 'center',
      render: (categoryName: string) => categoryName || UNKNOWN
    },
    {
      title: '动作规则修改人',
      dataIndex: 'nodeId',
      width: 260,
      align: 'center'
    },
    {
      title: '动作规则修改时间',
      dataIndex: 'updateTime',
      width: 260,
      align: 'center'
    },
    {
      title: '操作',
      dataIndex: 'fromSource',
      width: 260,
      align: 'center',
      render: (value, record) => {
        return (
          <Button type="link" key={record.nodeRuleId} onClick={() => args.onOperate()}>
            查看
          </Button>
        );
      }
    }
  ];
};
