import React, { Dispatch, SetStateAction } from 'react';
import { ColumnType } from 'antd/es/table';
import { IRoleList } from 'src/utils/interface';
import style from './style.module.less';

const TableColumns = (
  roleType: 1 | 2 | 3,
  setParams: Dispatch<SetStateAction<{ visible: boolean; added: boolean; roleId: string }>>
): ColumnType<any>[] => {
  console.log('roleType', roleType);
  // 点击编辑/添加成员
  const AddOrEditUserHandle = (added: boolean, roleId: string) => {
    setParams({ visible: true, added, roleId });
  };
  return [
    {
      title: '角色id',
      dataIndex: 'roleId'
    },
    {
      title: '角色名称',
      render (row: IRoleList) {
        return (
          <>
            <span className={style.roleName}>{row.roleName}</span>
            {!row.isDefault || <span className={style.isDefault}>默认</span>}
          </>
        );
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      render (status: number) {
        return <span>{status ? '开启' : '关闭'}</span>;
      }
    },
    {
      title: '管辖范围',
      dataIndex: 'roleRange'
    },
    {
      title: '操作',
      render (row: IRoleList) {
        return (
          <>
            <span className={style.check}>查看</span>
            {!row.isDefault && <span className={style.edit}>编辑</span>}
            <span className={style.add} onClick={() => AddOrEditUserHandle(true, row.roleId)}>
              添加成员
            </span>
            <span className={style.mange} onClick={() => AddOrEditUserHandle(false, row.roleId)}>
              管理成员
            </span>
            {!row.isDefault && <span className={style.open}>{row.status ? '关闭' : '开启'}</span>}
            {!row.isDefault && <span className={style.del}>删除</span>}
          </>
        );
      }
    }
  ];
};

const TablePagination = (arg: { [key: string]: unknown }): { [key: string]: unknown } => {
  const { total, paginationParam, setPaginationParam } = arg as {
    total: number;
    paginationParam: { pageNum: number; pageSize: number };
    setPaginationParam: Dispatch<SetStateAction<{ pageNum: number; pageSize: number }>>;
  };
  const pagination = {
    total,
    current: paginationParam.pageNum
  };
  const paginationChange = (current: number) => {
    setPaginationParam((param) => ({ ...param, pageNum: current }));
  };
  return { pagination, paginationChange };
};
export { TableColumns, TablePagination };
