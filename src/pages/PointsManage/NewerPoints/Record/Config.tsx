import React from 'react';
import { ColumnsType } from 'antd/es/table';
import { SearchCol } from 'src/components';
import { state2Name, periodType2Name } from 'src/pages/PointsManage/PointsConfig/List/Config';
import classNames from 'classnames';
import style from './style.module.less';

export interface IRecord {
  logId: string;
  pointsTaskId: string;
  taskType: number;
  taskName: string;
  taskNameModify: number;
  taskDesc: string;
  taskDescModify: number;
  taskDetail: string;
  taskDetailModify: number;
  actionNum: number;
  taskPoints: number;
  taskPointsModify: number;
  maxPoints: number;
  maxPointsModify: number;
  periodType: number;
  periodTypeModify: number;
  sort: number;
  sortModify: number;
  state: number;
  stateModify: number;
  effectiveTime: string;
  businessModel?: string;
  businessModelModify: number;
  effectiveState: number;
}

export const searchCols: SearchCol[] = [
  {
    name: 'taskName',
    label: '任务名称',
    width: '230px',
    type: 'input',
    placeholder: '请输入'
  },
  {
    name: 'beginTime-endTime',
    label: '操作时间',
    width: '230px',
    type: 'rangePicker'
  },
  {
    name: 'taskType',
    label: '任务类型',
    width: '230px',
    type: 'select',
    options: [
      { id: 1, name: '打卡任务' },
      { id: 2, name: '奖励任务' }
    ]
  }
];

export const tableColumnsFun: () => ColumnsType<IRecord> = () => {
  return [
    { title: '操作时间', dataIndex: 'lastUpdated' },
    {
      title: 'A端展示排序',
      render (value: IRecord) {
        return <span className={value.sortModify ? style.modify : ''}>{value.sort}</span>;
      }
    },
    {
      title: '生效状态',
      dataIndex: 'effectiveState',
      render (effectiveState: number) {
        return <>{effectiveState ? '已生效' : '未生效'}</>;
      }
    },
    { title: '生效时间', dataIndex: 'effectiveTime' },
    {
      title: '任务名称',
      render (value: IRecord) {
        return <span className={value.taskNameModify ? style.modify : ''}>{value.taskName}</span>;
      }
    },
    {
      title: '任务描述（小贴士）',
      render (value: IRecord) {
        return <span className={value.taskDescModify ? style.modify : ''}>{value.taskDesc}</span>;
      }
    },
    {
      title: '任务详细说明',
      render (value: IRecord) {
        return <span className={value.taskDetailModify ? style.modify : ''}>{value.taskDetail}</span>;
      }
    },
    {
      title: '激励分值',
      render (value: IRecord) {
        return <span className={value.taskPointsModify ? style.modify : ''}>{value.taskPoints}</span>;
      }
    },
    {
      title: '积分上限',
      render (value: IRecord) {
        return <span className={value.maxPointsModify ? style.modify : ''}>{value.maxPoints}</span>;
      }
    },
    {
      title: '时间限制',
      render (value: IRecord) {
        return (
          <span className={value.periodTypeModify ? style.modify : ''}>
            {periodType2Name.find((periodTypeItem) => periodTypeItem.value === value.periodType)?.name}
          </span>
        );
      }
    },
    {
      title: '业务模式',
      render (value: IRecord) {
        return <span className={value.businessModelModify ? style.modify : ''}>{value.businessModel || '全部'}</span>;
      }
    },
    {
      title: '上架状态',
      render (value: IRecord) {
        return (
          <>
            <i className={classNames('status-point', { 'status-point-gray': value.state === 0 })} />
            <span className={value.stateModify ? style.modify : ''}>
              {state2Name.find((stateItem) => stateItem.value === value.state)?.name}
            </span>
          </>
        );
      }
    },
    {
      title: '操作人',
      dataIndex: 'createBy'
    }
  ];
};
