import React from 'react';

import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { UNKNOWN } from 'src/utils/base';
import { Button, Space } from 'antd';
import { Icon } from 'lester-ui';

export const searchCols: SearchCol[] = [
  {
    name: 'name',
    type: 'input',
    label: '菜单名称',
    placeholder: '请输入',
    width: 320
  },
  {
    name: 'status',
    type: 'select',
    label: '状态',
    options: [{ id: '1', name: '已启用' }]
  }
];

export interface MenuProps {
  menuId: string;
  fullMenuId: string;
  menuName: string;
  menuIcon?: string;
  menuType: number;
  path?: string;
  deploymentMode?: number;
  buttonType?: number;
  domain?: string;
  parentId?: string;
  level: number;
  isLeaf: number;
  sortId: number;
  enable: number;
  children?: MenuProps[];
}
export const setTableColumns = (): ColumnsType<MenuProps> => {
  return [
    // {
    //   title: '序号',
    //   width: 80,
    //   render: (text, record, index) => index + 1
    // },
    {
      title: '菜单名称',
      dataIndex: 'menuName',
      width: 320,
      render: (value, record) => (
        <span>
          {record.menuIcon && <Icon name={record.menuIcon!} />} {value || UNKNOWN}
        </span>
      )
    },
    {
      title: '排序',
      dataIndex: 'sortId',
      width: 120,
      render: (value) => <span>{value || UNKNOWN}</span>
    },
    {
      title: '路由地址',
      dataIndex: 'path',
      width: 220,
      render: (value) => <span>{value || UNKNOWN}</span>
    },
    {
      title: '菜单类型',
      dataIndex: 'sortId',
      width: 320,
      render: (value) => <span>{value || UNKNOWN}</span>
    },
    {
      title: '状态',
      dataIndex: 'sortId',
      width: 100,
      render: (value) => <span>{value || UNKNOWN}</span>
    },
    {
      title: '操作',
      dataIndex: 'sortId',
      width: 240,
      fixed: 'right',
      render: () => {
        return (
          <>
            <Space>
              <Button type="link">编辑</Button>
              <Button type="link">添加</Button>
              <Button type="link">关闭</Button>
              <Button type="link">删除</Button>
            </Space>
          </>
        );
      }
    }
  ];
};
