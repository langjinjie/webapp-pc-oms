import { Button, Popconfirm } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { UNKNOWN } from 'src/utils/base';
import { OnOperateType } from 'src/utils/interface';

export const searchCols: SearchCol[] = [
  {
    type: 'input',
    name: 'name',
    label: '群活码名称',
    placeholder: '请输入'
  },
  {
    type: 'input',
    name: 'liveId',
    label: '群活码Id',
    placeholder: '请输入'
  },
  {
    type: 'rangePicker',
    name: 'createStartTime-createEndTime',
    label: '创建时间'
  },
  {
    type: 'date',
    name: 'expireDate',
    label: '有效期',
    placeholder: '请输入'
  }
];

export type ChatGroupLiveCodeType = {
  liveId: string;
  name: string;
  chatNames: string;
  staffId: string;
  staffName: string;
  expireDate: string;
  createBy: string;
  dateCreated: string;
  lastUpdated: string;
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
export const tableColsFun = (onOperate: OnOperateType): ColumnsType<ChatGroupLiveCodeType> => {
  return [
    {
      key: 'liveId',
      dataIndex: 'liveId',
      title: '群活码ID',
      ellipsis: true,

      width: 160
    },
    {
      key: 'name',
      dataIndex: 'name',
      title: '群活码名称',
      render: (text) => wcTypeOptions.filter((type) => type.value === text)[0]?.name || UNKNOWN,
      width: 160
    },

    {
      key: 'chatNames',
      dataIndex: 'chatNames',
      title: '群名称',
      ellipsis: true,
      width: 160
    },
    {
      key: 'updateBy',
      dataIndex: 'updateBy',
      title: '有效期',
      ellipsis: true,
      width: 160
    },
    // {
    //   key: 'staffName',
    //   dataIndex: 'staffName',
    //   title: '使用员工',
    //   ellipsis: true,
    //   width: 200
    // },
    {
      key: 'lastUpdated',
      dataIndex: 'lastUpdated',
      title: '创建人',
      ellipsis: true,
      width: 200
    },
    {
      key: 'lastUpdated',
      dataIndex: 'lastUpdated',
      title: '创建时间',
      ellipsis: true,
      width: 200
    },

    {
      key: 'name',
      dataIndex: 'name',
      title: '操作',
      fixed: 'right',
      width: 180,
      render: (_, record, index) => (
        <>
          <Button type="link" onClick={() => onOperate('edit', record)}>
            编辑
          </Button>
          <Popconfirm
            title="删除后二维码将失效无法使用，且无法恢复，请谨慎操作"
            onConfirm={() => onOperate('delete', record, index)}
          >
            <Button type="link">删除</Button>
          </Popconfirm>
          <Button type="link" onClick={() => onOperate('other', record)}>
            复制短链
          </Button>
        </>
      )
    }
  ];
};
