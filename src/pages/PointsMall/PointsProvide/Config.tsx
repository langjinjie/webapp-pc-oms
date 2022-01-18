import React from 'react';
import { ColumnsType } from 'antd/es/table';
import { UNKNOWN } from 'src/utils/base';
import { IPointsProvideList } from 'src/utils/interface';
import style from './style.module.less';
import classNames from 'classnames';

interface IPonitsParam {
  visible: boolean;
  ponitsRow?: IPointsProvideList;
  sendStatus: boolean;
}
interface ITableColumns {
  setPonitsParam: (param: IPonitsParam) => void;
}

const TableColumns = ({ setPonitsParam }: ITableColumns): ColumnsType<any> => {
  // 点击查看
  const clickCheckHandle = (row: IPointsProvideList) => {
    setPonitsParam({ visible: true, ponitsRow: row, sendStatus: false });
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
      render (row: IPointsProvideList) {
        return <span>{row.date || UNKNOWN}</span>;
      }
    },
    {
      title: '是否有黑名单',
      dataIndex: 'blackTaskNum',
      render (text) {
        return <span className={classNames({ [style.blackList]: !!text })}>{text}</span>;
      }
    },
    {
      title: '待发积分',
      render (row: IPointsProvideList) {
        return <span>{row.sendPoints || UNKNOWN}</span>;
      }
    },
    {
      title: '黑名单积分',
      dataIndex: 'blackPoints',
      render (text) {
        return <span className={classNames({ [style.blackList]: !!text })}>{text}</span>;
      }
    },
    {
      title: '应发积分',
      render (row: IPointsProvideList) {
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
      render (row: IPointsProvideList) {
        return <span>{row.recoveryPoints || UNKNOWN}</span>;
      }
    },
    {
      title: '积分发放状态',
      render (row: IPointsProvideList) {
        return (
          <span className={classNames(style.sendStatus, { [style.sended]: row.sendStatus })}>
            {row.sendStatus ? '已发放' : '未发放'}
          </span>
        );
      }
    },
    {
      title: '积分发放时间',
      render (row: IPointsProvideList) {
        return <span>{row.sendTime || UNKNOWN}</span>;
      }
    },
    {
      title: '操作人',
      render (row: IPointsProvideList) {
        return <span>{row.opName || UNKNOWN}</span>;
      }
    },
    {
      title: '操作',
      fixed: 'right',
      render (row: IPointsProvideList) {
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
    setSelectedRowKeys
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
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    hideSelectAll: false, // 是否隐藏全选
    getCheckboxProps: (record: IPointsProvideList) => ({
      disabled: record.sendStatus === 1 // 已发放积分的不能被选中
    })
  };
  return { pagination, rowSelection, paginationChange };
};
export { TableColumns, TablePagination };
