import React, { useEffect, useState } from 'react';
import { Button, Card, message } from 'antd';
import { NgFormSearch, NgTable } from 'src/components';
import { IActivityRow, searchCols, tableColumns } from './Config';
import { IPagination } from 'src/utils/interface';
import { useHistory } from 'react-router-dom';
import { requestActivityLeadActivityList, requestManActivityLeadActivity } from 'src/apis/publicManage';
// import style from './style.module.less';

const ActivityReservation: React.FC = () => {
  const [list, setList] = useState<IActivityRow[]>([]);
  const [pagination, setPagination] = useState<IPagination>({ current: 1, pageSize: 10, total: 0 });
  // const [recordItem, setRecordItem] = useState<IActivityRow>();
  const [formParam, setFormParam] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(true);

  const history = useHistory();

  const getList = async (values?: any) => {
    const res = await requestActivityLeadActivityList({ ...values });
    setList([{}]);
    if (res) {
      const { list, total } = res;
      setList(list || []);
      setPagination((pagination) => ({
        ...pagination,
        current: values?.pageNum || 1,
        pageSize: values?.pageSize || 10,
        total
      }));
    }
  };

  const onSearch = async (values?: any) => {
    setLoading(true);
    await getList(values);
    setLoading(false);
    setFormParam(values);
  };

  // 置顶
  const toTop = (row: IActivityRow) => {
    // setRecordItem(row);
    console.log('置顶', row);
  };

  // 查看
  const view = (row: IActivityRow) => {
    // setRecordItem(row);
    console.log('查看', row);
  };

  // 上下架 status: 1-未上架; 2-已上架; 3-已下架
  const putOrDown = async ({ status, leadActivityId }: IActivityRow) => {
    // type: 1-上架; 2-下架
    const res = await requestManActivityLeadActivity({ type: status === 2 ? 2 : 1, leadActivityId });
    if (res) {
      getList({ ...formParam, pageNum: pagination.current, pageSize: pagination.pageSize });
      message.success('');
    }
  };

  // 获取链接
  const getLink = (row: IActivityRow) => {
    // setRecordItem(row);
    console.log('获取链接', row);
  };

  // 删除
  const delItem = (row: IActivityRow) => {
    // setRecordItem(row);
    console.log('删除', row);
  };

  // 切换分页
  const paginationChange = (current: number, pageSize?: number) => {
    const pageNum = pageSize !== pagination.pageSize ? 1 : current;
    getList({ ...formParam, pageNum, pageSize: pageSize as number });
  };

  // 创建活动
  const addActivity = () => {
    history.push('/activityReservation/add');
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await getList();
      setLoading(false);
    })();
  }, []);

  return (
    <Card title="销售线索">
      <NgFormSearch searchCols={searchCols} onSearch={onSearch} />
      <Button type="primary" shape="round" onClick={addActivity}>
        创建活动
      </Button>
      <NgTable
        className="mt20"
        loading={loading}
        columns={tableColumns({ toTop, view, putOrDown, getLink, delItem })}
        dataSource={list}
        scroll={{ x: 'max-content' }}
        paginationChange={paginationChange}
      />
    </Card>
  );
};
export default ActivityReservation;
