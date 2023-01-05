import React from 'react';
import { ColumnsType } from 'antd/es/table';
import { useHistory } from 'react-router-dom';
import { requestPointsConfigState } from 'src/apis/pointsMall';
import { Modal, message } from 'antd';
import style from './style.module.less';
import classNames from 'classnames';

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
  businessModel?: string;
  effectiveTime: string;
  effectiveState: number;
  logId?: string;
  modifyLog?: IPointsConfigItem;
}

export const periodType2Name = [
  { value: 1, name: '每日' },
  { value: 2, name: '每周' },
  { value: 3, name: '每月' }
];

export const state2Name = [
  { value: 0, name: '下架' },
  { value: 1, name: '上架' }
];

export const tableColumnsFun: (getList: () => void) => ColumnsType<IPointsConfigItem> = (getList) => {
  const history = useHistory();
  // 上架
  const upHandle = async ({ pointsTaskId, state }: IPointsConfigItem) => {
    Modal.confirm({
      title: '温馨提示',
      content: `是否${state ? '下架' : '上架'}该任务`,
      onOk: async () => {
        const res = await requestPointsConfigState({ pointsTaskId, state: state ? 0 : 1 });
        if (res) {
          message.success(`${state ? '下架' : '上架'}成功`);
          getList();
        }
      }
    });
  };
  // 编辑/新增
  const editHandle = (value: IPointsConfigItem, type: string) => {
    history.push('/newerPoints/edit?pointsTaskId=' + value.pointsTaskId + '&type=' + type + '&logId=' + value.logId);
  };
  return [
    { title: 'A端展示排序', dataIndex: 'sort' },
    {
      title: '生效状态',
      dataIndex: 'effectiveState',
      render (effectiveState: number) {
        return <>{effectiveState ? '已生效' : '待生效'}</>;
      }
    },
    { title: '生效时间', dataIndex: 'effectiveTime' },
    { title: '任务名称', dataIndex: 'taskName' },
    { title: '任务描述（小贴士）', dataIndex: 'taskDesc' },
    {
      title: '任务详细说明',
      dataIndex: 'taskDetail',
      render (taskDetail: string) {
        return (
          <span className={classNames(style.taskDetail, 'ellipsis')} title={taskDetail}>
            {taskDetail}
          </span>
        );
      }
    },
    { title: '奖励分值', dataIndex: 'taskPoints' },
    { title: '积分上限', dataIndex: 'maxPoints' },
    {
      title: '时间限制',
      dataIndex: 'periodType',
      render (value: number) {
        return <>{periodType2Name.find((findItem) => findItem.value === value)?.name}</>;
      }
    },
    {
      title: '业务模式',
      dataIndex: 'businessModel',
      render (businessModel: string) {
        return <>{businessModel || '全部'}</>;
      }
    },
    {
      title: '上架状态',
      dataIndex: 'state',
      render (value: number) {
        return (
          <>
            <i className={classNames('status-point', { 'status-point-gray': value === 0 })} />
            {value ? '已上架' : '未上架'}
          </>
        );
      }
    },
    {
      title: '操作',
      fixed: 'right',
      render (value: IPointsConfigItem) {
        return (
          <>
            {+value.effectiveState === 1 && (
              <span className={style.up} onClick={() => upHandle(value)}>
                {value.state ? '下架' : '上架'}
              </span>
            )}
            <span className={style.edit} onClick={() => editHandle(value, value.logId ? 'add' : 'edit')}>
              编辑
            </span>
            {/* 既要判断本身的effectiveState,也要判断modifyLog的effectiveState */}
            {+value.effectiveState === 1 && (!value.modifyLog || value.modifyLog.effectiveState === 1) && (
              <span className={style.add} onClick={() => editHandle(value, 'add')}>
                新增
              </span>
            )}
          </>
        );
      }
    }
  ];
};
