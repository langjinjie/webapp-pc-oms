import { Button, Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { UNKNOWN } from 'src/utils/base';

interface TaskNodeColumns {
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
  onOperate: () => void;
}
export const tableColumnsFun = (args: OperateProps): ColumnsType<TaskNodeColumns> => {
  return [
    { title: '节点动作规则编号', dataIndex: 'sceneCode', key: 'sceneCode', width: 160 },
    {
      title: '节点规则名称',
      dataIndex: 'sceneName',
      key: 'sceneName',
      width: 140
    },
    {
      title: '触发逻辑',
      dataIndex: 'categoryName',
      width: 140,
      key: 'categoryName',
      align: 'center',
      render: (categoryName: string) => categoryName || UNKNOWN
    },
    {
      title: '动作规则名称',
      dataIndex: 'nodeId',
      width: 140,
      align: 'center'
    },
    {
      title: '触达形式',
      dataIndex: 'nodeId',
      width: 120,
      align: 'center'
    },
    {
      title: '添加时间',
      dataIndex: 'updateBy',
      width: 160,
      align: 'center'
    },
    {
      title: '动作类型',
      dataIndex: 'updateTime',
      width: 120,
      align: 'center'
    },
    {
      title: '建议推送时间',
      dataIndex: 'updateTime',
      width: 120,
      align: 'center'
    },
    {
      title: '操作',
      dataIndex: 'fromSource',
      width: 80,
      align: 'center',
      fixed: 'right',
      render: (value, record) => {
        return (
          <Space size={20}>
            <Button type="link" key={record.nodeRuleId} onClick={() => args.onOperate()}>
              查看
            </Button>
          </Space>
        );
      }
    }
  ];
};
