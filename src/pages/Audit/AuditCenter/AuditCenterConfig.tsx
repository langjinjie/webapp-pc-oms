import React from 'react';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { SelectStaff } from 'src/pages/StaffManage/components';
import { AuditColumnsProp, auditTypeOptions, onOperateType, statusOptions } from '../AuditList/AuditListConfig';
import classNames from 'classnames';
import { AuthBtn } from 'src/components';

export const searchCols: SearchCol[] = [
  {
    name: 'applyList',
    type: 'custom',
    label: '申请人',
    width: '180px',
    customNode: <SelectStaff />
  },
  {
    name: 'applyType',
    type: 'select',
    label: '申请类型',
    placeholder: '请输入',
    width: '200px',
    options: auditTypeOptions
  },
  {
    name: 'curHandlerList',
    type: 'custom',
    label: '审批人',
    placeholder: '请输入',
    width: '280px',
    customNode: <SelectStaff />
  },
  {
    name: 'approvalNo',
    type: 'input',
    label: '申请编号',
    placeholder: '请输入',
    width: '280'
  },
  {
    name: 'applyBeginTime-applyEndTime',
    type: 'rangePicker',
    label: '申请时间',
    placeholder: '请输入',
    width: '280'
  }
];

export const TableColsFun = (onOperate: onOperateType): ColumnsType<AuditColumnsProp> => [
  {
    title: '申请编号',
    dataIndex: 'approvalNo',
    key: 'approvalNo',
    width: 200
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
    width: 200,
    render: (applyType) => auditTypeOptions.filter((item) => item.id === applyType)[0]?.name
  },
  {
    title: '申请好友数量',
    dataIndex: 'applyClientNum',
    key: 'applyClientNum',
    width: 200
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
    width: 200
  },
  {
    title: '操作',
    dataIndex: 'status',
    key: 'status',
    width: 240,
    fixed: 'right',
    render: (status, record) => {
      return (
        <>
          <AuthBtn path="/preview">
            <Button type="link" onClick={() => onOperate('view', record)}>
              查看审核详情
            </Button>
          </AuthBtn>
          {
            // 审批中的审批单可以撤回
            status === 0 && record.isMyselfLaunch === 1 && (
              <AuthBtn path="/cancel">
                <Button type="link" onClick={() => onOperate('outline', record)}>
                  撤回申请
                </Button>
              </AuthBtn>
            )
          }
        </>
      );
    }
  }
];
