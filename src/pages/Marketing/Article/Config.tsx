import React, { useContext } from 'react';
import { ColumnsType } from 'antd/es/table';
import { Tag, Popconfirm, Space, Tooltip } from 'antd';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import moment, { Moment } from 'moment';
import { UNKNOWN } from 'src/utils/base';
import classNames from 'classnames';
import { Context } from 'src/store';

export interface SearchParamsProps {
  rangePicker: undefined | Moment[];
  title: string;
  fromSource: string;
  categoryId: string;
  syncBank: string;
  corpId: string;
}

export const recommendTypeList = [
  {
    id: 0,
    name: '文章'
  },
  {
    id: 2,
    name: '产品'
  },
  {
    id: 1,
    name: '活动'
  },
  {
    id: 3,
    name: '无'
  }
];
const setSearchCols = (options: any[]): SearchCol[] => {
  return [
    {
      name: 'title',
      type: 'input',
      label: '文章标题',
      width: '268px',
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
      name: 'recommendType',
      type: 'select',
      label: '推荐内容',
      width: 160,
      options: recommendTypeList
    },
    {
      name: 'fromSource',
      type: 'input',
      label: '渠道来源',
      width: '268px',
      placeholder: '请输入'
    },
    { name: 'rangePicker', width: '268px', type: 'rangePicker', label: '创建时间' },
    {
      name: 'syncBank',
      type: 'select',
      width: 160,
      label: '状态',

      options: [
        { id: 0, name: '未上架' },
        { id: 1, name: '已上架' },
        { id: 2, name: '已下架' }
      ]
    }
  ];
};
enum StatusEnum {
  '未上架' = 0,
  '已上架',
  '已下架'
}
export interface Article {
  newsId: string;
  title: string;
  key: string;
  age: number;
  address: string;
  syncBank: number;
  isTop: boolean;
  tags?: string[];
  corpNames: string[];
}
export interface PaginationProps {
  current: number;
  pageSize: number;
  total: number;
  showTotal: (total: any) => string;
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
  const { isMainCorp } = useContext(Context);
  // if (isMainCorp) {
  return [
    { title: '文章Id', dataIndex: 'newsId', key: 'newsId', width: 300 },
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
      render: (categoryName: string) => categoryName || UNKNOWN
    },
    {
      title: '渠道来源',
      dataIndex: 'fromSource',
      width: 260,
      align: 'center'
    },
    {
      title: '推荐内容',
      dataIndex: 'recommendType',
      key: 'recommendType',
      width: 110,
      render: (text) => {
        return <span>{recommendTypeList.filter((type) => type.id === text)[0]?.name || '无'}</span>;
      },
      align: 'center'
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
          {tagNameList.length === 0 && UNKNOWN}
        </>
      )
    },
    {
      title: '上架机构',
      key: 'corpNames',
      width: 260,
      align: 'left',
      // colSpan: isMainCorp ? 1 : 0,
      dataIndex: 'corpNames',
      ellipsis: { showTitle: false },
      render: (corpNames) => {
        return (
          <Tooltip placement="topLeft" title={corpNames.join(';')}>
            {corpNames.join(';') || UNKNOWN}
          </Tooltip>
        );
      }
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
      width: 160,
      render: (text: string) => {
        return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm') : UNKNOWN}</span>;
      }
    },
    {
      title: '文章状态',
      key: 'syncBank',
      width: 120,
      dataIndex: 'syncBank',
      render: (text: number) => {
        return (
          <span>
            <i
              className={classNames('status-point', [
                {
                  'status-point-gray': text === 0,
                  'status-point-green': text === 1,
                  'status-point-red': text === 2
                }
              ])}
            ></i>
            {StatusEnum[text]}
          </span>
        );
      }
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 220,
      render: (text, record) => (
        <>
          {isMainCorp
            ? (
            <Space size="small">
              <a onClick={() => handleTop(record)}>{record.isTop ? '取消置顶' : '置顶'}</a>
              <a onClick={() => handleEdit(record)}>编辑</a>
              {record.syncBank !== 1 && <a onClick={() => changeItemStatus(record)}>上架</a>}

              {record.syncBank === 1 && (
                <Popconfirm title="下架后会影响所有机构，确定要下架?" onConfirm={() => changeItemStatus(record)}>
                  <a>下架</a>
                </Popconfirm>
              )}
              {record.syncBank !== 1 && (
                <Popconfirm title="删除后会影响所有机构，确定要删除?" onConfirm={() => deleteItem(record)}>
                  <a>删除</a>
                </Popconfirm>
              )}
            </Space>
              )
            : (
            <Space size="small">
              <a onClick={() => handleTop(record)}>{record.isTop ? '取消置顶' : '置顶'}</a>
              <a onClick={() => handleEdit(record)}>编辑</a>
              {record.syncBank !== 1 && <a onClick={() => changeItemStatus(record)}>上架</a>}
              {record.syncBank === 1 && (
                <Popconfirm title="确定要下架?" onConfirm={() => changeItemStatus(record)}>
                  <a>下架</a>
                </Popconfirm>
              )}
              {record.syncBank !== 1 && (
                <Popconfirm title="确定要删除?" onConfirm={() => deleteItem(record)}>
                  <a>删除</a>
                </Popconfirm>
              )}
            </Space>
              )}
        </>
      )
    }
  ];
  // } else {
  //   return [
  //     { title: '文章Id', dataIndex: 'newsId', key: 'newsId', width: 300 },
  //     {
  //       title: '标题',
  //       dataIndex: 'title',
  //       key: 'title',
  //       width: 196,
  //       ellipsis: { showTitle: true },
  //       render: (text: string, record: any) => (
  //         <a
  //           onClick={() => {
  //             viewItem(record);
  //           }}
  //         >
  //           {record.title}
  //         </a>
  //       )
  //     },
  //     {
  //       title: '分类',
  //       dataIndex: 'categoryName',
  //       width: 110,
  //       key: 'categoryName',
  //       align: 'center',
  //       render: (categoryName: string) => categoryName || UNKNOWN
  //     },
  //     {
  //       title: '渠道来源',
  //       dataIndex: 'fromSource',
  //       width: 260,
  //       align: 'center'
  //     },
  //     {
  //       title: '推荐',
  //       dataIndex: 'recommendType',
  //       width: 260,
  //       render: (text) => {
  //         return <span>{recommendTypeList.filter((type) => type.id === text)[0]?.name || '无'}</span>;
  //       },
  //       align: 'center'
  //     },
  //     {
  //       title: '标签',
  //       key: 'tagNameList',
  //       width: 260,
  //       align: 'center',
  //       dataIndex: 'tagNameList',
  //       render: (tagNameList: string[]) => (
  //         <>
  //           {tagNameList &&
  //             tagNameList.map((tag) => {
  //               return (
  //                 <Tag className="green_tag" key={tag}>
  //                   {tag.toUpperCase()}
  //                 </Tag>
  //               );
  //             })}
  //           {tagNameList.length === 0 && UNKNOWN}
  //         </>
  //       )
  //     },
  //     {
  //       title: '发送次数',
  //       width: 120,
  //       key: 'sendCount',
  //       dataIndex: 'sendCount'
  //     },
  //     {
  //       title: '打开次数',
  //       width: 120,
  //       key: 'openCount',
  //       dataIndex: 'openCount'
  //     },
  //     {
  //       title: '分享次数',
  //       width: 120,
  //       key: 'relayCount',
  //       dataIndex: 'relayCount'
  //     },
  //     {
  //       title: '创建时间',
  //       key: 'createTime',
  //       dataIndex: 'createTime',
  //       width: 160,
  //       render: (text: string) => {
  //         return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm') : UNKNOWN}</span>;
  //       }
  //     },
  //     {
  //       title: '文章状态',
  //       key: 'syncBank',
  //       width: 120,
  //       dataIndex: 'syncBank',
  //       render: (text: number) => {
  //         return (
  //           <span>
  //             <i
  //               className={classNames('status-point', [
  //                 {
  //                   'status-point-gray': text === 0,
  //                   'status-point-green': text === 1,
  //                   'status-point-red': text === 2
  //                 }
  //               ])}
  //             ></i>
  //             {StatusEnum[text]}
  //           </span>
  //         );
  //       }
  //     },
  //     {
  //       title: '操作',
  //       key: 'operation',
  //       fixed: 'right',
  //       width: 220,
  //       render: (text, record) => (
  //         <Space size="small">
  //           <a onClick={() => handleTop(record)}>{record.isTop ? '取消置顶' : '置顶'}</a>
  //           <a onClick={() => handleEdit(record)}>编辑</a>
  //           {record.syncBank !== 1 && <a onClick={() => changeItemStatus(record)}>上架</a>}
  //           {record.syncBank === 1 && (
  //             <Popconfirm title="确定要下架?" onConfirm={() => changeItemStatus(record)}>
  //               <a>下架</a>
  //             </Popconfirm>
  //           )}
  //           {record.syncBank !== 1 && (
  //             <Popconfirm title="确定要删除?" onConfirm={() => deleteItem(record)}>
  //               <a>删除</a>
  //             </Popconfirm>
  //           )}
  //         </Space>
  //       )
  //     }
  //   ];
  // }
};

export { columns, setSearchCols };
