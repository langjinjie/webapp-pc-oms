import React from 'react';

import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { UNKNOWN } from 'src/utils/base';
import { Button, Popconfirm, Space } from 'antd';
import { Icon } from 'lester-ui';

export const searchCols: SearchCol[] = [
  {
    name: 'menuName',
    type: 'input',
    label: '菜单名称',
    placeholder: '请输入',
    width: 320
  },
  {
    name: 'status',
    type: 'select',
    label: '状态',
    placeholder: '请选择',
    width: 100,
    options: [
      { id: 1, name: '启用' },
      { id: 0, name: '关闭' }
    ]
  }
];

export const systemList = [
  {
    value: 1,
    label: 'M端（年高后管端）'
  },
  {
    value: 2,
    label: 'B端（机构管理端）'
  },
  {
    value: 3,
    label: 'A端（坐席管理端）'
  },
  {
    value: 4,
    label: 'A端（侧边栏）'
  },
  {
    value: 5,
    label: 'A端（移动端））'
  }
];

export const btnTypes = [
  {
    value: 1,
    label: '查询'
  },
  {
    value: 2,
    label: '增加'
  },
  {
    value: 3,
    label: '修改'
  },
  {
    value: 4,
    label: '删除'
  },
  {
    value: 5,
    label: '导出'
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
  sysType?: number;
  [prop: string]: any;
}

interface Operation {
  addSubMenu: (id: string) => void;
  editMenu: (id: string) => void;
  deleteItem: (id: string) => void;
  operateItem: (id: string, status: number) => void;
}
export const setTableColumns = ({
  addSubMenu,
  editMenu,
  deleteItem,
  operateItem
}: Operation): ColumnsType<MenuProps> => {
  return [
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
      dataIndex: 'menuType',
      width: 120,
      render: (value) => <span>{value === 1 ? '菜单' : '按钮'}</span>
    },
    {
      title: '状态',
      dataIndex: 'enable',
      width: 100,
      render: (enable) => <span>{enable ? '已启用' : '已关闭'}</span>
    },
    {
      title: '操作',
      dataIndex: 'sortId',
      width: 240,
      fixed: 'right',
      render: (text, record) => {
        return (
          <>
            <Space>
              <Button type="link" onClick={() => editMenu(record.menuId)}>
                编辑
              </Button>
              <Button type="link" onClick={() => addSubMenu(record.menuId)}>
                添加
              </Button>
              {record.enable === 1
                ? (
                <Popconfirm title="确定要关闭吗?" onConfirm={() => operateItem(record.menuId, 0)}>
                  <Button type="link">关闭</Button>
                </Popconfirm>
                  )
                : (
                <Popconfirm title="确定要启用吗?" onConfirm={() => operateItem(record.menuId, 1)}>
                  <Button type="link">启用</Button>
                </Popconfirm>
                  )}

              <Popconfirm title="确定要删除?" onConfirm={() => deleteItem(record.menuId)}>
                <Button type="link">删除</Button>
              </Popconfirm>
            </Space>
          </>
        );
      }
    }
  ];
};
