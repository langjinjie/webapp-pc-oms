import React from 'react';
import { ColumnsType } from 'antd/es/table';
import { Tag, Popconfirm, Space, Button } from 'antd';
import moment, { Moment } from 'moment';
import classNames from 'classnames';

export interface SearchParamsProps {
  rangePicker: undefined | Moment[];
  title: string;
  categoryId: string;
  syncBank: string;
  corpId: string;
}

interface ColumnProps {
  productId: string;
  productName: string;
  categoryId: number;
  categoryName: string;
  createBy: string;
  createTime: string;
  onlineTime: string;
  offlineTime: string;
  status: number;
  isOwner: string;
}

enum ProductStatus {
  '未上架' = 1,
  '已上架',
  '已下架',
}
// 表哥配置项
type colargsType = {
  handleEdit: (record: any) => void;
  changeItemStatus: (record: any) => void;
  viewItem: (record: any) => void;
  deleteItem: (record: any) => void;
};
const columns = (args: colargsType): ColumnsType<ColumnProps> => {
  const { handleEdit, changeItemStatus, viewItem, deleteItem } = args;
  return [
    { title: '产品名称', dataIndex: 'productName', width: 200, ellipsis: { showTitle: true } },
    {
      title: '产品分类',
      dataIndex: 'categoryName',
      align: 'center',
      width: 80,
      render: (categoryName: String) => {
        return <span className={'categoryName'}>{categoryName}</span>;
      }
    },
    {
      title: '创建人',
      dataIndex: 'createBy',
      align: 'center',
      width: 80,
      render: (text: String) => {
        return text || '---';
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 120,
      render: (text: string) => {
        return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm') : '---'}</span>;
      }
    },
    {
      title: '上架时间',
      dataIndex: 'onlineTime',
      align: 'center',
      width: 120,
      render: (text: string) => {
        return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm') : '---'}</span>;
      }
    },
    {
      title: '下架时间',
      dataIndex: 'offlineTime',
      align: 'center',
      width: 120,
      render: (text: string) => {
        return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm') : '---'}</span>;
      }
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
      title: '产品状态',
      dataIndex: 'status',
      align: 'center',
      className: 'status-color',
      width: 100,
      render: (status: number) => {
        return (
          <a className="status-color">
            <i
              className={classNames('status-point', [
                {
                  'status-point-gray': status === 1,
                  'status-point-green': status === 2,
                  'status-point-red': status === 3
                }
              ])}
            ></i>
            {ProductStatus[status]}
          </a>
        );
      }
    },
    {
      title: '操作',
      width: 120,
      dataIndex: 'status',
      align: 'left',
      fixed: 'right',
      render: (status: number, obj: any, index: number) => (
        <Space size={10} className="spaceWrap">
          <Button type="link" onClick={() => viewItem(obj)}>
            查看
          </Button>
          {status === 1 && (
            <Button type="link" onClick={() => handleEdit(obj)} disabled={obj.isOwner === '0'}>
              编辑
            </Button>
          )}
          {(status === 1 || status === 3) && (
            <Popconfirm
              title="确定要上架?"
              onConfirm={() => changeItemStatus(obj, index)}
              disabled={obj.isOwner === '0'}
            >
              <Button type="link" disabled={obj.isOwner === '0'}>
                上架
              </Button>
            </Popconfirm>
          )}
          {status === 2 && (
            <Popconfirm
              title="确定要下架?"
              onConfirm={() => changeItemStatus(obj, index)}
              disabled={obj.isOwner === '0'}
            >
              <Button type="link" disabled={obj.isOwner === '0'}>
                下架
              </Button>
            </Popconfirm>
          )}
          {status === 3 && (
            <Popconfirm title="确定要删除?" onConfirm={() => deleteItem(obj)} disabled={obj.isOwner === '0'}>
              <Button type="link" disabled={obj.isOwner === '0'}>
                删除
              </Button>
            </Popconfirm>
          )}
        </Space>
      )
    }
  ];
};

export { columns };
