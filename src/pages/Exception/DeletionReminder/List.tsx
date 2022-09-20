/**
 * @desc 在职分配
 */
import React, { useEffect, useState } from 'react';
import { Card, PaginationProps } from 'antd';
import { NgFormSearch, NgTable } from 'src/components';
import { searchCols, IDelStaffList, tableColumnsFun } from './Config';
import { requestGetStaffDelClientList } from 'src/apis/exception';
// import { useHistory } from 'react-router-dom';
// import { requestGetReasonList, requestGetAssignInheritList } from 'src/apis/client';
// import style from './style.module.less';
// import classNames from 'classnames';

const List: React.FC = () => {
  const [tableSource, setTableSource] = useState<{ total: number; list: IDelStaffList[] }>({ total: 0, list: [] });
  // const [reasonCodeList, setReasonCodeList] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10
  });
  const [formValue, setFormValue] = useState<{ [key: string]: any }>({});

  // const history = useHistory();

  // 获取继承客户列表接口
  const getList = async (param?: { [key: string]: any }) => {
    setLoading(true);
    console.log('param', param);
    const res = await requestGetStaffDelClientList({ ...param });
    if (res) {
      const { total, list } = res;
      setTableSource({ total, list });
    }
    setLoading(false);
  };

  const onSearch = (value?: any) => {
    console.log('value', value);
    const { leaderName, staffList, type, transferStatus, time, takeoverTime, reasonCode } = value;
    const staffName = staffList?.map((mapItem: { staffName: string }) => mapItem.staffName);
    let beginTime = '';
    let endTime = '';
    if (time) {
      beginTime = time[0].startOf('days').format('YYYY-MM-DD HH:mm:ss');
      endTime = time[1].endOf('days').format('YYYY-MM-DD HH:mm:ss');
    }
    let takeoverBeginTime = '';
    let takeoverEndTime = '';
    if (takeoverTime) {
      takeoverBeginTime = takeoverTime[0].startOf('days').format('YYYY-MM-DD HH:mm:ss');
      takeoverEndTime = takeoverTime[1].endOf('days').format('YYYY-MM-DD HH:mm:ss');
    }
    setFormValue({
      leaderName,
      staffName,
      type,
      transferStatus,
      beginTime,
      endTime,
      takeoverBeginTime,
      takeoverEndTime,
      reasonCode
    });
    getList({
      leaderName,
      staffName,
      type,
      transferStatus,
      beginTime,
      endTime,
      takeoverBeginTime,
      takeoverEndTime,
      reasonCode
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
        searchCols={searchCols()}
        isInline={false}
        firstRowChildCount={3}
        onSearch={onSearch}
        onReset={onResetHandle}
      />
      <div className="mt20">
        <NgTable
          columns={tableColumnsFun()}
          loading={loading}
          dataSource={tableSource.list}
          pagination={{ ...pagination, total: tableSource.total }}
          paginationChange={paginationChange}
          scroll={{ x: 'max-content' }}
        />
      </div>
    </Card>
  );
};

export default List;
