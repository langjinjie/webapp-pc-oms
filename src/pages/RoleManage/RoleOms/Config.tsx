import React from 'react';
import { ColumnType } from 'antd/es/table';
import style from './style.module.less';

const TableColumns = (): ColumnType<any>[] => {
  return [
    {
      title: '角色id',
      dataIndex: 'roleId'
    },
    {
      title: '角色名称',
      dataIndex: 'roleName'
    },
    {
      title: '状态',
      dataIndex: 'status'
    },
    {
      title: '管辖范围',
      dataIndex: 'range'
    },
    {
      title: '操作',
      render () {
        return (
          <>
            <span className={style.read}>查看</span>
            <span className={style.add}>添加成员</span>
            <span className={style.mange}>管理成员</span>
          </>
        );
      }
    }
  ];
};
export { TableColumns };
