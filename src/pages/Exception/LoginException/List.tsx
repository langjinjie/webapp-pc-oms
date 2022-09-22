/**
 * @desc 在职分配
 */
import React, { useEffect, useState } from 'react';
import { Card, PaginationProps } from 'antd';
import { NgFormSearch, NgTable } from 'src/components';
import { searchCols, IUnLoginStaffList, tableColumnsFun } from './Config';
// import { useHistory } from 'react-router-dom';
import { requestGetLoginExceptionList } from 'src/apis/exception';
// import moment, { Moment } from 'moment';
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

  // const history = useHistory();

  // 获取分配原因配置值
  const getReasonCodeListHandle = async () => {
    // const res = await requestGetReasonList({ queryType: 2 });
    const res = { list: [] };
    if (res) {
      setReasonCodeList(
        res.list.map(({ reasonCode, reasonName }: { reasonCode: string; reasonName: string }) => ({
          id: reasonCode,
          name: reasonName
        }))
      );
    }
  };

  // 获取继承客户列表接口
  const getList = async (param?: { [key: string]: any }) => {
    setLoading(true);
    console.log('param', param);
    const res = await requestGetLoginExceptionList({ ...param });
    console.log(res, '--------------------------res');

    // const res = { total: 0, list: [] };
    if (res) {
      const { total, list } = res;
      setTableSource({ total, list });
    }
    setLoading(false);
  };

  const onSearch = (value?: any) => {
    console.log('value', value);
    const { type, transferStatus, reasonCode, staffNames, leaderName, unloginCountWeek, deptIds, beginTime, endTime } =
      value;

    const date = {
      // 日期
      beginTime,
      endTime
    };
    setFormValue({
      leaderName,
      staffNames: staffNames?.map(({ staffName }: { staffName: string }) => staffName),
      unloginCountWeek,
      deptIds: deptIds?.map(({ deptId }: { deptId: string }) => deptId),
      type,
      transferStatus,
      reasonCode,
      date
    });
    getList({
      leaderName,
      staffNames: staffNames?.map(({ staffName }: { staffName: string }) => staffName),
      deptIds: deptIds?.map(({ deptId }: { deptId: string }) => deptId),
      unloginCountWeek,
      type,
      transferStatus,
      reasonCode,
      date
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
    getReasonCodeListHandle();
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
      <div className="mt20">
        <NgTable
          columns={tableColumnsFun()}
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
