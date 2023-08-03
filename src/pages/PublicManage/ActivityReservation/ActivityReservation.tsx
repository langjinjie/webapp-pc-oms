import React, { useEffect, useState } from 'react';
import { Button, Card } from 'antd';
import { NgFormSearch, NgTable } from 'src/components';
import { IActivityRow, searchCols, tableColumns } from './Config';
import { IPagination } from 'src/utils/interface';
import { useHistory } from 'react-router-dom';
// import style from './style.module.less';

const ActivityReservation: React.FC = () => {
  const [list, setList] = useState<IActivityRow[]>([]);
  const [pagination, setPagination] = useState<IPagination>({ current: 1, pageSize: 10, total: 0 });
  const [recordItem, setRecordItem] = useState<IActivityRow>();
  const [formParam, setFormParam] = useState<{ [key: string]: any }>({});

  const history = useHistory();

  const getList = (values?: any) => {
    console.log('recordItem', recordItem);
    console.log('values', values);
    setList([]);
    setPagination((pagination) => ({ ...pagination, current: values?.pageNum || 1, pageSize: values?.pageSize || 10 }));
  };

  const onSearch = (values?: any) => {
    console.log('values', values);
    setFormParam(values);
  };

  // 置顶
  const toTop = (row: IActivityRow) => {
    setRecordItem(row);
  };

  // 查看
  const view = (row: IActivityRow) => {
    setRecordItem(row);
  };

  // 上下架
  const putOrDown = (row: IActivityRow) => {
    setRecordItem(row);
  };

  // 获取链接
  const getLink = (row: IActivityRow) => {
    setRecordItem(row);
  };

  // 删除
  const delItem = (row: IActivityRow) => {
    setRecordItem(row);
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
    getList();
  }, []);

  return (
    <Card title="销售线索">
      <NgFormSearch searchCols={searchCols} onSearch={onSearch} />
      <Button type="primary" shape="round" onClick={addActivity}>
        创建活动
      </Button>
      <NgTable
        className="mt20"
        columns={tableColumns({ toTop, view, putOrDown, getLink, delItem })}
        dataSource={list}
        scroll={{ x: 'max-content' }}
        paginationChange={paginationChange}
      />
    </Card>
  );
};
export default ActivityReservation;
