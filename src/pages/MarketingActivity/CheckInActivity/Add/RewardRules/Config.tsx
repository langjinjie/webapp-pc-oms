import React from 'react';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';

export interface IPrizeConfig {
  actId: string; // 是 活动id
  subject: string; // 是 活动名称
  actCode: string; // 是 活动编号
  signRuleList: IRuleItem; //  规则列表
}

export interface IRuleItem {
  prId: string; // 是 活动规则奖励id
  actId: string; // 是 活动id
  goodsId: string; // 是 奖品id
  goodsName: string; // 是 奖品名称
  priCount: number; // 是 奖励数量
  condiDay: number; // 是 累计天数
  createBy: string; // 是 创建人
  lastUpdated: string; // 是 更新时间
}

type TTableColumns = (arg: { edit: (row: any) => void; del: (row: any) => void }) => ColumnsType<any>;

export const TableColumns: TTableColumns = ({ edit, del }) => {
  return [
    { title: '累计天数', dataIndex: 'condiDay' },
    { title: '奖品名称', dataIndex: 'goodsName' },
    { title: '奖励数量', dataIndex: 'priCount' },
    { title: '奖品批次', dataIndex: 'goodsId' },
    { title: '操作人', dataIndex: 'createBy' },
    { title: '更新时间', dataIndex: 'lastUpdated' },
    {
      title: '操作',
      render (row: IRuleItem) {
        return (
          <>
            <Button type="link" onClick={() => edit(row)}>
              修改
            </Button>
            <Button type="link" onClick={() => del(row)}>
              删除
            </Button>
          </>
        );
      }
    }
  ];
};
