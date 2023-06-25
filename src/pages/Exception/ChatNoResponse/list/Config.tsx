import { Button, Popconfirm } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { UNKNOWN } from 'src/utils/base';
import { OnOperateType } from 'src/utils/interface';

export const searchCols: SearchCol[] = [
  {
    name: 'ruleName',
    type: 'input',
    label: '规则名称',
    width: '200px',
    placeholder: '请输入'
  },
  {
    name: 'timeoutRemindReceiverName',
    type: 'input',
    label: '超时提醒接收人',
    placeholder: '请输入',
    width: '200px'
  },
  {
    name: 'updateRemindReceiverName',
    type: 'input',
    label: '升级提醒接收人',
    placeholder: '请输入',
    width: '200px'
  }
];

const replyOptions = [
  { id: 0, name: '否' },
  {
    id: 1,
    name: '是'
  }
];
export const logSearchCols: SearchCol[] = [
  {
    name: 'staffName',
    type: 'input',
    label: '客户经理姓名',
    width: '200px',
    placeholder: '请输入'
  },
  {
    name: 'timeoutRemindBeginTime-timeoutRemindEndTime',
    type: 'rangePicker',
    label: '超时提醒时间',
    width: '200px'
  },
  {
    name: 'timeoutReply',
    type: 'select',
    label: '提醒后是否回复',
    placeholder: '请输入',
    options: replyOptions,
    width: '200px'
  },
  {
    name: 'timeoutUpdateReply',
    type: 'select',
    label: '升级后是否回复',
    placeholder: '请输入',
    options: replyOptions,
    width: '200px'
  }
];

export interface RuleColumns {
  [prop: string]: any;
}
export const tableColumnsFun = (onOperate: OnOperateType<RuleColumns>): ColumnsType<RuleColumns> => [
  {
    title: '规则名称',
    dataIndex: 'ruleName',
    key: 'ruleName',
    ellipsis: true,
    width: 200
  },
  {
    title: '超时提醒时间段',
    dataIndex: 'remindBeginTime-remindEndTime',
    key: 'remindBeginTime-remindEndTime',
    render: (text: string, record: RuleColumns) => record.remindBeginTime + '-' + record.remindEndTime,
    width: 160
  },
  {
    title: '超时时间',
    dataIndex: 'replyTimeout',
    width: 160,
    key: 'replyTimeout',
    align: 'center',
    render: (replyTimeout: number) =>
      replyTimeout ? `${Math.floor(replyTimeout / 60)}分钟 ${replyTimeout % 60}秒` : UNKNOWN
  },
  {
    title: '超时提醒接收人',
    dataIndex: 'timeoutRemindReceivers',
    key: 'timeoutRemindReceivers',
    width: 260,
    ellipsis: true,
    render: (timeoutRemindReceivers) => {
      return timeoutRemindReceivers?.map((item: any) => item.staffName).join(',');
    }
  },
  {
    title: '管理范围',
    dataIndex: 'manScopes',
    ellipsis: true,
    width: 260,
    render: (manScopes) => {
      return manScopes?.map((item: any) => item.deptName).join(',');
    }
  },
  {
    title: '工作日提醒升级',
    dataIndex: 'workDayRemindUpdate',
    width: 260,
    render: (workDayRemindUpdate) => (workDayRemindUpdate === 0 ? '否' : '是')
  },
  {
    title: '升级提醒时间',
    dataIndex: 'updateTimeout',
    width: 260,
    render: (updateTimeout: number) =>
      updateTimeout ? `${Math.floor(updateTimeout / 60)}分钟 ${updateTimeout % 60}秒` : UNKNOWN
  },
  {
    title: '升级提醒接收人',
    dataIndex: 'updateRemindReceivers',
    width: 260,
    render: (updateRemindReceivers: any[]) =>
      updateRemindReceivers?.map((item: any) => item.staffName).join(',') || UNKNOWN
  },
  {
    title: '操作',
    dataIndex: 'updateTime',
    width: 120,
    fixed: 'right',
    render: (_, record, index) => (
      <>
        <Button type="link" onClick={() => onOperate('edit', record, index)}>
          编辑
        </Button>
        <Popconfirm title="是否确定删除规则" onConfirm={() => onOperate('delete', record, index)}>
          <Button type="link">删除</Button>
        </Popconfirm>
      </>
    )
  }
];
export const logTableColumns: ColumnsType<RuleColumns> = [
  {
    title: '客户经理姓名',
    dataIndex: 'staffName',
    key: 'staffName',
    ellipsis: true,
    width: 200
  },
  {
    title: '客户经理企微账号',
    dataIndex: 'userid',
    key: 'userid',
    width: 220
  },
  {
    title: '超时提醒时间',
    dataIndex: 'timeoutRemindTime',
    width: 160,
    key: 'timeoutRemindTime',
    align: 'center',
    render: (timeoutRemindTime: string) => timeoutRemindTime || UNKNOWN
  },
  {
    title: '提醒后是否回复',
    dataIndex: 'timeoutReply',
    width: 260,
    render: (text) => replyOptions.filter((option) => option.id === text)[0]?.name || UNKNOWN,
    align: 'center'
  },
  {
    title: '升级后是否回复',
    dataIndex: 'timeoutUpdateReply',
    width: 140,
    render: (text) => replyOptions.filter((option) => option.id === text)[0]?.name || UNKNOWN,
    align: 'center'
  },
  {
    title: '客户昵称',
    dataIndex: 'clientName',
    width: 140,
    align: 'center'
  },
  {
    title: '外包联系人ID',
    dataIndex: 'externalUserid',
    width: 260,
    render: (externalUserid: string) => externalUserid || UNKNOWN
  }
];
