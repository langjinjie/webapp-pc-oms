import React from 'react';
import { ColumnsType } from 'antd/es/table';
import { requestDownLoadFailLoad } from 'src/apis/orgManage';
import { IStaffImpList } from 'src/utils/interface';
import style from './style.module.less';
import classNames from 'classnames';

const status2NameList = ['成功', '异常', '校验中'];

// 下载导入异常表
const onDownLoadFailExcel = async (batchId: string, fileName: string, status: number) => {
  if (status !== 1) return;
  const res = await requestDownLoadFailLoad({
    batchId
  });
  if (res) {
    const blob = new Blob([res.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', fileName + '.xlsx');
    document.body.appendChild(link);
    link.click(); // 点击下载
    link.remove(); // 下载完成移除元素
    window.URL.revokeObjectURL(link.href); // 用完之后使用URL.revokeObjectURL()释放；
  }
};

// columns 参数
const TableColumns = (): ColumnsType<any> => [
  { title: '表格名称', dataIndex: 'title' },
  { title: '批次号', dataIndex: 'batchCode' },
  { title: '创建时间', dataIndex: 'dateCreated' },
  { title: '创建人', dataIndex: 'createBy' },
  {
    title: '状态',
    render (row) {
      return (
        <span
          className={classNames(
            { [style.check]: row.status === 0 },
            // { [style.success]: row.status === 0 },
            { [style.fail]: row.status === 1 }
          )}
        >
          {status2NameList[row.status]}
        </span>
      );
    }
  },
  {
    title: '批次成功数',
    render (row: IStaffImpList) {
      return (
        <span>
          {row.successCount}/{row.totalCount}
        </span>
      );
    }
  },
  {
    title: '操作',
    // width: 150,
    fixed: 'right',
    render (row: IStaffImpList) {
      return (
        <span
          className={classNames(style.edit, { [style.disabled]: row.status !== 1 })}
          onClick={() => onDownLoadFailExcel(row.batchId, row.title, row.status)}
        >
          {row.status === 1 ? '下载异常表格' : '/'}
        </span>
      );
    }
  }
];

// Table参数
const TablePagination = (arg: { [key: string]: any }): any => {
  const { exportList, paginationParam, setPaginationParam } = arg;
  // 分页器参数
  const pagination = {
    total: exportList.total,
    current: paginationParam.pageNum,
    showTotal: (total: number) => `共 ${total} 条`
  };
  // 切换分页
  const paginationChange = (value: number, pageSize?: number) => {
    setPaginationParam({ pageNum: value, pageSize: pageSize as number });
  };
  return { pagination, paginationChange };
};
export { TableColumns, TablePagination };
