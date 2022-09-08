import React from 'react';
import { ColumnsType } from 'antd/es/table';
import style from './style.module.less';

export interface IPointsConfigItem {
  pointsTaskId: string;
  taskType: number;
  taskName: string;
  taskDesc: string;
  taskDetail: string;
  actionNum: number;
  sort: number;
  taskPoints: number;
  maxPoints: number;
  periodType: number;
  state: number;
  businessModel: string;
  effectiveTime: string;
}

export const periodType2Name = { 1: '每日', 2: '每周', 3: '每月' };
export const state2Name = { 0: '下架', 1: '上架' };

export const tableColumnsFun: () => ColumnsType<IPointsConfigItem> = () => {
  return [
    {
      title: 'A端展示排序',
      render (_: IPointsConfigItem, __: IPointsConfigItem, index) {
        return <>{index + 1}</>;
      }
    },
    {
      title: '生效状态',
      render () {
        return <>{'已生效'}</>;
      }
    },
    { title: '生效时间', dataIndex: 'effectiveTime' },
    { title: '任务名称', dataIndex: 'taskName' },
    { title: '任务描述（小贴士）', dataIndex: 'taskDesc' },
    { title: '任务详细说明', dataIndex: 'taskDetail' },
    { title: '奖励分值', dataIndex: 'taskPoints' },
    { title: '积分上限', dataIndex: 'maxPoints' },
    { title: '时间限制', dataIndex: 'periodType' },
    {
      title: '业务模式',
      dataIndex: 'businessModel',
      render (businessModel: string) {
        return <>{businessModel || '全部'}</>;
      }
    },
    { title: '上架状态', dataIndex: 'state' },
    {
      title: '操作',
      render () {
        return (
          <>
            <span className={style.up}>上架</span>
            <span className={style.edit}>编辑</span>
            <span className={style.add}>新增</span>
          </>
        );
      }
    }
  ];
};
