import React from 'react';
import { ColumnsType } from 'antd/es/table';
// import { UNKNOWN } from 'src/utils/base';
import style from 'src/pages/PointsManage/Excitation/Manage/style.module.less';

export const TableColumns: () => ColumnsType = () => {
  return [
    { title: '客户经理姓名', dataIndex: '' },
    { title: '客户经理id', dataIndex: '' },
    { title: '团队长姓名', dataIndex: '' },
    { title: '应发积分', dataIndex: '' },
    { title: '积分发放状态', dataIndex: '' },
    { title: '发放时间', dataIndex: '' },
    { title: '操作人', dataIndex: '' },
    {
      title: '操作',
      render () {
        return (
          <>
            <span className={style.send}>发放积分</span>
          </>
        );
      }
    }
  ];
};
