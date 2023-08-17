import React from 'react';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';

type TTableColumns = (arg: { edit: (row: any) => void; del: (row: any) => void }) => ColumnsType<any>;

export const TableColumns: TTableColumns = ({ edit, del }) => {
  return [
    { title: '奖励分值' },
    { title: '奖品名称' },
    { title: '已发数量' },
    { title: '奖励数量' },
    { title: '奖品批次' },
    { title: '奖品过期时间' },
    { title: '操作人' },
    { title: '更新时间' },
    {
      title: '操作',
      render (row: any) {
        return (
          <>
            <Button type="link" onClick={() => edit(row)}>
              修改
            </Button>
            <Button type="link" onClick={() => del(row)}>
              删除
            </Button>
          </>
        );
      }
    }
  ];
};
