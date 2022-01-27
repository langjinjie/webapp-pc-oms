// import React from 'react';
import { ColumnsType } from 'antd/es/table';
import { IPointsProvideList } from 'src/utils/interface';

const TableColumns = (): ColumnsType<any> => {
  return [
    {
      title: '手机发放时间',
      dataIndex: 'staffName',
      fixed: 'left'
    },
    { title: '操作人', dataIndex: 'staffId' }
  ];
};

const TablePagination = (arg: { [key: string]: any }): any => {
  const {
    dataSource,
    paginationParam,
    setPaginationParam
    // disabledColumnType
  } = arg;
  // 分页器参数
  const pagination = {
    total: dataSource.total,
    current: paginationParam.pageNum,
    showTotal: (total: number) => `共 ${total} 条`
  };
  // 切换分页
  const paginationChange = (value: number, pageSize?: number) => {
    setPaginationParam({ pageNum: value, pageSize: pageSize as number });
  };
  // 点击选择框
  const onSelectChange = async (newSelectedRowKeys: string[]) => {
    console.log(newSelectedRowKeys);
  };
  const rowSelection = {
    onChange: onSelectChange,
    hideSelectAll: true, // 是否隐藏全选
    getCheckboxProps: (record: IPointsProvideList) => ({
      disabled: record.sendStatus === 1 // 已发放积分的不能被选中
    })
  };
  return { pagination, rowSelection, paginationChange };
};
export { TableColumns, TablePagination };
