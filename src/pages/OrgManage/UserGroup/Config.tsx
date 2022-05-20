import React, { Dispatch, SetStateAction } from 'react';
import { ColumnType } from 'antd/es/table';
// import { IConfirmModalParam } from 'src/utils/interface';
import { useHistory } from 'react-router-dom';
// import { Context } from 'src/store';

import style from './style.module.less';

const TableColumns = (): ColumnType<any>[] => {
  // const { setConfirmModalParam } =
  //   useContext<{ setConfirmModalParam: Dispatch<SetStateAction<IConfirmModalParam>> }>(Context);
  const history = useHistory();
  // 查看用户组
  const viewGroup = (groupId: string) => {
    history.push('/userGroup/add?groupId=' + groupId + '&type=view');
  };
  // 编辑用户组
  const editGroup = (groupId: string) => {
    history.push('/userGroup/add?groupId=' + groupId + '&type=edit');
  };
  return [
    {
      title: '用户组编号',
      dataIndex: 'groupCode'
    },
    {
      title: '用户组名称',
      dataIndex: 'groupName'
    },
    {
      title: '用户组说明',
      dataIndex: 'desc'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime'
    },
    {
      title: '操作',
      fixed: 'right',
      render (row: any) {
        return (
          <>
            <span className={style.check} onClick={() => viewGroup(row.groupId)}>
              查看
            </span>
            <span className={style.modifyGroup} onClick={() => editGroup(row.groupId)}>
              修改用户组
            </span>
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
