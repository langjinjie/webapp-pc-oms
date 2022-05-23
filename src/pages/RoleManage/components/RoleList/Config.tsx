import React, { Dispatch, SetStateAction, useContext } from 'react';
import { ColumnType } from 'antd/es/table';
import { IRoleList, IConfirmModalParam } from 'src/utils/interface';
import { roleTypeRouteList } from 'src/utils/commonData';
import { useHistory } from 'react-router-dom';
import { requestDelRole, requestChangeRoleStatus } from 'src/apis/roleMange';
import { Context } from 'src/store';

import style from './style.module.less';

const TableColumns = (
  roleType: 1 | 2 | 3,
  clickTree: (add: boolean, roleId: string) => void,
  setPaginationParam: Dispatch<SetStateAction<{ pageNum: number; pageSize: number }>>
): ColumnType<any>[] => {
  const { setConfirmModalParam } =
    useContext<{ setConfirmModalParam: Dispatch<SetStateAction<IConfirmModalParam>> }>(Context);
  const history = useHistory();
  // 点击编辑/查看角色
  const editOrViewHandle = (type: string, roleId: string) => {
    history.push(roleTypeRouteList[roleType - 1] + '?type=' + type + '&roleId=' + roleId);
  };
  // 删除角色
  const delRoleHandle = (row: IRoleList) => {
    const onCancel = () => {
      setConfirmModalParam({ visible: false });
    };
    const onOk = async () => {
      await requestDelRole({ roleId: row.roleId });
      onCancel();
      setPaginationParam({ pageNum: 1, pageSize: 10 });
    };
    setConfirmModalParam((param) => ({
      ...param,
      visible: true,
      title: '温馨提示',
      tips: `此角色下有人员共计${row.userNum}名。关闭角色后，他们的权限将会被关闭。无法进入系统。请您知悉`,
      onOk,
      onCancel
    }));
  };
  // 开启/关闭角色
  const manageRoleHandle = (row: IRoleList) => {
    setConfirmModalParam((param) => ({
      ...param,
      visible: true,
      title: '温馨提示',
      tips: row.status
        ? `此角色下有人员共计${row.userNum}名。关闭角色后，他们的权限将会被关闭。无法进入系统。请您知悉`
        : '确认开启该角色吗',
      okText: row.status ? '确认关闭' : '确认开启',
      onCancel () {
        setConfirmModalParam({ visible: false });
      },
      async onOk () {
        await requestChangeRoleStatus({ roleId: row.roleId, status: row.status ? 0 : 1 });
        setConfirmModalParam({ visible: false });
        setPaginationParam((param) => ({ ...param }));
      }
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
      dataIndex: 'roleRange',
      render (text: string) {
        return text || '全部范围';
      }
    },
    {
      title: '操作',
      render (row: IRoleList) {
        return (
          <>
            <span className={style.check} onClick={() => editOrViewHandle('view', row.roleId)}>
              查看
            </span>
            {!row.isDefault && (
              <span className={style.edit} onClick={() => editOrViewHandle('edit', row.roleId)}>
                编辑
              </span>
            )}
            {!row.isDefault || (
              <span className={style.addMenu} onClick={() => editOrViewHandle('addMenu', row.roleId)}>
                添加功能
              </span>
            )}
            <span className={style.mange} onClick={() => clickTree(false, row.roleId)}>
              管理成员
            </span>
            {!row.isDefault && (
              <span className={style.open} onClick={() => manageRoleHandle(row)}>
                {row.status ? '关闭' : '开启'}
              </span>
            )}
            {!row.isDefault && (
              <span className={style.del} onClick={() => delRoleHandle(row)}>
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
