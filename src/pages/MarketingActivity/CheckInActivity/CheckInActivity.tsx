import React, { useEffect, useState } from 'react';
import { Button, Card, message, Table } from 'antd';
import { NgFormSearch } from 'src/components';
import { searchCols, TableColumns, ICheckInItem } from './Config';
import { useHistory } from 'react-router-dom';
import { requestCheckInActivityList, requestCheckInActivityUpOrDown } from 'src/apis/marketingActivity';
import { copy } from 'tenacity-tools';
import style from './style.module.less';
import classNames from 'classnames';
import { IPagination } from 'src/utils/interface';

const QuestionActivity: React.FC = () => {
  const [list, setList] = useState<ICheckInItem[]>([]);
  const [pagination, setPagination] = useState<IPagination>({ current: 0, pageSize: 10, total: 0 });
  const [formVal, setFormVal] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(true);

  const history = useHistory();

  const getList = async (values?: any) => {
    setLoading(true);
    const { pageNum = 1, pageSize = 10 } = values || {};
    const res = await requestCheckInActivityList(values);
    setLoading(false);
    if (res) {
      const { list, total } = res;
      setList(list || []);
      setPagination({ total, current: pageNum, pageSize });
    }
  };

  const paginationChange = (current: number, pageSize?: number) => {
    // 如果修改pageSize,需要从第一页重新获取
    const pageNum = pageSize === pagination.pageSize ? current : 1;
    getList({ ...formVal, pageNum, pageSize });
  };

  const onFinish = async (values?: any) => {
    console.log('values', values);
    await getList(values);
    setFormVal(values);
  };

  // 上下架
  const putOrDown = async (row: ICheckInItem) => {
    // 未上架与已下架状态支持点击上架操作 未开始与进行中状态支持点击下架操作
    const { actId, status } = row;
    const res = await requestCheckInActivityUpOrDown({ actId, opType: [0, 4].includes(status) ? 1 : 0 });
    if (res) {
      getList({ ...formVal, pageNum: pagination.current, pageSize: pagination.pageSize });
      message.success(`${[0, 4].includes(status) ? '上架' : '下架'}成功`);
    }
  };

  // 编辑修改
  const edit = (row: ICheckInItem) => {
    history.push('/checkIn/add?actId=' + row.actId);
  };
  // 复制活动
  // const copy = (row: any) => {
  //   console.log('复制活动', row);
  // };

  // 创建活动
  const addActivity = () => {
    history.push('/checkIn/add');
  };

  // 复制活动链接
  const copyLink = ({ actId }: ICheckInItem) => {
    const { origin, pathname } = location;
    copy(origin + pathname.split('tenacity-oms')[0] + 'tenacity-webapp-mobile-activity/checkIn?acId=' + actId);
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <Card className={style.card} title="打卡活动">
      <Button type="primary" shape="round" onClick={addActivity}>
        创建活动
      </Button>
      <NgFormSearch className={classNames(style.form, 'mt20')} searchCols={searchCols} onSearch={onFinish} />
      <Table
        dataSource={list}
        className="mt20"
        rowKey="actId"
        scroll={{ x: 'max-content' }}
        columns={TableColumns({ putOrDown, edit, copy: copyLink })}
        pagination={{ ...pagination, onChange: paginationChange, showSizeChanger: true }}
        loading={loading}
      />
    </Card>
  );
};
export default QuestionActivity;
