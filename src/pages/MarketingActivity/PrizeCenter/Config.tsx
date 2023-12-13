import React from 'react';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components';
import { Button } from 'antd';
import classNames from 'classnames';
import style from './style.module.less';

export interface IPrizeItem {
  goodsName: string; //
  googsImg: string; //  是 商品图片
  goodsId: string; //  是 商品ID
  goodsDesc: string; //  否 商品描述
  remainStock: number; //  是 剩余库存
  status: number; //   上架状态：0-下架；1-上架；
  dateCreated: string; //  是 创建时间yyyy-mm-dd hh:mm:ss
  lastUpdated: string; //  是 更新时间yyyy-mm-dd hh:mm:ss
  updateBy: string; //  是 更新人
}

export const searchCols: SearchCol[] = [
  { name: 'goodsId', label: '奖品批次', type: 'input', placeholder: '请输入' },
  { name: 'goodsName', label: '奖品名称', type: 'input', placeholder: '请输入' },
  { name: 'start-end', label: '创建时间', type: 'rangePicker' }
];

export const statusList = [{ id: 0, name: '下架' }];

export const TableColumns: (arg: {
  inventoryManage: (row: IPrizeItem) => void;
  upOrDown: (row: IPrizeItem) => void;
  edit: (row: IPrizeItem) => void;
}) => ColumnsType = ({ inventoryManage, upOrDown, edit }) => {
  return [
    { title: '奖品批次', dataIndex: 'goodsId' },
    {
      title: '奖品名称',
      dataIndex: 'goodsName',
      render (goodsName: string) {
        return (
          <span className={classNames(style.goodsName, 'ellipsis inline-block')} title={goodsName}>
            {goodsName}
          </span>
        );
      }
    },
    { title: '奖品类型', render: () => <>兑换码</> },
    { title: '剩余库存', dataIndex: 'remainStock' },
    { title: '创建时间', dataIndex: 'dateCreated' },
    {
      title: '状态',
      dataIndex: 'status',
      render (status: number) {
        return (
          <>
            <span>
              <i
                className={classNames('status-point', {
                  'status-point-gray': status === 0
                })}
              />
              {status ? '上架' : '下架'}
            </span>
          </>
        );
      }
    },
    { title: '操作人', dataIndex: 'updateBy' },
    { title: '更新时间', dataIndex: 'lastUpdated' },
    {
      title: '操作',
      fixed: 'right',
      render (row: IPrizeItem) {
        return (
          <>
            <Button type="link" onClick={() => inventoryManage(row)}>
              库存管理
            </Button>
            {row.status === 0 && (
              <Button type="link" onClick={() => upOrDown(row)}>
                上架
              </Button>
            )}
            {row.status === 1 && (
              <Button type="link" onClick={() => upOrDown(row)}>
                下架
              </Button>
            )}
            <Button type="link" onClick={() => edit(row)}>
              修改
            </Button>
          </>
        );
      }
    }
  ];
};
