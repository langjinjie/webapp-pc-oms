import React from 'react';
import { ColumnsType } from 'antd/es/table';
import { Popconfirm, Space, Button } from 'antd';
import moment, { Moment } from 'moment';
import classNames from 'classnames';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { UNKNOWN } from 'src/utils/base';
import { AuthBtn } from 'src/components';

export interface SearchParamsProps {
  rangePicker: undefined | Moment[];
  title: string;
  categoryId: string;
  syncBank: string;
  corpId: string;
}

export interface ProductProps {
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
  isTop: string;
  groupId: string;
}

enum ProductStatus {
  '未上架' = 1,
  '已上架',
  '已下架'
}

export const setSearchCols = (options: any[]): SearchCol[] => {
  return [
    {
      name: 'productName',
      type: 'input',
      label: '产品名称',
      width: '268px',
      placeholder: '请输入'
    },
    {
      name: 'category',
      type: 'select',
      label: '分类',
      width: 160,
      options: options
    },
    { name: 'onlineTimeBegin-onlineTimeEnd', width: '268px', type: 'rangePicker', label: '上架时间' },
    {
      name: 'status',
      type: 'select',
      width: 160,
      label: '状态',

      options: [
        { id: 1, name: '未上架' },
        { id: 2, name: '已上架' },
        { id: 3, name: '已下架' }
      ]
    }
  ];
};
// 表哥配置项
type ColumnsArgs = {
  handleEdit: (record: ProductProps) => void;
  changeItemStatus: (record: ProductProps, index: number) => void;
  viewItem: (record: ProductProps) => void;
  copyItem: (record: ProductProps) => void;
  deleteItem: (record: ProductProps, index: number) => void;
  handleSort: (record: ProductProps) => void;
  setRight: (record: ProductProps) => void;
};
const columns = (args: ColumnsArgs): ColumnsType<ProductProps> => {
  const { handleEdit, changeItemStatus, viewItem, deleteItem, handleSort, setRight, copyItem } = args;
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
        return text || UNKNOWN;
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 140,
      render: (text: string) => {
        return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm') : UNKNOWN}</span>;
      }
    },
    {
      title: '上架时间',
      dataIndex: 'onlineTime',
      align: 'center',
      width: 140,
      render: (text: string) => {
        return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm') : UNKNOWN}</span>;
      }
    },
    {
      title: '下架时间',
      dataIndex: 'offlineTime',
      align: 'center',
      width: 140,
      render: (text: string) => {
        return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm') : UNKNOWN}</span>;
      }
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
      width: 300,
      dataIndex: 'status',
      align: 'left',
      fixed: 'right',
      render: (status: number, obj: any, index: number) => (
        <Space size={10} className="spaceWrap">
          <AuthBtn path="/top">
            <Button type="link" onClick={() => handleSort(obj)}>
              {obj.isTop === '1' ? '取消置顶' : '置顶'}
            </Button>
          </AuthBtn>
          <AuthBtn path="/view">
            <Button type="link" onClick={() => viewItem(obj)}>
              查看
            </Button>
          </AuthBtn>
          <AuthBtn path="/add">
            <Button type="link" onClick={() => copyItem(obj)}>
              复制
            </Button>
          </AuthBtn>
          <AuthBtn path="/edit">
            {status === 1 && (
              <Button type="link" onClick={() => handleEdit(obj)}>
                编辑
              </Button>
            )}
          </AuthBtn>
          <AuthBtn path="/operate">
            {(status === 1 || status === 3) && (
              <Popconfirm title="确定要上架?" onConfirm={() => changeItemStatus(obj, index)}>
                <Button type="link">上架</Button>
              </Popconfirm>
            )}

            {status === 2 && (
              <Popconfirm title="确定要下架?" onConfirm={() => changeItemStatus(obj, index)}>
                <Button type="link">下架</Button>
              </Popconfirm>
            )}
          </AuthBtn>
          <AuthBtn path="/delete">
            {status === 3 && (
              <Popconfirm title="确定要删除?" onConfirm={() => deleteItem(obj, index)}>
                <Button type="link">删除</Button>
              </Popconfirm>
            )}
          </AuthBtn>
          <AuthBtn path="/set">
            <Button type="link" onClick={() => setRight(obj)}>
              配置可见范围
            </Button>
          </AuthBtn>
        </Space>
      )
    }
  ];
};

export { columns };
