import React from 'react';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { SelectOrg } from '../../CustomerManage/components';
import { ColumnsType } from 'antd/lib/table';
import { Button } from 'antd';
import classNames from 'classnames';
import style from './style.module.less';

export interface ISalesLeadRow {
  leadId: string; //  是 线索ID
  channel?: string; //  否 渠道来源
  createTime: string; //  是 创建时间，yyyy-MM-dd HH:mm:ss
  status: number; //  是 线索状态，1-待分配，2-已分配，3-自动分配，4-撤回，5-再分配
  nickName?: string; //  否 客户昵称
  phone?: string; //  否 手机号码
  carNumber?: string; //  否 车牌号
  fromStaffName?: string; //  否 分享人
  fromFullDeptNmae?: string; //  否 分享人部门全称
  followName?: string; //  否 跟进人
  followFullDeptName?: string; //  否 跟进人部门全称
  remark?: string; //  否 备注
}

export const leadStatus = [
  { id: 1, name: '待分配' },
  { id: 2, name: '已分配' },
  { id: 3, name: '自动分配' },
  { id: 4, name: '撤回' },
  { id: 5, name: '再分配' }
];

const leadStatusToOption: { [key: string]: string } = {
  1: '分配',
  2: '撤回',
  3: '/',
  4: '再分配',
  5: '撤回'
};

// 搜索字段配置
export const searchCols: SearchCol[] = [
  { name: 'channel', label: '渠道来源', type: 'input', placeholder: '' },
  { name: 'leadId', label: '线索ID', type: 'input' },
  { name: 'status', label: '线索状态', type: 'select', options: leadStatus },
  { name: 'phone', label: '手机号', type: 'input' },
  { name: 'carNumber', label: '车牌号', type: 'input' },
  { name: 'nickName', label: '客户昵称', type: 'input' },
  {
    name: 'fromStaffName',
    label: '分享人',
    type: 'custom',
    customNode: <SelectOrg singleChoice />
  },
  {
    name: 'fromDeptId',
    label: '分享人组织架构',
    type: 'custom',
    customNode: <SelectOrg type="dept" singleChoice />
  },
  {
    name: 'followName',
    label: '跟进人',
    type: 'custom',
    customNode: <SelectOrg singleChoice />
  },
  {
    name: 'followDept',
    label: '跟进人部门',
    type: 'custom',
    customNode: <SelectOrg type="dept" singleChoice />
  },
  {
    name: 'createTimeBegin-createTimeEnd',
    label: '创建时间',
    type: 'rangePicker'
  }
];

// Table表头配置
export const tableColumns: (edit: (row: ISalesLeadRow) => void) => ColumnsType<ISalesLeadRow> = (edit) => {
  return [
    { title: '线索ID', dataIndex: 'leadId' },
    { title: '渠道来源', dataIndex: 'channel' },
    { title: '创建时间', dataIndex: 'createTime' },
    {
      title: '线索状态',
      dataIndex: 'status',
      render (status: number) {
        return <>{leadStatus.find(({ id }) => id === status)?.name}</>;
      }
    },
    { title: '客户昵称', dataIndex: 'nickName' },
    { title: '手机号码', dataIndex: 'phone' },
    { title: '车牌号', dataIndex: 'carNumber' },
    { title: '分享人', dataIndex: 'fromStaffName' },
    {
      title: '分享人组织架构',
      dataIndex: 'fromFullDeptNmae',
      render (fromFullDeptNmae: string) {
        return (
          <span className={classNames(style.text, 'ellipsis inline-block width280')} title={fromFullDeptNmae}>
            {fromFullDeptNmae}
          </span>
        );
      }
    },
    { title: '跟进人', dataIndex: 'followName' },
    {
      title: '跟进入组织架构',
      dataIndex: 'followFullDeptName',
      render (followFullDeptName: string) {
        return (
          <span className={classNames(style.text, 'ellipsis inline-block width280')} title={followFullDeptName}>
            {followFullDeptName}
          </span>
        );
      }
    },
    { title: '备注', dataIndex: 'remark' },
    {
      title: '操作',
      fixed: 'right',
      render (row: ISalesLeadRow) {
        return (
          /*
          分配操作 => 状态: 待分配 - 1
          撤回操作 => 状态: 已分配/再分配 - [2,5]
          再分配操作 => 状态: 撤回 - 4
          状态为自动分配不能进行任何操作
           */
          <Button type="link" onClick={() => edit(row)}>
            {leadStatusToOption[row.status.toString()]}
          </Button>
        );
      }
    }
  ];
};
