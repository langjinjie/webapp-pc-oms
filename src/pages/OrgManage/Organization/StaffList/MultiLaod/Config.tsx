import React from 'react';
import { ColumnsType } from 'antd/es/table';
import style from './style.module.less';
import classNames from 'classnames';

const status2NameList = ['校验中', '成功', '异常'];

// columns 参数
const TableColumns = (): ColumnsType<any> => [
  { title: '表格名称', dataIndex: 'name', align: 'center' },
  { title: '批次号', dataIndex: 'number', align: 'center' },
  { title: '创建时间', dataIndex: 'createTime', align: 'center' },
  { title: '创建人', dataIndex: 'createName', align: 'center' },
  {
    title: '状态',
    align: 'left',
    render (row) {
      return (
        <span
          className={classNames(
            { [style.check]: row.status === 0 },
            { [style.fail]: row.status === 2 },
            { [style.success]: row.status === 1 }
          )}
        >
          {status2NameList[row.status]}
        </span>
      );
    }
  },
  { title: '批次成功数', dataIndex: 'successCount', align: 'center' },
  {
    title: '操作',
    width: 150,
    render (row) {
      return (
        <span className={classNames(style.edit, { [style.disabled]: row.status !== 1 })}>
          {row.status === 1 ? '下载异常表格' : '/'}
        </span>
      );
    }
  }
];

// Table参数
const TablePagination = (arg: { [key: string]: any }): any => {
  const { list, paginationParam, setPaginationParam } = arg;
  // 分页器参数
  const pagination = {
    total: list?.list.length || 0,
    current: paginationParam.current,
    showTotal: (total: number) => `共 ${total} 条`
  };
  // 切换分页
  const paginationChange = (value: number, pageSize?: number) => {
    setPaginationParam({ current: value, pageSize: pageSize as number });
  };
  return { pagination, paginationChange };
};
export { TableColumns, TablePagination };
