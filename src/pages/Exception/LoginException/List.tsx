/**
 * @desc 未登录提醒
 */
import React, { useEffect, useState } from 'react';
import { Card, PaginationProps } from 'antd';
import { NgFormSearch, NgTable } from 'src/components';
import { searchCols, IUnLoginStaffList, tableColumnsFun } from './Config';
// import { useHistory } from 'react-router-dom';
import { requestGetLoginExceptionList } from 'src/apis/exception';
import moment from 'moment';
// import style from './style.module.less';
// import classNames from 'classnames';

const List: React.FC = () => {
  const [tableSource, setTableSource] = useState<{ total: number; list: IUnLoginStaffList[] }>({ total: 0, list: [] });
  const [reasonCodeList, setReasonCodeList] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10
  });

  const [formValue, setFormValue] = useState<{ [key: string]: any }>({});
  const [isShow, setIsShow] = useState(true);
  // const history = useHistory();

  // 获取客户列表接口
  const getList = async (param?: { [key: string]: any }) => {
    setLoading(true);
    const res = await requestGetLoginExceptionList({ ...param });

    if (res) {
      const { total, list } = res;
      setTableSource({ total, list });
      setReasonCodeList(
        res.list.map(({ reasonCode, reasonName }: { reasonCode: string; reasonName: string }) => ({
          id: reasonCode,
          name: reasonName
        }))
      );
    }
    setLoading(false);
  };

  const onSearch = (value?: any) => {
    setPagination((param) => ({ ...param, current: 1 }));
    const { staffNames, leaderName, unloginCountWeek, deptIds, date } = value;
    const fromDate = date?.format('YYYY-MM-DD HH:mm:ss');
    const isShoe = date ? date.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') : true;
    setIsShow(isShoe);
    setFormValue({
      leaderName,
      staffNames: staffNames?.map(({ staffName }: { staffName: string }) => staffName),
      unloginCountWeek,
      deptIds: deptIds?.map(({ deptId }: { deptId: string }) => deptId),
      date: fromDate
    });
    getList({
      leaderName,
      staffNames: staffNames?.map(({ staffName }: { staffName: string }) => staffName),
      deptIds: deptIds?.map(({ deptId }: { deptId: string }) => deptId),
      unloginCountWeek,
      date: fromDate
    });
  };

  // 切换分页
  const paginationChange = (current: number, pageSize?: number) => {
    setPagination(() => ({ current, pageSize: pageSize as number }));
    getList({ ...formValue, pageNum: current, pageSize: pageSize as number });
  };
  // 重置
  const onResetHandle = () => {
    setPagination(() => ({ current: 1, pageSize: 10 }));
    onSearch({});
  };
  useEffect(() => {
    getList();
  }, []);
  return (
    <Card className="container" bordered={false}>
      <NgFormSearch
        searchCols={searchCols(reasonCodeList)}
        isInline={false}
        firstRowChildCount={3}
        onSearch={onSearch}
        onReset={onResetHandle}
      />
      <div>共{tableSource.total}条数据</div>
      <div className="mt20">
        <NgTable
          columns={tableColumnsFun(isShow)}
          loading={loading}
          dataSource={tableSource.list}
          pagination={{ ...pagination, total: tableSource.total }}
          paginationChange={paginationChange}
          scroll={{ x: 'max-content' }}
          setRowKey={(record: IUnLoginStaffList) => {
            return record.staffId;
          }}
        />
      </div>
    </Card>
  );
};

export default List;
