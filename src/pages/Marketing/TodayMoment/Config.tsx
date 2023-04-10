import React from 'react';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { Button } from 'antd';
export const searchCol: SearchCol[] = [
  { name: '', label: '今日朋友圈名称', type: 'input', placeholder: '请输入' },
  {
    name: '',
    label: '状态',
    type: 'select',
    options: [
      { id: 1, name: '已上架' },
      { id: 0, name: '未上架' }
    ]
  }
];

interface ITableColumnsFunProps {
  // 上架
  onlineHandle: (row: any) => void;
  // 设置可见范围
  setRight: (row: any) => void;
}

export const tableColumnsFun: ({ onlineHandle }: ITableColumnsFunProps) => ColumnsType<any> = ({
  onlineHandle,
  setRight
}) => {
  return [
    { title: '今日朋友圈ID', dataIndex: '' },
    { title: '今日朋友圈名称', dataIndex: '' },
    { title: '创建时间', dataIndex: '' },
    { title: '修改时间', dataIndex: '' },
    { title: '修改人', dataIndex: '' },
    { title: '状态', dataIndex: '' },
    { title: '上架机构', dataIndex: '' },
    {
      title: '操作',
      fixed: 'right',
      render (row: any) {
        return (
          <>
            <Button type="link" onClick={() => onlineHandle(row)}>
              上架
            </Button>
            <Button type="link">编辑</Button>
            <Button type="link" onClick={() => setRight(row)}>
              配置可见范围
            </Button>
          </>
        );
      }
    }
  ];
};
