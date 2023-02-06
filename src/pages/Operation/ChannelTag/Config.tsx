import React from 'react';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import classNames from 'classnames';

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
}

export const SearchCols: SearchCol[] = [
  {
    name: 'groupName',
    label: '标签组名称',
    type: 'input',
    placeholder: '请输入'
  },
  {
    name: 'status',
    label: '',
    type: 'select',
    placeholder: '请选择',
    width: 84,
    options: [
      { name: '启动', id: 1 },
      { name: '停用', id: 2 }
    ]
  }
];

export const TableColumns: () => ColumnsType<any> = () => {
  return [
    { title: '标签组', dataIndex: 'groupName' },
    {
      title: '状态',
      dataIndex: 'status',
      render (status: string) {
        return (
          <>
            <i className={classNames('status-point', { 'status-point-gray': status === '2' })} />
          </>
        );
      }
    },
    { title: '标签值', dataIndex: '' },
    {
      title: '操作',
      dataIndex: '',
      render () {
        return (
          <>
            <span className={classNames('text-primary pointer')}>编辑</span>
            <span className={classNames('text-primary pointer')}>停用</span>
            <span className={classNames('text-primary pointer')}>删除</span>
          </>
        );
      }
    }
  ];
};
