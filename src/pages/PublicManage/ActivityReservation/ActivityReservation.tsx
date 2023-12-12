import React, { useEffect, useState } from 'react';
import { Button, Card, message } from 'antd';
import { AuthBtn, NgFormSearch, NgTable } from 'src/components';
import { IActivityRow, searchCols, tableColumns } from './Config';
import { IPagination } from 'src/utils/interface';
import { useHistory } from 'react-router-dom';
import {
  requestActivityLeadActivityList,
  requestManActivityLeadActivity,
  requestDelActivityLeadActivity,
  requestTopActivityLeadActivity,
  requestActivityLeadActivityShortUrl
} from 'src/apis/publicManage';
import { copy } from 'tenacity-tools';
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
  const toTop = async ({ leadActivityId }: IActivityRow) => {
    const res = await requestTopActivityLeadActivity({ leadActivityId });
    if (res) {
      getList({ ...formParam, pageNum: pagination.current, pageSize: pagination.pageSize });
      message.success('置顶成功');
    }
  };

  // 查看
  const view = ({ leadActivityId }: IActivityRow) => {
    history.push('/activityReservation/add?leadActivityId=' + leadActivityId);
  };

  // 上下架 status: 1-未上架; 2-已上架; 3-已下架
  const putOrDown = async ({ status, leadActivityId }: IActivityRow) => {
    // type: 1-上架; 2-下架、
    const type = status === 2 ? 2 : 1;
    const res = await requestManActivityLeadActivity({ type, leadActivityId });
    if (res) {
      getList({ ...formParam, pageNum: pagination.current, pageSize: pagination.pageSize });
      message.success(`${type === 1 ? '上架' : '下架'}成功`);
    }
  };

  // 获取链接
  const getLink = async ({ leadActivityId }: IActivityRow) => {
    const res = await requestActivityLeadActivityShortUrl({ leadActivityId });
    if (res) {
      copy(res.shortUrl);
    }
  };

  // 删除
  const delItem = async ({ leadActivityId }: IActivityRow) => {
    const { current, pageSize } = pagination;
    const res = await requestDelActivityLeadActivity({ leadActivityId });
    if (res) {
      getList({ ...formParam, pageNum: list.length <= 1 ? current - 1 : current, pageSize });
      message.success('删除成功');
    }
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
    <Card title="销售线索" bordered={false}>
      <AuthBtn path="/query">
        <NgFormSearch searchCols={searchCols} onSearch={onSearch} />
      </AuthBtn>
      <AuthBtn path="/add">
        <Button type="primary" shape="round" onClick={addActivity}>
          创建活动
        </Button>
      </AuthBtn>
      <NgTable
        className="mt20"
        rowKey="leadActivityId"
        loading={loading}
        columns={tableColumns({ toTop, view, putOrDown, getLink, delItem })}
        dataSource={list}
        scroll={{ x: 'max-content' }}
        pagination={pagination}
        paginationChange={paginationChange}
      />
    </Card>
  );
};
export default ActivityReservation;
