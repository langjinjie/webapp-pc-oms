/**
 * @desc 在职分配
 */
import React, { useEffect, useState } from 'react';
import { Card, PaginationProps } from 'antd';
import { AuthBtn, NgFormSearch, NgTable } from 'src/components';
import { searchCols, IDelStaffList, tableColumnsFun } from './Config';
import { requestGetStaffDelClientList } from 'src/apis/exception';

const List: React.FC = () => {
  const [tableSource, setTableSource] = useState<{ total: number; list: IDelStaffList[] }>({ total: 0, list: [] });
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10
  });
  const [formValue, setFormValue] = useState<{ [key: string]: any }>({});

  // 获取继承客户列表接口
  const getList = async (param?: { [key: string]: any }) => {
    setLoading(true);
    const res = await requestGetStaffDelClientList({ ...param });
    if (res) {
      const { total, list } = res;
      setTableSource({ total, list });
    }
    setLoading(false);
  };

  const onSearch = (value?: any) => {
    // 重置分页
    setPagination((param) => ({ ...param, current: 1 }));
    const { staffList, clientName, time, deptList, leaderName } = value;
    const staffName = staffList?.map((mapItem: { staffName: string }) => mapItem.staffName);
    const deptIds = deptList?.map(({ deptId }: { deptId: string }) => ({ deptId }));
    let beginTime: any;
    let endTime: any;
    if (time) {
      beginTime = time[0].startOf('days').format('YYYY-MM-DD HH:mm:ss');
      endTime = time[1].endOf('days').format('YYYY-MM-DD HH:mm:ss');
    }
    setFormValue({
      staffName,
      clientName,
      beginTime,
      endTime,
      deptIds,
      leaderName
    });
    getList({
      staffName,
      clientName,
      beginTime,
      endTime,
      deptIds,
      leaderName
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
      <AuthBtn path="/query">
        <NgFormSearch
          searchCols={searchCols()}
          isInline={false}
          firstRowChildCount={3}
          onSearch={onSearch}
          onReset={onResetHandle}
        />
      </AuthBtn>
      <div>共{tableSource.total}条数据</div>
      <div className="mt20">
        <NgTable
          columns={tableColumnsFun()}
          loading={loading}
          dataSource={tableSource.list}
          pagination={{ ...pagination, total: tableSource.total }}
          paginationChange={paginationChange}
          scroll={{ x: 'max-content' }}
          rowKey="id"
        />
      </div>
    </Card>
  );
};

export default List;
