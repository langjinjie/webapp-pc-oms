import React, { useContext } from 'react';
import { Button, Image, Popconfirm, Space, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import classNames from 'classnames';

import styles from './style.module.less';
import { Context } from 'src/store';

export const setSearchCols = (options: any[]): SearchCol[] => {
  return [
    {
      name: 'name',
      type: 'input',
      label: '海报名称',
      placeholder: '海报名称',
      width: 320
    },
    {
      name: 'status',
      type: 'select',
      label: '状态',
      width: 160,
      options: [
        { id: 1, name: '未上架' },
        { id: 2, name: '已上架' },
        { id: 3, name: '已下架' }
      ]
    },
    {
      name: 'typeIds',
      type: 'cascader',
      fieldNames: { label: 'name', value: 'typeId', children: 'childs' },
      label: '分类',
      width: 160,
      cascaderOptions: options
    }
  ];
};
export interface Poster {
  id: string;
  posterId: string;
  groupId: string;
  corpId: string;
  exterPosterId: null | string;
  onlineTime: null | string;
  offlineTime: null | string;
  name: string;
  typeId: string;
  productId: string | null;
  imgUrl: string;
  tags: null | string;
  status: number;
  speechcraft: string;
  weightRecommend: null;
  mainPosterId: string;
  isDeleted: null;
  typeName: string;
  createBy: null;
  dateCreated: string;
  updateBy: null | string;
  lastUpdated: string;
  usedCorpsName: string;
  fatherTypeName: string;
}
const UNKNOWN = '— —';
enum StatusEnum {
  '未上架' = 1,
  '已上架',
  '已下架'
}

// Table配置项
type OperationsType = {
  handleEdit: (record: any) => void;
  changeItemStatus: (type: number, record: Poster) => void;
  viewItem: (record: any) => void;
  deleteItem: (record: any) => void;
  handleTop: (record: any) => void;
  setRight: (record: Poster) => void;
};
export const columns = (args: OperationsType): ColumnsType<Poster> => {
  const { isMainCorp } = useContext(Context);
  const { handleEdit, changeItemStatus, viewItem, deleteItem, handleTop, setRight } = args;
  if (isMainCorp) {
    return [
      {
        title: '海报样式',
        dataIndex: 'imgUrl',
        width: 100,
        render: (imgUrl: string) => {
          return (
            <div className={styles.listImgWrap}>
              <Image src={imgUrl} />
            </div>
          );
        }
      },
      {
        title: '名称',
        dataIndex: 'name',
        align: 'left',
        width: 200,
        ellipsis: {
          showTitle: false
        },
        render: (name) => (
          <Tooltip placement="topLeft" title={name}>
            {name || UNKNOWN}
          </Tooltip>
        )
      },
      {
        title: '分类',
        dataIndex: 'typeName',
        align: 'left',
        width: 180,
        render: (text: String, record: Poster) => {
          return record.fatherTypeName ? record.fatherTypeName + '-' + text : text || UNKNOWN;
        }
      },
      {
        title: '上架机构',
        align: 'left',
        dataIndex: 'usedCorpsName',
        width: 200,
        ellipsis: {
          showTitle: false
        },
        render: (usedCorpsName) => (
          <Tooltip placement="topLeft" title={usedCorpsName}>
            {usedCorpsName || UNKNOWN}
          </Tooltip>
        )
      },

      {
        title: '上架时间',
        dataIndex: 'onlineTime',
        align: 'center',
        width: 160,
        render: (text: string) => {
          return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm') : UNKNOWN}</span>;
        }
      },
      {
        title: '下架时间',
        dataIndex: 'offlineTime',
        align: 'center',
        width: 160,
        render: (text: string) => {
          return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm') : UNKNOWN}</span>;
        }
      },
      {
        title: '操作人',
        dataIndex: 'updateBy',
        align: 'center',
        width: 120,
        render: (text: string) => {
          return <span>{text || UNKNOWN}</span>;
        }
      },
      {
        title: '状态',
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
              {StatusEnum[status]}
            </a>
          );
        }
      },
      {
        title: '操作',
        width: 250,
        dataIndex: 'status',
        align: 'left',
        fixed: 'right',
        render: (status: number, obj: Poster) => (
          <Space size={10} className="spaceWrap">
            {!obj.productId && (
              <Button type="link" onClick={() => handleTop(obj)}>
                {obj.weightRecommend ? '取消置顶' : '置顶'}
              </Button>
            )}

            <Button type="link" onClick={() => viewItem(obj)}>
              查看
            </Button>
            {(status === 1 || status === 3) && !obj.productId && (
              <Button type="link" onClick={() => handleEdit(obj)}>
                编辑
              </Button>
            )}
            {(status === 1 || status === 3) && !obj.productId && (
              <Button type="link" onClick={() => changeItemStatus(1, obj)}>
                上架
              </Button>
            )}
            {status === 2 && !obj.productId && (
              <Popconfirm title="下架后会影响所有机构，确定要下架?" onConfirm={() => changeItemStatus(2, obj)}>
                <Button type="link">下架</Button>
              </Popconfirm>
            )}
            {status === 3 && !obj.productId && (
              <Popconfirm title="删除后会影响所有机构，确定要删除?" onConfirm={() => deleteItem(obj)}>
                <Button type="link">删除</Button>
              </Popconfirm>
            )}
            <Button type="link" onClick={() => setRight(obj)}>
              配置可见范围
            </Button>
          </Space>
        )
      }
    ];
  } else {
    return [
      {
        title: '海报样式',
        dataIndex: 'imgUrl',
        width: 100,
        render: (imgUrl: string) => {
          return (
            <div className={styles.listImgWrap}>
              <Image src={imgUrl} />
            </div>
          );
        }
      },
      {
        title: '名称',
        dataIndex: 'name',
        align: 'left',
        width: 200,
        ellipsis: {
          showTitle: false
        },
        render: (name) => (
          <Tooltip placement="topLeft" title={name}>
            {name || UNKNOWN}
          </Tooltip>
        )
      },
      {
        title: '分类',
        dataIndex: 'typeName',
        align: 'left',
        width: 180,
        render: (text: String, record: Poster) => {
          return record.fatherTypeName ? record.fatherTypeName + '-' + text : text || UNKNOWN;
        }
      },
      {
        title: '上架时间',
        dataIndex: 'onlineTime',
        align: 'center',
        width: 160,
        render: (text: string) => {
          return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm') : UNKNOWN}</span>;
        }
      },
      {
        title: '下架时间',
        dataIndex: 'offlineTime',
        align: 'center',
        width: 160,
        render: (text: string) => {
          return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm') : UNKNOWN}</span>;
        }
      },
      {
        title: '操作人',
        dataIndex: 'updateBy',
        align: 'center',
        width: 120,
        render: (text: string) => {
          return <span>{text || UNKNOWN}</span>;
        }
      },
      {
        title: '状态',
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
              {StatusEnum[status]}
            </a>
          );
        }
      },
      {
        title: '操作',
        width: 250,
        dataIndex: 'status',
        align: 'left',
        fixed: 'right',
        render: (status: number, obj: Poster) => (
          <Space size={10} className="spaceWrap">
            {!obj.productId && (
              <Button type="link" onClick={() => handleTop(obj)}>
                {obj.weightRecommend ? '取消置顶' : '置顶'}
              </Button>
            )}

            <Button type="link" onClick={() => viewItem(obj)}>
              查看
            </Button>
            {(status === 1 || status === 3) && !obj.productId && (
              <Button type="link" onClick={() => handleEdit(obj)}>
                编辑
              </Button>
            )}
            {(status === 1 || status === 3) && !obj.productId && (
              <Button type="link" onClick={() => changeItemStatus(1, obj)}>
                上架
              </Button>
            )}
            {status === 2 && !obj.productId && (
              <Popconfirm title="确定要下架?" onConfirm={() => changeItemStatus(2, obj)}>
                <Button type="link">下架</Button>
              </Popconfirm>
            )}
            {status === 3 && !obj.productId && (
              <Popconfirm title="确定要删除?" onConfirm={() => deleteItem(obj)}>
                <Button type="link">删除</Button>
              </Popconfirm>
            )}
            <Button type="link" onClick={() => setRight(obj)}>
              配置可见范围
            </Button>
          </Space>
        )
      }
    ];
  }
};
