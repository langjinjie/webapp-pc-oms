import React from 'react';
import { ColumnsType } from 'antd/es/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { state2Name, periodType2Name } from 'src/pages/PointsManage/PointsConfig/List/Config';
import classNames from 'classnames';

export const searchCols: SearchCol[] = [
  {
    name: 'taskName',
    label: '任务名称',
    width: '230px',
    type: 'input'
  },
  {
    name: 'taskTime',
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

export const tableColumnsFun: () => ColumnsType<any> = () => {
  return [
    // { title: '操作时间', dataIndex: 'effectiveTime' },
    { title: 'A端展示排序', dataIndex: 'sort' },
    {
      title: '生效状态',
      dataIndex: 'state',
      render (state: number) {
        return <>{state2Name.find((stateItem) => stateItem.value === state)?.name}</>;
      }
    },
    { title: '生效时间', dataIndex: 'effectiveTime' },
    { title: '任务名称', dataIndex: 'taskName' },
    { title: '任务描述（小贴士）', dataIndex: 'taskDesc' },
    { title: '任务详细说明', dataIndex: 'taskDetail' },
    { title: '激励分值', dataIndex: 'taskPoints' },
    { title: '积分上限', dataIndex: 'maxPoints' },
    {
      title: '时间限制',
      dataIndex: 'periodType',
      render (periodType: number) {
        return <>{periodType2Name.find((periodTypeItem) => periodTypeItem.value === periodType)?.name}</>;
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
      render (state: number) {
        return (
          <>
            <i className={classNames('status-point', { 'status-point-gray': state === 0 })} />
            {state2Name.find((stateItem) => stateItem.value === state)?.name}
          </>
        );
      }
    },
    { title: '操作人', dataIndex: '' }
  ];
};
