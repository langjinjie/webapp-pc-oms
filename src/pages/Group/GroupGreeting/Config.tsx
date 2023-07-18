import { Button, Popconfirm } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { AuthBtn } from 'src/components';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { UNKNOWN } from 'src/utils/base';
import { OnOperateType } from 'src/utils/interface';

export const searchCols: SearchCol[] = [
  {
    type: 'input',
    name: 'title',
    label: '欢迎语标题',
    placeholder: '请输入'
  }
];

export type GreetingColType = {
  name: string;
  title: string;
  wcId: string;
  templateId: string;
  wcType: number;
  content: string;
  status: number;
  lastUpdated: string;
  updateBy: string;
  [prop: string]: any;
};

const wcTypeOptions = [
  {
    value: 1,
    name: '文字'
  },
  {
    value: 2,
    name: '图片'
  },
  {
    value: 3,
    name: '链接'
  },
  {
    value: 4,
    name: '小程序'
  }
];
export const tableColsFun = (onOperate: OnOperateType): ColumnsType<GreetingColType> => {
  return [
    {
      key: 'title',
      dataIndex: 'title',
      title: '欢迎语标题',
      ellipsis: true,

      width: 160
    },
    {
      key: 'wcType',
      dataIndex: 'wcType',
      title: '欢迎语类型',
      render: (text) => wcTypeOptions.filter((type) => type.value === text)[0]?.name || UNKNOWN,
      width: 160
    },

    {
      key: 'dateCreated',
      dataIndex: 'dateCreated',
      title: '创建时间',
      ellipsis: true,
      width: 160
    },
    {
      key: 'updateBy',
      dataIndex: 'updateBy',
      title: '操作人',
      ellipsis: true,
      width: 160
    },
    {
      key: 'lastUpdated',
      dataIndex: 'lastUpdated',
      title: '最后修改时间',
      ellipsis: true,
      width: 200
    },

    {
      key: 'name',
      dataIndex: 'name',
      title: '操作',
      fixed: 'right',
      width: 140,
      render: (_, record, index) => (
        <>
          <AuthBtn path="/edit">
            <Button type="link" onClick={() => onOperate('edit', record)}>
              修改
            </Button>
          </AuthBtn>
          <AuthBtn path="/preview">
            <Button type="link" onClick={() => onOperate('view', record)}>
              预览
            </Button>
          </AuthBtn>
          <AuthBtn path="/delete">
            <Popconfirm title="确定删除？" onConfirm={() => onOperate('delete', record, index)}>
              <Button type="link">删除</Button>
            </Popconfirm>
          </AuthBtn>
        </>
      )
    }
  ];
};
