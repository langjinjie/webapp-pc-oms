import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { UNKNOWN } from 'src/utils/base';

export const searchCols: SearchCol[] = [
  {
    name: 'title',
    type: 'input',
    label: '员工姓名',
    width: '268px',
    placeholder: '请输入'
  },
  {
    name: 'syncBank',
    type: 'select',
    width: 160,
    label: '部门',
    placeholder: '请选择',
    options: [
      { id: 0, name: '技术部' },
      { id: 1, name: '设计部' },
      { id: 2, name: '外呼部门' }
    ]
  },
  {
    name: 'title',
    type: 'rangePicker',
    label: '离职时间',
    width: '268px'
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
    { title: '员工姓名', dataIndex: 'key1', key: 'key1', width: 100 },
    {
      title: '部门/组别',
      dataIndex: 'key2',
      key: 'key2',
      width: 200
    },
    {
      title: '客户数',
      dataIndex: 'key3',
      width: 160,
      key: 'key3',
      align: 'center',
      render: (nodeName: string) => nodeName || UNKNOWN
    },
    {
      title: '离职时间',
      dataIndex: 'key4',
      width: 260,
      align: 'center'
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
    value: 20
  },
  {
    key: 'key2',
    title: '商业险到期客户',
    value: 17
  },
  {
    key: 'key3',
    title: '交强险到期客户',
    value: 3
  },
  {
    key: 'key4',
    title: '医疗险到期客户',
    value: 0
  }
];
