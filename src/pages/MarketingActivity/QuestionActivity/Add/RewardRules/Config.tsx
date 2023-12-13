import React from 'react';
import { Button, Popconfirm } from 'antd';
import { ColumnsType } from 'antd/lib/table';

export interface IPrizeConfig {
  reportId: string; //  是 规则ID
  activityId: string; // 是 活动id
  score: number; // 是 分数
  goodsId: string; // 是 商品ID
  num?: number; // 是 默认1：不需要填
  goodsName: string; // 是 商品名
}

type TTableColumns = (arg: { edit: (row: any) => void; del: (row: any) => void }) => ColumnsType<IPrizeConfig>;

export const TableColumns: TTableColumns = ({ edit, del }) => {
  return [
    { title: '奖励分值', dataIndex: 'score' },
    { title: '奖品名称', dataIndex: 'goodsName' },
    // { title: '已发数量' },
    { title: '奖励数量', dataIndex: 'num' },
    { title: '奖品批次', dataIndex: 'goodsId' },
    // { title: '奖品过期时间' },
    // { title: '操作人' },
    // { title: '更新时间' },
    {
      title: '操作',
      render (row: any) {
        return (
          <>
            <Button type="link" onClick={() => edit(row)}>
              修改
            </Button>
            <Popconfirm title="是否删除该规则" onConfirm={() => del(row)}>
              <Button type="link">删除</Button>
            </Popconfirm>
          </>
        );
      }
    }
  ];
};
