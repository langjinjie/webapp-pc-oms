import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { SearchCol } from 'src/components';

export const searchCols: SearchCol[] = [
  { label: '活动编号', name: '活动编号', type: 'input' },
  { label: '活动名称', name: '活动名称', type: 'input' },
  { label: '创建时间', name: 'createTimeStart-createTimeEnd', type: 'rangePicker' }
];

export const TableColumns: () => ColumnsType<any> = () => {
  return [
    { title: '活动编号' },
    { title: '活动名称' },
    { title: '活动时间' },
    { title: '活动时间' },
    { title: '状态' },
    { title: '创建时间' },
    { title: '操作人' },
    { title: '更新时间' },
    {
      title: '操作',
      render () {
        return (
          <>
            <Button type="link">上架</Button>
            <Button type="link">修改</Button>
            <Button type="link">复制</Button>
          </>
        );
      }
    }
  ];
};
