import React from 'react';
import { ColumnsType } from 'antd/es/table';
import { UNKNOWN } from 'src/utils/base';
import style from './style.module.less';

const TableColumns = (): ColumnsType<any> => [
  {
    title: '姓名',
    // width: 150,
    fixed: 'left',
    render (row) {
      return (
        <span>
          {row.staffName}
          {!!row.isLeader && <span className={style.isLeader}>上级</span>}
        </span>
      );
    }
  },
  { title: '企微账号', dataIndex: 'userId', width: 150 },
  {
    title: '员工工号',
    // width: 100,
    render (row) {
      return <span>{row.jobNumber || UNKNOWN}</span>;
    }
  },
  {
    title: '部门',
    // width: 100,
    render (row) {
      return <span>{row.deptName || UNKNOWN}</span>;
    }
  },
  {
    title: '资源',
    // width: 100,
    render (row) {
      return <span>{row.resource || UNKNOWN}</span>;
    }
  },
  {
    title: '职位',
    // width: 150,
    render (row) {
      return <span>{row.position || UNKNOWN}</span>;
    }
  },
  {
    title: '业务模式',
    // width: 100,
    render (row) {
      return <span>{row.businessModel || UNKNOWN}</span>;
    }
  },
  {
    title: '业务地区',
    // width: 150,
    render (row) {
      return <span>{row.businessArea || UNKNOWN}</span>;
    }
  },
  {
    title: '办公职场',
    // width: 90,
    render (row) {
      return <span>{row.officePlace || UNKNOWN}</span>;
    }
  },
  {
    title: '账号开通时间',
    // width: 180,
    render (row) {
      return <span>{row.accountStartTime || UNKNOWN}</span>;
    }
  },
  {
    title: '账号停止时间',
    // width: 180,
    render (row) {
      return <span>{row.accountEndTime || UNKNOWN}</span>;
    }
  },
  {
    title: '状态',
    // width: 60,
    render (row) {
      return <span>{row.isDeleted ? '离职' : '在职'}</span>;
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
    total: staffList.total,
    current: paginationParam.pageNum,
    showTotal: (total: number) => `共 ${total} 条`
  };
  // 切换分页
  const paginationChange = (value: number, pageSize?: number) => {
    setPaginationParam({ pageNum: value, pageSize: pageSize as number });
  };
  // 点击选择框
  const onSelectChange = async (newSelectedRowKeys: any[]) => {
    // 判断是取消选择还是开始选择
    if (newSelectedRowKeys.length) {
      let filterRowKeys: string[] = newSelectedRowKeys;
      // 判断是否是首次选择
      if (disabledColumnType === -1) {
        // 获取第一个的状态作为全选筛选条件
        const disabledColumnType = staffList?.list.find((item: any) => item.staffId === newSelectedRowKeys[0])
          ?.isDeleted as number;
        setDisabledColumnType(disabledColumnType);
        // 判断是否是点击的全选
        if (newSelectedRowKeys.length > 1) {
          // 过滤得到需要被全选的
          filterRowKeys = staffList.list
            .filter((item: any) => item.isDeleted === disabledColumnType)
            .map((item: any) => item.staffId);
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
      disabled: disabledColumnType === -1 ? false : record.isDeleted !== disabledColumnType,
      name: record.name
    })
  };
  return { pagination, rowSelection, paginationChange };
};
export { TableColumns, TablePagination };
