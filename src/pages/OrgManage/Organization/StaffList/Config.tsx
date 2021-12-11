import { ColumnsType } from 'antd/es/table';

const TableColumns = (): ColumnsType<any> => [
  { title: '姓名', dataIndex: 'name' },
  { title: '企微账号', dataIndex: 'account' },
  { title: '员工工号', dataIndex: 'number' },
  { title: '部门', dataIndex: 'department' },
  { title: '职务', dataIndex: 'post' },
  { title: '业务模式', dataIndex: 'business' },
  { title: '业务地区', dataIndex: 'area' },
  { title: '办公职场', dataIndex: 'location' },
  { title: '账号开通时间', dataIndex: 'openingTime' },
  { title: '账号停止时间', dataIndex: 'downTime' },
  { title: '状态' }
];

const TablePagination = (arg: { [key: string]: any }): any => {
  const {
    staffLst,
    paginationParam,
    setPaginationParam,
    setSelectedRowKeys,
    disabledColumnType,
    setDisabledColumnType,
    selectedRowKeys
  } = arg;
  // 分页器参数
  const pagination = {
    total: staffLst?.length || 0,
    current: paginationParam.current,
    showTotal: (total: number) => `共 ${total} 条`
  };
  // 切换分页
  const paginationChange = (value: number, pageSize?: number) => {
    setPaginationParam({ current: value, pageSize: pageSize as number });
    setSelectedRowKeys([]);
    setDisabledColumnType(-1);
  };
  // 点击选择框
  const onSelectChange = async (newSelectedRowKeys: any[]) => {
    // 判断是取消选择还是开始选择
    if (newSelectedRowKeys.length) {
      let filterRowKeys: string[] = newSelectedRowKeys;
      // 判断是否是首次选择
      if (disabledColumnType === -1) {
        // 获取第一个的状态作为全选筛选条件
        const disabledColumnType = staffLst.list.find((item: any) => item.sensitiveId === newSelectedRowKeys[0])
          ?.status as number;
        setDisabledColumnType(disabledColumnType);
        // 判断是否是点击的全选
        if (newSelectedRowKeys.length > 1) {
          // 过滤得到需要被全选的
          filterRowKeys = staffLst.list
            .filter((item: any) => item.status === disabledColumnType)
            .map((item: any) => item.sensitiveId);
        }
      }
      setSelectedRowKeys(filterRowKeys as string[]);
    } else {
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
