import React, { Dispatch, SetStateAction, useContext } from 'react';
import { ColumnType } from 'antd/es/table';
import { IRoleList, IConfirmModalParam } from 'src/utils/interface';
import { roleTypeRouteList } from 'src/utils/commonData';
import { useHistory } from 'react-router-dom';
import { Context } from 'src/store';

import style from './style.module.less';

const TableColumns = (
  roleType: 1 | 2 | 3,
  setParams: Dispatch<SetStateAction<{ visible: boolean; added: boolean; roleId: string }>>
): ColumnType<any>[] => {
  const { setConfirmModalParam } =
    useContext<{ setConfirmModalParam: Dispatch<SetStateAction<IConfirmModalParam>> }>(Context);
  const history = useHistory();
  console.log('roleType', roleType);
  // 点击编辑/查看角色
  const editOrViewHandle = (type: string) => {
    console.log(roleTypeRouteList[roleType - 1] + '?type=' + type);
    history.push(roleTypeRouteList[roleType - 1] + '?type=' + type);
  };
  // 点击管理/添加成员
  const AddOrEditUserHandle = (added: boolean, roleId: string) => {
    setParams({ visible: true, added, roleId });
  };
  // 删除角色
  const delRoleHandle = () => {
    setConfirmModalParam((param) => ({ ...param, visible: true }));
  };
  // 开启/关闭角色
  const manageRoleHandle = (row: IRoleList) => {
    setConfirmModalParam((param) => ({
      ...param,
      visible: true,
      title: '温馨提示',
      tips: row.status
        ? `此角色下有人员共计${10}名。关闭角色后，他们的权限将会被关闭。无法进入系统。请您知悉`
        : '确认开启该角色吗',
      okText: row.status ? '确认关闭' : '确认开启'
    }));
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
            <span className={style.check} onClick={() => editOrViewHandle('view')}>
              查看
            </span>
            {!row.isDefault && (
              <span className={style.edit} onClick={() => editOrViewHandle('edit')}>
                编辑
              </span>
            )}
            <span className={style.add} onClick={() => AddOrEditUserHandle(true, row.roleId)}>
              添加成员
            </span>
            <span className={style.mange} onClick={() => AddOrEditUserHandle(false, row.roleId)}>
              管理成员
            </span>
            {!row.isDefault && (
              <span className={style.open} onClick={() => manageRoleHandle(row)}>
                {row.status ? '关闭' : '开启'}
              </span>
            )}
            {!row.isDefault && (
              <span className={style.del} onClick={delRoleHandle}>
                删除
              </span>
            )}
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
