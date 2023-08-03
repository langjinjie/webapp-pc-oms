import React from 'react';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { OperateType } from 'src/utils/interface';
import { SelectStaff } from 'src/pages/StaffManage/components';
import classNames from 'classnames';
import { UNKNOWN } from 'src/utils/base';
import { AuthBtn } from 'src/components';
// 0-审核中；1-审批通过；2-审批不通过；3-撤回；4-自动审批通过
export const statusOptions = [
  { id: 0, name: '审核中' },
  {
    id: 1,
    name: '审批通过'
  },
  {
    id: 2,
    name: '审批不通过'
  },
  {
    id: 3,
    name: '已撤销'
  },
  {
    id: 4,
    name: '自动审批通过'
  }
];

export const auditTypeOptions = [
  { name: '离职继承审批', id: 1 },
  { name: '知识库审批', id: 2 }
];
export const searchCols: SearchCol[] = [
  {
    name: 'applyList',
    width: '180px',
    placeholder: '请输入',
    type: 'custom',
    label: '申请人',

    customNode: <SelectStaff />
  },
  {
    name: 'applyType',
    type: 'select',
    label: '申请类型',
    placeholder: '请选择',
    width: '200px',
    options: auditTypeOptions
  },
  {
    name: 'curHandlerList',
    type: 'custom',
    label: '审批人',
    placeholder: '请输入',
    width: '280px',
    customNode: <SelectStaff key={1} />
  },
  {
    name: 'approvalNo',
    type: 'input',
    label: '申请编号',
    placeholder: '请输入',
    width: '280'
  },
  {
    name: 'status',
    type: 'select',
    label: '审批状态',
    placeholder: '请输入',
    width: '200px',
    options: statusOptions
  }
];

export interface AuditColumnsProp {
  approvalNo: string;
  applyId: string;
  applyUserid: string;
  applyStaffName: string;
  applyTime: string;
  applyType: number;
  flowId: string;
  flowName: string;
  curHandlerUserid: string;
  curHandlerStaffName: string;
  status: number;
  [prop: string]: any;
}

export type onOperateType = (type: OperateType, record: AuditColumnsProp) => void;

export const TableColsFun = (onOperate: onOperateType): ColumnsType<AuditColumnsProp> => [
  {
    title: '申请编号',
    dataIndex: 'approvalNo',
    key: 'approvalNo',
    width: 210
  },
  {
    title: '申请人',
    dataIndex: 'applyStaffName',
    key: 'applyStaffName',
    width: 200
  },
  {
    title: '申请时间',
    dataIndex: 'applyTime',
    key: 'applyTime',
    width: 200
  },
  {
    title: '申请类型',
    dataIndex: 'applyType',
    key: 'applyType',
    width: 170,
    render: (applyType) => auditTypeOptions.filter((item) => item.id === applyType)[0]?.name || UNKNOWN
  },
  {
    title: '申请好友数量',
    dataIndex: 'applyClientNum',
    key: 'applyClientNum',
    width: 160
  },
  {
    title: '审批链',
    dataIndex: 'flowName',
    key: 'flowName',
    width: 200
  },
  {
    title: '当前审批人',
    dataIndex: 'curHandlerStaffName',
    key: 'curHandlerStaffName',
    width: 200
  },
  {
    title: '审批状态',
    dataIndex: 'status',
    key: 'status',
    width: 200,
    render: (text) => {
      return (
        <span>
          <i
            className={classNames({
              'status-point status-point-green': text === 1 || text === 4,
              'status-point status-point-red': text === 2,
              'status-point': text === 0 || text === 3
            })}
          ></i>
          {statusOptions.filter((item) => item.id === text)[0]?.name}
        </span>
      );
    }
  },
  {
    title: '审批时间',
    dataIndex: 'auditTime',
    key: 'auditTime',
    width: 200,
    render (auditTime) {
      return auditTime || UNKNOWN;
    }
  },
  {
    title: '操作',
    dataIndex: 'sceneName',
    key: 'sceneName',
    width: 200,
    fixed: 'right',
    render: (text, record) => {
      return (
        <AuthBtn path="/preview">
          <Button
            type="link"
            onClick={() => {
              onOperate('view', record);
            }}
          >
            查看审核详情
          </Button>
        </AuthBtn>
      );
    }
  }
];

export interface AuditCustomerColumn {
  handoverStaffid: string;
  handoverStaffName: string;
  handoverDeptName: string;
  takeoverStaffid: string;
  takeoverStaffName: string;
  takeoverDeptName: string;
  externalUserid: string;
  nickName: string;
  applyTime: string;
}
export const TableColsOfCustomer: ColumnsType<AuditCustomerColumn> = [
  {
    title: '客户昵称',
    dataIndex: 'nickName',
    key: 'nickName',
    width: 200
  },
  {
    title: '原有所属客户经理',
    dataIndex: 'handoverStaffName',
    key: 'handoverStaffName',
    width: 200
  },
  {
    title: '原有所属客户经理组织架构',
    dataIndex: 'handoverDeptName',
    key: 'handoverDeptName',
    width: 200
  },
  {
    title: '接替客户经理',
    dataIndex: 'takeoverStaffName',
    key: 'takeoverStaffName',
    width: 200
  },
  {
    title: '接替客户经理组织架构',
    dataIndex: 'takeoverDeptName',
    key: 'takeoverDeptName',
    width: 200
  },
  {
    title: '发起转接时间',
    dataIndex: 'applyTime',
    key: 'applyTime',
    width: 200
  }
];
