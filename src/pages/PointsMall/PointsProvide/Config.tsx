import React from 'react';
import { ColumnsType } from 'antd/es/table';
import { UNKNOWN } from 'src/utils/base';
import style from './style.module.less';
import classNames from 'classnames';

interface IPonitsParam {
  visible: boolean;
  ponitsRow: any;
}
interface ITableColumns {
  setPonitsParam: (param: IPonitsParam) => void;
}

const TableColumns = ({ setPonitsParam }: ITableColumns): ColumnsType<any> => {
  // 点击查看
  const clickCheckHandle = (row: any) => {
    console.log('点击查看~');
    setPonitsParam({ visible: true, ponitsRow: row });
  };
  return [
    {
      title: '客户经理姓名',
      dataIndex: 'staffName',
      fixed: 'left'
    },
    { title: '客户经理ID', dataIndex: 'staffId' },
    {
      title: '日期',
      // width: 100,
      render (row) {
        return <span>{row.date || UNKNOWN}</span>;
      }
    },
    {
      title: '是否有黑名单',
      dataIndex: 'blackClientNum'
    },
    {
      title: '待发积分',
      render (row) {
        return <span>{row.sendPoints || UNKNOWN}</span>;
      }
    },
    {
      title: '黑名单积分',
      dataIndex: 'blackPoints'
    },
    {
      title: '应发积分',
      render (row) {
        return <span>{row.mustSendPoints || UNKNOWN}</span>;
      }
    },
    {
      title: '已发积分',
      render (row) {
        return <span>{row.sendedPoints || UNKNOWN}</span>;
      }
    },
    {
      title: '积分回收',
      render (row) {
        return <span>{row.recoveryPoints || UNKNOWN}</span>;
      }
    },
    {
      title: '积分发放状态',
      render (row) {
        return (
          <span className={classNames(style.sendStatus, { [style.sended]: row.sendStatus })}>
            {row.sendStatus ? '已发放' : '未发放'}
          </span>
        );
      }
    },
    {
      title: '积分发放时间',
      render (row) {
        return <span>{row.sendTime || UNKNOWN}</span>;
      }
    },
    {
      title: '操作人',
      render (row) {
        return <span>{row.opName || UNKNOWN}</span>;
      }
    },
    {
      title: '操作',
      fixed: 'right',
      render (row) {
        return (
          <span className={style.check} onClick={() => clickCheckHandle(row)}>
            查看
          </span>
        );
      }
    }
  ];
};

const TablePagination = (arg: { [key: string]: any }): any => {
  const {
    dataSource,
    paginationParam,
    setPaginationParam,
    selectedRowKeys,
    setSelectedRowKeys,
    disabledColumnType,
    setDisabledColumnType
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
  const onSelectChange = async (newSelectedRowKeys: any[]) => {
    // 判断是取消选择还是开始选择
    if (newSelectedRowKeys.length) {
      let filterRowKeys: string[] = newSelectedRowKeys;
      // 判断是否是首次选择
      if (disabledColumnType === -1) {
        // 获取第一个的状态作为全选筛选条件
        const disabledColumnType = dataSource?.list.find((item: any) => item.staffId === newSelectedRowKeys[0])
          ?.isDeleted as number;
        setDisabledColumnType(disabledColumnType);
        // 判断是否是点击的全选
        if (newSelectedRowKeys.length > 1) {
          // 过滤得到需要被全选的
          filterRowKeys = dataSource.list
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
    onSelect (row: any) {
      console.log('选中了');
      console.log(row);
    },
    hideSelectAll: false, // 是否隐藏全选
    getCheckboxProps: (record: any) => ({
      disabled: disabledColumnType === -1 ? false : record.isDeleted !== disabledColumnType,
      name: record.name
    })
  };
  return { pagination, rowSelection, paginationChange };
};
export { TableColumns, TablePagination };
