import React from 'react';
import { ColumnsType } from 'antd/es/table';

const TableColumns = (): ColumnsType<any> => [
  { title: '姓名', dataIndex: 'name', align: 'center' },
  { title: '企微账号', dataIndex: 'account', align: 'center' },
  { title: '员工工号', dataIndex: 'number', align: 'center' },
  { title: '部门', dataIndex: 'department', align: 'center' },
  { title: '资源' },
  { title: '职务', dataIndex: 'post', align: 'center' },
  { title: '业务模式', dataIndex: 'business', align: 'center' },
  { title: '业务地区', dataIndex: 'area', align: 'center' },
  { title: '办公职场', dataIndex: 'location', align: 'center' },
  { title: '账号开通时间', dataIndex: 'openingTime', width: 160, align: 'center' },
  { title: '账号停止时间', dataIndex: 'downTime', width: 160, align: 'center' },
  {
    title: '状态',
    width: 70,
    align: 'center',
    render (row) {
      return <span>{row.status ? '在职' : '离职'}</span>;
    }
  }
];

const TablePagination = (arg: { [key: string]: any }): any => {
  const {
    staffList,
    paginationParam,
    setPaginationParam,
    selectedRowKeys,
    setSelectedRowKeys,
    disabledColumnType,
    setDisabledColumnType
  } = arg;
  // 分页器参数
  const pagination = {
    total: staffList?.list.length || 0,
    current: paginationParam.current,
    showTotal: (total: number) => `共 ${total} 条`
  };
  // 切换分页
  const paginationChange = (value: number, pageSize?: number) => {
    setPaginationParam({ current: value, pageSize: pageSize as number });
    // setSelectedRowKeys([]);
    // setDisabledColumnType(-1);
  };
  // 点击选择框
  const onSelectChange = async (newSelectedRowKeys: any[]) => {
    // 判断是取消选择还是开始选择
    if (newSelectedRowKeys.length) {
      let filterRowKeys: string[] = newSelectedRowKeys;
      // 判断是否是首次选择
      if (disabledColumnType === -1) {
        // 获取第一个的状态作为全选筛选条件
        const disabledColumnType = staffList?.list.find((item: any) => item.number === newSelectedRowKeys[0])
          ?.status as number;
        console.log(disabledColumnType);
        setDisabledColumnType(disabledColumnType);
        // 判断是否是点击的全选
        if (newSelectedRowKeys.length > 1) {
          // 过滤得到需要被全选的
          filterRowKeys = staffList.list
            .filter((item: any) => item.status === disabledColumnType)
            .map((item: any) => item.number);
        }
      }
      setSelectedRowKeys(filterRowKeys as string[]);
    } else {
      // 取消全选
      setSelectedRowKeys([]);
      setDisabledColumnType(-1);
    }
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    hideSelectAll: false, // 是否隐藏全选
    getCheckboxProps: (record: any) => ({
      disabled: disabledColumnType === -1 ? false : record.status !== disabledColumnType,
      name: record.name
    })
  };
  return { pagination, rowSelection, paginationChange };
};
export { TableColumns, TablePagination };
