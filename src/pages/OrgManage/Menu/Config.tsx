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
}
export const setTableColumns = ({ addSubMenu, editMenu }: Operation): ColumnsType<MenuProps> => {
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
              <Button type="link">关闭</Button>
              <Button type="link">删除</Button>
            </Space>
          </>
        );
      }
    }
  ];
};
