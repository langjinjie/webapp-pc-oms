import React from 'react';
import { Button } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { SearchCol } from 'src/components';

export const searchCols: SearchCol[] = [
  { name: '兑换码', label: '兑换码', type: 'input' },
  {
    name: '发放状态',
    label: '发放状态',
    type: 'select',
    options: [
      { id: 0, name: '未发放' },
      { id: 1, name: '已发放' }
    ]
  }
];

export const TableColumns: () => ColumnsType = () => {
  return [
    { title: '兑换码' },
    { title: '状态' },
    {
      title: '操作',
      render () {
        return <Button type="link">删除</Button>;
      }
    }
  ];
};
