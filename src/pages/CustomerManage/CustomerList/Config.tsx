import React from 'react';
import { ColumnsType } from 'antd/lib/table';
import { Avatar, Button, Form } from 'antd';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { SelectStaff, TagModal } from 'src/pages/StaffManage/components';
import { UserOutlined } from '@ant-design/icons';

export const searchCols: SearchCol[] = [
  { type: 'input', label: '客户名称', placeholder: '请输入', name: 'customerName' },
  {
    name: 'filterTag',
    type: 'custom',
    width: 100,
    label: '客户标签',
    customNode: (
      <Form.Item key={'filterTag'} name="filterTag" label="客户标签">
        <TagModal key={1} />
      </Form.Item>
    )
  },
  {
    type: 'rangePicker',
    name: 'date',
    label: '加好友时间'
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
  {
    name: 'staffList',
    type: 'custom',
    label: '',
    placeholder: '请输入',
    customNode: (
      <Form.Item key={'staffList'} name="staffList" label="所属客户经理组织架构">
        <SelectStaff key={2} type="dept" />
      </Form.Item>
    )
  }
];

interface CustomerColumn {
  [prop: string]: string;
}
export const TableColumnsFun = (viewItem: (record: CustomerColumn) => void): ColumnsType<CustomerColumn> => {
  return [
    {
      title: '客户名称',
      dataIndex: 'key1',
      render: (text, record) => {
        return (
          <div>
            <Avatar size={36} src={record.url} icon={<UserOutlined />} /> {text}
          </div>
        );
      }
    },
    {
      title: '所属客户经理',
      dataIndex: 'key2'
    },
    {
      title: '组织架构',
      dataIndex: 'key3'
    },
    {
      title: '渠道来源',
      dataIndex: 'key4'
    },
    {
      title: '客户标签',
      dataIndex: 'key5'
    },
    {
      title: '添加时间',
      dataIndex: 'key6'
    },
    {
      title: '操作',
      render: (text, record) => {
        return (
          <Button type="link" onClick={() => viewItem(record)}>
            查看客户详情
          </Button>
        );
      }
    }
  ];
};
