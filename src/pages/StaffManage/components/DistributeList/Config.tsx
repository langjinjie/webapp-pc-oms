import React from 'react';
import { Button, Form } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { UNKNOWN } from 'src/utils/base';
import { SelectStaff, TagModal } from 'src/pages/StaffManage/components';

export const searchCols: (reasonCodeList: any[], distributeLisType: 0 | 1) => SearchCol[] = (
  reasonCodeList,
  distributeLisType
) => {
  const searchColsList: SearchCol[] = [
    {
      name: 'clientName',
      type: 'input',
      label: '客户昵称',
      width: '140px',
      placeholder: '请输入'
    },
    {
      name: 'staffList',
      type: 'custom',
      label: '所属客户经理',
      placeholder: '请输入',
      customNode: (
        <Form.Item key={'staffList'} name="staffList" label="所属客户经理">
          <SelectStaff key={1} />
        </Form.Item>
      )
    },
    // 搜索自定义Form表单
    {
      name: 'filterTag',
      type: 'custom',
      width: 140,
      label: '客户标签',
      customNode: (
        <Form.Item key={'filterTag'} name="filterTag" label="客户标签">
          <TagModal key={1} />
        </Form.Item>
      )
    },
    {
      name: 'addTime',
      type: 'rangePicker',
      width: '140px',
      label: '添加时间'
    },
    {
      name: 'staffStatus',
      type: 'select',
      width: '140px',
      label: '账号状态',
      options: [
        { id: 1, name: '已激活' },
        { id: 2, name: '已禁用' },
        { id: 3, name: '未激活' }
      ]
    },
    {
      name: 'transferStatus',
      type: 'select',
      width: '140px',
      label: '转接状态',
      options: [
        { id: 1, name: '转接中（发起在职转接，但是客户还未接受）' },
        { id: 2, name: '已转接（客户已经接受转接或者自动转接成功）' },
        { id: 3, name: '已拒绝（客户手工点击拒绝接受转接）' },
        { id: 4, name: '已转接（90天无法转接）' },
        { id: 5, name: '已拒绝（成员已超过最大客户数）' }
      ]
    },
    {
      name: 'takeoverTime',
      type: 'rangePicker',
      width: '140px',
      label: '转接时间'
    },
    {
      name: 'reasonCode',
      type: 'select',
      width: '140px',
      label: '转接原因',
      options: reasonCodeList
    }
  ];
  if (distributeLisType) {
    searchColsList.pop();
  }
  return searchColsList;
};
export const searchCols1: SearchCol[] = [
  {
    name: 'title',
    type: 'input',
    label: '客户姓名',
    width: '180px',
    placeholder: '请输入'
  },
  {
    name: 'syncBank',
    type: 'select',
    width: 180,
    label: '联系情况',
    placeholder: '请选择',
    options: [
      { id: 0, name: '近3天有联系' },
      { id: 1, name: '近7天有联系' },
      { id: 2, name: '近30天有联系' }
    ]
  }
];

export interface StaffColumns {
  key1: string;
  key2: string;
  key3: string;
  key4: string;
  key5: string;
  key6: string;
  key7: string;
}

interface OperateProps {
  onOperate: () => void;
  distributeLisType: 0 | 1;
}
export const tableColumnsFun = (args: OperateProps): ColumnsType<StaffColumns> => {
  const columnList: ColumnsType<StaffColumns> = [
    { title: '员工昵称', dataIndex: 'key1', key: 'key1', width: 100 },
    {
      title: '所属客户经理',
      dataIndex: 'key2',
      key: 'key2',
      width: 200
    },
    {
      title: '账号状态',
      dataIndex: 'key3',
      width: 160,
      key: 'key3',
      align: 'center',
      render: (nodeName: string) => nodeName || UNKNOWN
    },
    {
      title: '客户标签',
      dataIndex: 'key4',
      width: 260,
      align: 'center'
    },
    {
      title: '转接状态'
    },
    {
      title: '转接时间'
    },
    {
      title: '添加时间'
    },
    {
      title: '转接原因'
    },
    {
      title: '操作',
      width: 260,
      align: 'center',
      render: (value, record) => {
        return (
          <Button type="link" key={record.key1} onClick={() => args.onOperate()}>
            客户列表
          </Button>
        );
      }
    }
  ];
  if (args.distributeLisType) {
    columnList.filter((filterItem) => filterItem.title !== '转接原因');
  }
  return columnList;
};

export const clientTypeList = [
  {
    key: 'key1',
    title: '全部客户',
    value: 12
  },
  {
    key: 'key2',
    title: '商业险到期客户',
    value: 4
  },
  {
    key: 'key3',
    title: '交强险到期客户',
    value: 7
  },
  {
    key: 'key4',
    title: '医疗险到期客户',
    value: 1
  }
];
