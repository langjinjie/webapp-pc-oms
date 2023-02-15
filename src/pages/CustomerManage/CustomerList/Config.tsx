import React from 'react';
import { ColumnsType } from 'antd/lib/table';
import { Avatar, Button, Form } from 'antd';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { SelectStaff, TagModal } from 'src/pages/StaffManage/components';
import { UserOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

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
      <Form.Item key={'staffList1'} name="staffList" label="所属客户经理组织架构">
        <SelectStaff key={2} type="dept" />
      </Form.Item>
    )
  }
];

interface CustomerColumn {
  [prop: string]: string;
}
export const TableColumnsFun = (): ColumnsType<CustomerColumn> => {
  const history = useHistory();
  // 查看客户信息
  const viewDetail = (record: any) => {
    console.log(record);
    history.push(
      '/customerManage/clientDetail?externalUserid=' + record.externalUserid + '&followStaffId=' + record.staffId,
      {
        navList: [
          {
            name: '客户信息',
            path: '/customerManage'
          },
          {
            name: '客户详情'
          }
        ]
      }
    );
  };
  // 去转接好友
  const transferCustomer = () => {
    history.push('/onjob');
  };
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
      fixed: 'right',
      width: 210,
      render: (text, record) => {
        return (
          <>
            <Button type="link" onClick={() => viewDetail(record)}>
              查看客户详情
            </Button>
            <Button type="link" onClick={transferCustomer}>
              去转接好友
            </Button>
          </>
        );
      }
    }
  ];
};
