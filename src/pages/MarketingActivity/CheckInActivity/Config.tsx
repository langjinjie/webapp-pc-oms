import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { SearchCol } from 'src/components';

type TTableColumns = (params: {
  putOrDown: (row: any) => void;
  edit: (row: any) => void;
  copyActivity: (row: any) => void;
}) => ColumnsType<any>;

export const searchCols: SearchCol[] = [
  { label: '活动编号', name: '活动编号', type: 'input', placeholder: '请输入' },
  { label: '活动名称', name: '活动名称', type: 'input', placeholder: '请输入' },
  { label: '创建时间', name: 'createTimeStart-createTimeEnd', type: 'rangePicker' },
  {
    label: '状态',
    name: '状态',
    type: 'select',
    options: [
      { id: 0, name: '未上架' },
      { id: 1, name: '未开始' },
      { id: 2, name: '进行中' },
      { id: 3, name: '已结束' },
      { id: 4, name: '已下架' }
    ]
  }
];

export const TableColumns: TTableColumns = ({ putOrDown, edit, copyActivity }) => {
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
      render (row: any) {
        return (
          <>
            <Button type="link" onClick={() => putOrDown(row)}>
              上架
            </Button>
            <Button type="link" onClick={() => putOrDown(row)}>
              下架
            </Button>
            <Button type="link" onClick={() => edit(row)}>
              修改
            </Button>
            <Button type="link" onClick={() => copyActivity(row)}>
              复制
            </Button>
          </>
        );
      }
    }
  ];
};
