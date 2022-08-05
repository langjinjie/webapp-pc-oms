import { Button, Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { UNKNOWN } from 'src/utils/base';
import { actionTypeList } from '../../RuleManage/List/ListConfig';

export interface TaskNodeColumns {
  nodeRuleId: string;
  nodeRuleCode: string;
  nodeRuleName: string;
  logicName: string;
  wayName: string;
  actionRuleId: string;
  actionRuleCode: string;
  actionRuleType: number;
  pushTime: string;
  speechcraft: string;
  createTime: string;
}
interface OperateProps {
  onOperate: (record: TaskNodeColumns) => void;
}
export const tableColumnsFun = (args: OperateProps): ColumnsType<TaskNodeColumns> => {
  return [
    { title: '节点动作规则编号', dataIndex: 'nodeRuleCode', key: 'nodeRuleCode', width: 180 },
    {
      title: '节点规则名称',
      dataIndex: 'nodeRuleName',
      key: 'nodeRuleName',
      ellipsis: true,
      width: 140
    },
    {
      title: '触发逻辑',
      dataIndex: 'logicName',
      ellipsis: true,
      width: 140,
      key: 'logicName',
      render: (categoryName: string) => categoryName || UNKNOWN
    },
    {
      title: '触达形式',
      dataIndex: 'wayName',
      width: 120
    },

    {
      title: '动作规则编号',
      dataIndex: 'actionRuleCode',
      width: 200
    },
    {
      title: '添加时间',
      dataIndex: 'createTime',
      width: 160
    },
    {
      title: '动作类型',
      dataIndex: 'actionRuleType',
      width: 120,
      render: (type) => actionTypeList.filter((item) => item.id === type)[0]?.name
    },
    {
      title: '建议推送时间',
      dataIndex: 'pushTime',
      width: 120,
      align: 'center'
    },
    {
      title: '操作',
      width: 80,
      align: 'center',
      fixed: 'right',
      render: (value, record) => {
        return (
          <Space size={20}>
            <Button type="link" key={record.nodeRuleId} onClick={() => args.onOperate(record)}>
              查看
            </Button>
          </Space>
        );
      }
    }
  ];
};
