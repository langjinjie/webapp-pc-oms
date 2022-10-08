import React from 'react';
import { ColumnsType } from 'antd/es/table';
import { UNKNOWN } from 'src/utils/base';
import style from 'src/pages/PointsManage/Excitation/Manage/style.module.less';

export const TableColumns: (editViewHandle: (row: any, isView: boolean) => void) => ColumnsType = (editViewHandle) => {
  return [
    { title: '任务名称', dataIndex: '' },
    { title: '任务时间', dataIndex: '' },
    {
      title: '规则说明',
      dataIndex: '',
      render () {
        return <>{UNKNOWN}</>;
      }
    },
    { title: '任务对象', dataIndex: '' },
    { title: '任务状态', dataIndex: '' },
    {
      title: '操作',
      render (row: any) {
        return (
          <>
            <span className={style.up}>上架</span>
            <span className={style.edit} onClick={() => editViewHandle(row, false)}>
              编辑
            </span>
            <span className={style.view} onClick={() => editViewHandle(row, true)}>
              查看
            </span>
          </>
        );
      }
    }
  ];
};
