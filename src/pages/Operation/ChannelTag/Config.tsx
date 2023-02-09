import React from 'react';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import classNames from 'classnames';
import style from './style.module.less';

export interface IChannelItem {
  groupId: string; // 是 标签组id
  groupName: string; // 是 标签组名称
  status: number; // 是 状态，1-启用，2-停用
  canDel: number; // 是 是否可以删除和停用，1-允许，2-不允许
  tagList: IChannelTagList[]; // 是 标签值列表
}
export interface IChannelTagList {
  tagId: string; // 是 标签id
  tagName: string; // 是 标签名称
  canDel: number; // 是 是否可以删除，1-允许，2-不允许
}

export const statusList = [
  { id: 1, name: '启用' },
  { id: 2, name: '停用' }
];

export const SearchCols: SearchCol[] = [
  {
    name: 'groupName',
    label: '标签组名称',
    type: 'input',
    placeholder: '请输入'
  },
  {
    name: 'status',
    label: '标签组状态',
    type: 'select',
    placeholder: '请选择',
    width: 84,
    options: [
      { name: '启动', id: 1 },
      { name: '停用', id: 2 }
    ]
  }
];

export const TableColumns: (
  editHandle: (row: IChannelItem) => void,
  manageChannelGroupHandle: (value: IChannelItem, type: number) => Promise<any>
) => ColumnsType<any> = (editHandle, manageChannelGroupHandle) => {
  return [
    { title: '标签组', dataIndex: 'groupName' },
    {
      title: '状态',
      dataIndex: 'status',
      render (status: number) {
        return (
          <span>
            <i className={classNames('status-point', { 'status-point-gray': status === 2 })} />
            {statusList.find((statusItem) => statusItem.id === status)?.name}
          </span>
        );
      }
    },
    {
      title: '标签值',
      dataIndex: 'tagList',
      render (tagList: IChannelTagList[]) {
        return (
          <>
            {tagList
              .map((tagItem) => tagItem.tagName)
              .toString()
              .replace(/,/g, '，')}
          </>
        );
      }
    },
    {
      title: '操作',
      render (value: IChannelItem) {
        return (
          <>
            <span className={classNames(style.edit, 'text-primary pointer mr6')} onClick={() => editHandle(value)}>
              编辑
            </span>
            <span
              className={classNames(
                style.stop,
                { disabled: value.canDel === 2 || value.status === 2 },
                'text-primary pointer mr6'
              )}
              onClick={() => manageChannelGroupHandle(value, 1)}
            >
              停用
            </span>
            <span
              className={classNames(style.del, { disabled: value.canDel === 2 }, 'text-primary pointer')}
              onClick={() => manageChannelGroupHandle(value, 2)}
            >
              删除
            </span>
          </>
        );
      }
    }
  ];
};
