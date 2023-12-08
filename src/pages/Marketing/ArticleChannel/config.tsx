import React from 'react';
import { ColumnsType } from 'antd/lib/table';
import { Button } from 'antd';

export interface IColumn {
  channelId: string; // 是 渠道id
  channelName: string; // 是 渠道名称
  channelCode: string; // 是 渠道代码
  articleCnt: number; // 是 文章总访问次数
  articleUsedCnt: number; // 是 文章已访问次数
  articlePercent: string; // 是 文章访问百分比，精确到两位数
}

type TTableColumnsFun = (args: {
  onOperate: (row: IColumn) => void;
  addNotice: (row: IColumn) => void;
}) => ColumnsType<IColumn>;

export const tableColumnsFun: TTableColumnsFun = ({ onOperate, addNotice }) => {
  return [
    {
      title: '序号',
      width: 80,
      render (_: IColumn, __: IColumn, index) {
        return <>{index + 1}</>;
      }
    },
    {
      title: '机构名称',
      dataIndex: 'channelName',
      width: 80
    },
    {
      title: '渠道代码',
      dataIndex: 'channelCode',
      width: 80
    },
    {
      title: '总访问次数',
      dataIndex: 'articleCnt',
      width: 80
    },
    {
      title: '截止目前访问次数',
      dataIndex: 'articleUsedCnt',
      width: 80
    },
    {
      title: '访问百分比',
      dataIndex: 'articlePercent',
      render (articlePercent: number) {
        return <>{(articlePercent ?? 0) * 100 + '%'}</>;
      },
      width: 80
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      render: (row: IColumn) => {
        return (
          <>
            <Button type="link" onClick={() => onOperate(row)}>
              编辑
            </Button>
            <Button type="link" onClick={() => addNotice(row)}>
              添加通知人
            </Button>
          </>
        );
      }
    }
  ];
};
