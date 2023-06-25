import React from 'react';
import { Button, Popconfirm, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { auditTypeOptions } from '../AuditList/AuditListConfig';
import { UNKNOWN } from 'src/utils/base';
import { AuthBtn } from 'src/components';

interface FailedProps {
  time: string;
  [prop: string]: any;
}

interface TableColsFunParams {
  preView: (record: FailedProps) => void;
}
export const TableColsFun = ({ preView }: TableColsFunParams): ColumnsType<FailedProps> => [
  {
    title: '序号',
    width: 200,
    render (_, __, index) {
      return <span>{index + 1}</span>;
    }
  },
  {
    title: '审批类型',
    dataIndex: 'type',
    key: 'type',
    width: 200,
    render: (type) => auditTypeOptions.filter((item) => item.id === type)[0]?.name || UNKNOWN
  },
  {
    title: '更新人',
    dataIndex: 'opName',
    key: 'opName',
    width: 200
  },
  {
    title: '更新时间',
    dataIndex: 'opTime',
    key: 'opTime',
    width: 200
  },

  {
    title: '操作',
    key: 'operate',
    width: 110,
    fixed: 'right',
    render: (text, record) => {
      return (
        <AuthBtn path="/preview">
          <Button
            type="link"
            onClick={() => {
              preView(record);
            }}
          >
            查看审核链
          </Button>
        </AuthBtn>
      );
    }
  }
];

export interface AuditFlowProps {
  flowId: string;
  type: number;
  launchUserid: string;
  launchStaffName: string;
  launchDeptName: string;
  launchMangeRoleName: string;
  mode: number;
  remark: string;
  nodeList: {
    nodeId: string;
    handlerUserid: string;
    launchStaffName: string;
    launchDeptName: string;
    launchMangeRoleName: string;
  }[];
}

const modeOptions = [
  { id: 1, name: '依次审批' },
  { id: 2, name: '自动审批' }
];
export const TableColsFunOfDetail = ({
  onOperate
}: {
  onOperate: (record: any) => void;
}): ColumnsType<AuditFlowProps> => [
  {
    title: '审批类型',
    dataIndex: 'type',
    width: 140,
    render: (type) => auditTypeOptions.filter((item) => item.id === type)[0]?.name || UNKNOWN
  },
  {
    title: '发起人姓名',
    dataIndex: 'launchStaffName',
    key: 'launchStaffName',
    width: 120
  },
  {
    title: '发起人企微账号',
    dataIndex: 'launchUserid',
    key: 'launchUserid',
    width: 130,
    render (launchUserid) {
      return launchUserid || UNKNOWN;
    }
  },
  {
    title: '发起人所在部门',
    dataIndex: 'launchDeptName',
    key: 'launchDeptName',
    width: 200
  },

  {
    title: '审批方式',
    dataIndex: 'mode',
    key: 'mode',
    width: 100,
    render (mode) {
      return modeOptions.filter((item) => item.id === mode)[0]?.name || UNKNOWN;
    }
  },
  // {
  //   title: '审批人一企微账号',
  //   dataIndex: 'sceneName',
  //   key: 'sceneName',
  //   width: 200
  // },
  // {
  //   title: '审批人一姓名',
  //   dataIndex: 'sceneName',
  //   key: 'sceneName',
  //   width: 200
  // },
  // {
  //   title: '组织架构',
  //   dataIndex: 'sceneName',
  //   key: 'sceneName',
  //   width: 200
  // },
  {
    title: '审批人姓名',
    dataIndex: 'handlerStaffName',
    key: 'handlerStaffName',
    width: 200
  },
  {
    title: '审批人所在部门',
    dataIndex: 'handlerDeptName',
    key: 'handlerDeptName',
    width: 200
  },
  {
    title: '审批人B端角色名称',
    dataIndex: 'handlerMangeRoleName',
    key: 'handlerMangeRoleName',
    width: 200,
    ellipsis: { showTitle: false },
    render: (handlerMangeRoleName) => {
      return (
        <Tooltip placement="topLeft" title={handlerMangeRoleName}>
          {handlerMangeRoleName || UNKNOWN}
        </Tooltip>
      );
    }
  },
  {
    title: '发起人B端角色',
    dataIndex: 'launchMangeRoleName',
    key: 'launchMangeRoleName',
    width: 200
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    width: 200
  },

  {
    title: '操作',
    dataIndex: 'sceneName',
    key: 'sceneName',
    width: 100,
    fixed: 'right',
    render: (text, record) => {
      return (
        <>
          <AuthBtn path="/preview/delete">
            <Popconfirm title="确定要删除?" onConfirm={() => onOperate(record)}>
              <Button type="link">删除</Button>
            </Popconfirm>
          </AuthBtn>
        </>
      );
    }
  }
];
