import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { UNKNOWN } from 'src/utils/base';

export const searchCols: SearchCol[] = [
  {
    name: 'title',
    type: 'input',
    label: '客户昵称',
    width: '140px',
    placeholder: '请输入'
  },
  {
    name: 'title',
    type: 'input',
    label: '所属客户经理',
    width: '140px',
    placeholder: '请输入'
  },
  {
    name: 'syncBank',
    type: 'custom',
    width: 140,
    label: '客户标签',
    placeholder: '请选择',
    customNode: <div>客户标签</div>,
    options: [
      { id: 0, name: '技术部' },
      { id: 1, name: '设计部' },
      { id: 2, name: '外呼部门' }
    ]
  },
  {
    name: '',
    type: 'rangePicker',
    width: '140px',
    label: '添加时间'
  },
  {
    name: '',
    type: 'select',
    width: '140px',
    label: '账号状态'
  },
  {
    name: '',
    type: 'select',
    width: '140px',
    label: '转接状态'
  },
  {
    name: '',
    type: 'rangePicker',
    width: '140px',
    label: '转接时间'
  },
  {
    name: '',
    type: 'input',
    width: '140px',
    label: '转接原因'
  }
];
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
}
export const tableColumnsFun = (args: OperateProps): ColumnsType<StaffColumns> => {
  return [
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
