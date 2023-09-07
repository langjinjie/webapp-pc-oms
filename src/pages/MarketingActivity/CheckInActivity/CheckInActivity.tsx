import React, { useEffect, useState } from 'react';
import { Button, Card, message } from 'antd';
import { NgFormSearch, NgTable } from 'src/components';
import { searchCols, TableColumns, ICheckInItem } from './Config';
import { useHistory } from 'react-router-dom';
import { requestCheckInActivityList, requestCheckInActivityUpOrDown } from 'src/apis/marketingActivity';
import style from './style.module.less';
import classNames from 'classnames';
import { IPagination } from 'src/utils/interface';

const QuestionActivity: React.FC = () => {
  const [list, setList] = useState<ICheckInItem[]>([]);
  const [pagination, setPagination] = useState<IPagination>({ current: 0, pageSize: 10, total: 0 });
  const [formVal, setFormVal] = useState<{ [key: string]: any }>({});

  const history = useHistory();

  const getList = async (values?: any) => {
    console.log('values', values);
    const { pageNum = 1, pageSize = 10 } = values || {};
    const res = await requestCheckInActivityList(values);
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
  const putOrDown = async (row: any) => {
    // 未上架与已下架状态支持点击上架操作 未开始与进行中状态支持点击下架操作
    const { actId, status } = row;
    const res = await requestCheckInActivityUpOrDown({ actId, opType: [0, 4].includes(status) ? 1 : 0 });
    if (res) {
      getList({ ...formVal, pageNum: pagination.current, pageSize: pagination.pageSize });
      message.success(`${[0, 4].includes(status) ? '上架' : '下架'}成功`);
    }
  };

  // 编辑修改
  const edit = (row: any) => {
    history.push('/checkIn/add?actId=' + row.actId);
  };
  // 复制活动
  const copy = (row: any) => {
    console.log('复制活动', row);
  };

  // 创建活动
  const addActivity = () => {
    history.push('/checkIn/add');
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
      <NgTable
        dataSource={list}
        className="mt20"
        rowKey="actId"
        columns={TableColumns({ putOrDown, edit, copy })}
        pagination={pagination}
        paginationChange={paginationChange}
      />
    </Card>
  );
};
export default QuestionActivity;
