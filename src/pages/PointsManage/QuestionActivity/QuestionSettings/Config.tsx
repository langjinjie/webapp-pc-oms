import React from 'react';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';

export const QuestionTableColumns: (arg: { edit: (row: any) => void }) => ColumnsType<any> = ({ edit }) => {
  return [
    { title: '顺序' },
    { title: '题目名称' },
    { title: '题型' },
    { title: '分值' },
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
          </>
        );
      }
    }
  ];
};
