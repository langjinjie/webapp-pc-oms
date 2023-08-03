import React from 'react';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { ColumnsType } from 'antd/lib/table';
import { Button } from 'antd';

export interface IActivityRow {
  leadActivityId: string; // 是 活动ID
  leadActivityName: string; // 是 活动名称
  status: number; // 是 状态，1-未上架；2-已上架；3-已下架
  createBy: string; // 是 创建人
  createTime: string; // 是 创建时间，yyyy.MM.dd HH:mm:ss
}

export const leadStatus = [
  { id: 1, name: '未上架' },
  { id: 2, name: '已上架' },
  { id: 3, name: '已下架' }
];

// 搜索字段配置
export const searchCols: SearchCol[] = [
  { name: 'leadActivityId', label: '活动ID', type: 'input' },
  { name: 'leadActivityName', label: '活动名称', type: 'input' },
  { name: 'createBy', label: '创建人', type: 'input' },
  {
    name: 'createTimeBegin-createTimeEnd',
    label: '创建时间',
    type: 'rangePicker'
  },
  { name: 'status', label: '状态', type: 'select', options: leadStatus }
];

type tableColumns = (param: {
  toTop: (row: IActivityRow) => void;
  view: (row: IActivityRow) => void;
  putOrDown: (row: IActivityRow) => void;
  getLink: (row: IActivityRow) => void;
  delItem: (row: IActivityRow) => void;
}) => ColumnsType<IActivityRow>;

// Table表头配置
export const tableColumns: tableColumns = ({ toTop, view, putOrDown, getLink, delItem }) => {
  return [
    { title: '活动', dataIndex: 'leadActivityId' },
    { title: '活动名称', dataIndex: 'leadActivityName' },
    {
      title: '状态',
      dataIndex: 'status',
      render (status: number) {
        return <>{leadStatus.find(({ id }) => id === status)?.name}</>;
      }
    },
    { title: '创建人', dataIndex: 'createBy' },
    { title: '创建时间', dataIndex: 'createTime' },
    {
      title: '操作',
      fixed: 'right',
      render (row) {
        return (
          <>
            <Button type="link" onClick={() => toTop(row)}>
              置顶
            </Button>
            <Button type="link" onClick={() => view(row)}>
              查看
            </Button>
            <Button type="link" onClick={() => putOrDown(row)}>
              下架
            </Button>
            <Button type="link" onClick={() => putOrDown(row)}>
              上架
            </Button>
            <Button type="link" onClick={() => getLink(row)}>
              获取链接
            </Button>
            <Button type="link" onClick={() => delItem(row)}>
              删除
            </Button>
          </>
        );
      }
    }
  ];
};
