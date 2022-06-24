import React, { Dispatch, SetStateAction } from 'react';
import { ColumnType } from 'antd/es/table';
// import { IConfirmModalParam } from 'src/utils/interface';
import { useHistory } from 'react-router-dom';
// import { Context } from 'src/store';

import style from './style.module.less';
import { AuthBtn } from 'src/components';

const TableColumns = (readonly?: boolean): ColumnType<any>[] => {
  // const { setConfirmModalParam } =
  //   useContext<{ setConfirmModalParam: Dispatch<SetStateAction<IConfirmModalParam>> }>(Context);
  const history = useHistory();
  // 查看员工组
  const viewGroup = (groupId: string) => {
    history.push('/userGroup/add?groupId=' + groupId + '&type=view');
  };
  // 编辑员工组
  const editGroup = (groupId: string) => {
    history.push('/userGroup/add?groupId=' + groupId + '&type=edit');
  };
  return [
    {
      title: '员工组编号',
      dataIndex: 'groupCode'
    },
    {
      title: '员工组名称',
      dataIndex: 'groupName'
    },
    {
      title: '员工组说明',
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
            <AuthBtn path="/view">
              <span className={style.check} onClick={() => viewGroup(row.groupId)}>
                查看
              </span>
            </AuthBtn>
            <AuthBtn path="/edit">
              {readonly || (
                <span className={style.modifyGroup} onClick={() => editGroup(row.groupId)}>
                  修改员工组
                </span>
              )}
            </AuthBtn>
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
    current: paginationParam.pageNum,
    pageSize: paginationParam.pageSize
  };
  const paginationChange = (current: number, pageSize: number) => {
    setPaginationParam((param) => ({ ...param, pageNum: current, pageSize }));
  };
  return { pagination, paginationChange };
};
export { TableColumns, TablePagination };
