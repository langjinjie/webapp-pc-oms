import React from 'react';
import { ColumnsType } from 'antd/es/table';
import { Tag, Popconfirm, Space } from 'antd';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { Moment } from 'moment';

export interface SearchParamsProps {
  rangePicker: undefined | Moment[];
  title: string;
  categoryId: string;
  syncBank: string;
  corpId: string;
}

const setSearchCols = (options: any[]): SearchCol[] => {
  return [
    {
      name: 'title',
      type: 'input',
      label: '标题',
      placeholder: '请输入'
    },
    {
      name: 'categoryId',
      type: 'select',
      label: '分类',
      width: 160,
      options: options
    },
    {
      name: 'syncBank',
      type: 'select',
      label: '文章状态',
      width: 160,
      options: [
        { id: 0, name: '未上架' },
        { id: 1, name: '已上架' },
        { id: 2, name: '已下架' }
      ]
    },
    { name: 'rangePicker', type: 'rangePicker', label: '创建时间' }
  ];
};

export interface Article {
  newsId: string;
  title: string;
  key: string;
  age: number;
  address: string;
  syncBank: number;
  tags?: string[];
}

// 表哥配置项
type colargsType = {
  handleEdit: (record: any) => void;
  changeItemStatus: (record: any) => void;
  viewItem: (record: any) => void;
  deleteItem: (record: any) => void;
  handleTop: (record: any) => void;
};
const columns = (args: colargsType): ColumnsType<Article> => {
  const { handleEdit, changeItemStatus, viewItem, deleteItem, handleTop } = args;
  return [
    { title: '文章Id', dataIndex: 'newsId', key: 'newsId', width: 274 },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 196,
      ellipsis: { showTitle: true },
      render: (text: string, record: any) => (
        <a
          onClick={() => {
            viewItem(record);
          }}
        >
          {record.title}
        </a>
      )
    },
    {
      title: '分类',
      dataIndex: 'categoryName',
      width: 110,
      key: 'categoryName',
      align: 'center',
      render: (categoryName: string) => (categoryName ? <Tag className="category_tag"> {categoryName}</Tag> : '---')
    },
    {
      title: '标签',
      key: 'tagNameList',
      width: 260,
      align: 'center',
      dataIndex: 'tagNameList',
      render: (tagNameList: string[]) => (
        <>
          {tagNameList &&
            tagNameList.map((tag) => {
              return (
                <Tag className="green_tag" key={tag}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
          {tagNameList.length === 0 && '---'}
        </>
      )
    },
    {
      title: '发送次数',
      width: 120,
      key: 'sendCount',
      dataIndex: 'sendCount'
    },
    {
      title: '打开次数',
      width: 120,
      key: 'openCount',
      dataIndex: 'openCount'
    },
    {
      title: '分享次数',
      width: 120,
      key: 'relayCount',
      dataIndex: 'relayCount'
    },
    {
      title: '创建时间',
      key: 'createTime',
      dataIndex: 'createTime',
      width: 160
    },
    {
      title: '文章状态',
      key: 'syncBank',
      width: 120,
      dataIndex: 'syncBank',
      render: (text: number) => {
        return (
          <span>
            {text === 0
              ? (
              <span>
                <i className="tag-status-default"></i>
                <span>未上架</span>
              </span>
                )
              : text === 1
                ? (
              <span>
                <i className="tag-status-line"></i>
                <span>已上架</span>
              </span>
                  )
                : (
              <span>
                <i className="tag-status-outline"></i>
                <span>已下架</span>
              </span>
                  )}
          </span>
        );
      }
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 180,
      render: (text, record) => (
        <Space size="small">
          <a onClick={() => handleTop(record)}>置顶</a>
          <a onClick={() => handleEdit(record)}>编辑</a>
          <a onClick={() => changeItemStatus(record)}>{record.syncBank !== 1 ? '上架' : '下架'}</a>

          {record.syncBank !== 1 && (
            <Popconfirm title="您确定要删除?" onConfirm={() => deleteItem(record)}>
              <a>删除</a>
            </Popconfirm>
          )}
        </Space>
      )
    }
  ];
};

export { columns, setSearchCols };
