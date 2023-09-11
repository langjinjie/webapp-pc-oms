import { Button, Popconfirm } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import classNames from 'classnames';
import React from 'react';
import { SearchCol } from 'src/components';
import style from './style.module.less';

export interface IQuestionActivityRow {
  activityId?: string; // 否 活动id
  activityName: String; // 是 活动名称
  status: number; // 是 活动状态:1-未上架、2-已上架、3-已下架；4、未开始；5、进行中；6、已结束
  startTime: string; // 是 活动开始时间yyyy-mm-dd hh:mm:ss
  endTime: string; // 是 活动结束时间yyyy-mm-dd hh:mm:ss
  dateCreated: string; //  创建时间yyyy-mm-dd hh:mm:ss
  lastUpdated: string; //  更新时间yyyy-mm-dd hh:mm:ss
  updateBy: string; // 是 更新人
}

// 搜索状态
const searchStatusList = [
  { id: 1, name: '未上架' },
  { id: 3, name: '已下架' }
];

// 列表状态: 搜索状态+活动时间组合
const tableStatusList = [
  { id: 1, name: '未上架' },
  { id: 3, name: '已下架' },
  { id: 4, name: '未开始' },
  { id: 5, name: '进行中' },
  { id: 6, name: '已结束' }
];

type TTableColumns = (params: {
  putOrDown: (row: IQuestionActivityRow) => void;
  edit: (row: IQuestionActivityRow) => void;
}) => ColumnsType<IQuestionActivityRow>;

export const searchCols: SearchCol[] = [
  { label: '活动编号', name: 'activityId', type: 'input', placeholder: '请输入' },
  { label: '活动名称', name: 'activityName', type: 'input', placeholder: '请输入' },
  { label: '创建时间', name: 'startTime-endTime', type: 'rangePicker' },
  { label: '状态', name: 'status', type: 'select', options: searchStatusList }
];

export const TableColumns: TTableColumns = ({ putOrDown, edit }) => {
  return [
    { title: '活动编号', dataIndex: 'activityId' },
    {
      title: '活动名称',
      dataIndex: 'activityName',
      render (activityName: string) {
        return <span className={classNames(style.activityName, 'ellipsis inline-block')}>{activityName}</span>;
      }
    },
    {
      title: '活动时间',
      render (row: IQuestionActivityRow) {
        return <>{`${row.startTime}至${row.endTime}`}</>;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      render (status: number) {
        return <>{tableStatusList.find((findItem) => findItem.id === status)?.name}</>;
      }
    },
    { title: '创建时间', dataIndex: 'dateCreated' },
    { title: '操作人', dataIndex: 'updateBy' },
    { title: '更新时间', dataIndex: 'lastUpdated' },
    {
      title: '操作',
      fixed: 'right',
      render (row: IQuestionActivityRow) {
        return (
          <>
            {/* 未上架与已下架状态支持点击上架操作 */}
            {[1, 3].includes(row.status) && (
              <Popconfirm title="是否确定上架该活动" onConfirm={() => putOrDown(row)}>
                <Button type="link">上架</Button>
              </Popconfirm>
            )}
            {/* 未开始与进行中状态支持点击下架操作 */}
            {[4, 5].includes(row.status) && (
              <Popconfirm title="是否确定下架该活动" onConfirm={() => putOrDown(row)}>
                <Button type="link">下架</Button>
              </Popconfirm>
            )}
            {/* 除了已结束状态,其他状态支持点击修改操作 */}
            {row.status !== 6 && (
              <Button type="link" onClick={() => edit(row)}>
                修改
              </Button>
            )}
          </>
        );
      }
    }
  ];
};
