import React, { useContext } from 'react';
import { ColumnsType } from 'antd/es/table';
import { Tag, Popconfirm, Tooltip, Button } from 'antd';
import { SearchCol, AuthBtn } from 'src/components';
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
  recommendType: string;
}

export const recommendTypeList = [
  {
    id: 0,
    name: '文章',
    queryAuthId: 3
  },
  {
    id: 2,
    name: '产品',
    queryAuthId: 2
  },
  {
    id: 1,
    name: '活动',
    queryAuthId: 1
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
    { name: 'minTime-maxTime', width: '268px', type: 'rangePicker', label: '创建时间' },
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
  groupId?: string;
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
  setRight: (record: Article) => void;
};
const columns = (args: colargsType): ColumnsType<Article> => {
  const { handleEdit, changeItemStatus, viewItem, deleteItem, handleTop, setRight } = args;
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
      width: 330,
      render: (text, record) => (
        <>
          {isMainCorp
            ? (
            <>
              <AuthBtn path="/top">
                <Button type="link" onClick={() => handleTop(record)}>
                  {record.isTop ? '取消置顶' : '置顶'}
                </Button>
              </AuthBtn>
              <AuthBtn path="/edit">
                <Button type="link" onClick={() => handleEdit(record)}>
                  编辑
                </Button>
              </AuthBtn>
              <Button type="link" onClick={() => handleEdit(record)}>
                下载
              </Button>
              <AuthBtn path="/operate">
                {record.syncBank !== 1 && (
                  <Button type="link" onClick={() => changeItemStatus(record)}>
                    上架
                  </Button>
                )}
                {record.syncBank === 1 && (
                  <Popconfirm title="下架后会影响所有机构，确定要下架?" onConfirm={() => changeItemStatus(record)}>
                    <Button type="link">下架</Button>
                  </Popconfirm>
                )}
              </AuthBtn>
              <AuthBtn path="/delete">
                {record.syncBank !== 1 && (
                  <Popconfirm title="删除后会影响所有机构，确定要删除?" onConfirm={() => deleteItem(record)}>
                    <Button type="link">删除</Button>
                  </Popconfirm>
                )}
              </AuthBtn>
            </>
              )
            : (
            <>
              <AuthBtn path="/top">
                <Button type="link" onClick={() => handleTop(record)}>
                  {record.isTop ? '取消置顶' : '置顶'}
                </Button>
              </AuthBtn>
              <AuthBtn path="/edit">
                <Button type="link" onClick={() => handleEdit(record)}>
                  编辑
                </Button>
              </AuthBtn>
              <AuthBtn path="/operate">
                {record.syncBank !== 1 && <a onClick={() => changeItemStatus(record)}>上架</a>}
                {record.syncBank === 1 && (
                  <Popconfirm title="确定要下架?" onConfirm={() => changeItemStatus(record)}>
                    <Button type="link">下架</Button>
                  </Popconfirm>
                )}
              </AuthBtn>
              <AuthBtn path="/delete">
                {record.syncBank !== 1 && (
                  <Popconfirm title="确定要删除?" onConfirm={() => deleteItem(record)}>
                    <Button type="link">删除</Button>
                  </Popconfirm>
                )}
              </AuthBtn>
            </>
              )}
          <AuthBtn path="/set">
            <Button type="link" onClick={() => setRight(record)}>
              配置可见范围
            </Button>
          </AuthBtn>
        </>
      )
    }
  ];
};

export { columns, setSearchCols };
