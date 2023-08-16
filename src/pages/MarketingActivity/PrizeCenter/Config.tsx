import React from 'react';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components';
import { Button } from 'antd';

export const searchCols: SearchCol[] = [
  { name: '奖品批次', label: '奖品批次', type: 'input' },
  { name: '奖品名称', label: '奖品名称', type: 'input' },
  { name: '创建时间', label: '创建时间', type: 'rangePicker' }
];

export const TableColumns: (arg: { inventoryManage: (row: any) => void }) => ColumnsType = ({ inventoryManage }) => {
  return [
    { title: '奖品批次' },
    { title: '奖品名称' },
    { title: '奖品类型' },
    { title: '剩余库存' },
    { title: '创建时间' },
    { title: '状态' },
    { title: '操作人' },
    { title: '更新时间' },
    {
      title: '操作',
      render (row: any) {
        return (
          <>
            <Button type="link" onClick={() => inventoryManage(row)}>
              库存管理
            </Button>
            <Button type="link">上架</Button>
            <Button type="link">下架</Button>
            <Button type="link">修改</Button>
            <Button type="link">复制</Button>
          </>
        );
      }
    }
  ];
};
