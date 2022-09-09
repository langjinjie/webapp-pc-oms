import React from 'react';
import { ColumnsType } from 'antd/es/table';
import style from './style.module.less';
import { useHistory } from 'react-router-dom';

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

export const periodType2Name = [
  { value: 1, name: '每日' },
  { value: 2, name: '每周' },
  { value: 3, name: '每月' }
];

export const state2Name = [
  { value: 0, name: '下架' },
  { value: 1, name: '上架' }
];

export const tableColumnsFun: () => ColumnsType<IPointsConfigItem> = () => {
  const history = useHistory();
  // 上架
  const upHandle = () => {
    console.log('上架');
  };
  // 编辑/新增
  const editHandle = (edit: 0 | 1) => {
    console.log(edit ? '编辑' : '新增');
    history.push('/pointsConfig/edit');
  };
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
            <span className={style.up} onClick={upHandle}>
              上架
            </span>
            <span className={style.edit} onClick={() => editHandle(1)}>
              编辑
            </span>
            <span className={style.add} onClick={() => editHandle(0)}>
              新增
            </span>
          </>
        );
      }
    }
  ];
};
