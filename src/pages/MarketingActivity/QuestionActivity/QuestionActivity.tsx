import React, { useEffect, useState } from 'react';
import { Button, Card, message } from 'antd';
import { NgFormSearch, NgTable } from 'src/components';
import { searchCols, TableColumns, IQuestionActivityRow } from './Config';
import { useHistory } from 'react-router-dom';
import { IPagination } from 'src/utils/interface';
import { requestQuestionActivityList, requestUpDownQuestionActivity } from 'src/apis/marketingActivity';
import style from './style.module.less';

const QuestionActivity: React.FC = () => {
  const history = useHistory();
  const [list, setList] = useState<IQuestionActivityRow[]>([]);
  const [formVal, setFormVal] = useState<{ [key: string]: string }>({});
  const [pagination, setPagination] = useState<IPagination>({ current: 1, pageSize: 10, total: 0 });
  const [loading, setLoading] = useState(true);

  const getList = async (values?: any) => {
    setLoading(true);
    const { pageNum = 1, pageSize = 10 } = values || {};
    const res = await requestQuestionActivityList({ ...values }).finally(() => setLoading(false));
    if (res) {
      const { list, total } = res;
      setList(list || []);
      setPagination({ current: pageNum, pageSize, total });
    }
  };

  const onFinish = async (values?: any) => {
    console.log('values', values);
    await getList(values);
    setFormVal(values);
  };

  const paginationChange = (current: number, pageSize?: number) => {
    // 如果修改pageSize,需要从第一页重新获取
    const pageNum = pageSize === pagination.pageSize ? current : 1;
    getList({ ...formVal, pageNum, pageSize });
  };

  // 上下架
  const putOrDown = async ({ activityId, status }: IQuestionActivityRow) => {
    const res = await requestUpDownQuestionActivity({ status: [1, 3].includes(status) ? 2 : 3, activityId });
    if (res) {
      getList({ ...formVal, pageNum: pagination.current, pageSize: pagination.pageSize });
      message.success(`${[1, 3].includes(status) ? '上架' : '下架'}成功`);
    }
  };

  // 编辑修改
  const edit = ({ activityId }: IQuestionActivityRow) => {
    history.push(`/questionActivity/add?activityId=${activityId}`);
  };

  // 创建活动
  const addActivity = () => {
    history.push('/questionActivity/add');
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <Card className={style.card} title="问答活动">
      <Button type="primary" shape="round" onClick={addActivity}>
        创建活动
      </Button>
      <NgFormSearch className={style.form} searchCols={searchCols} onSearch={onFinish} />
      <NgTable
        rowKey={'activityId'}
        columns={TableColumns({ putOrDown, edit })}
        loading={loading}
        scroll={{ x: 'max-content' }}
        dataSource={list}
        pagination={pagination}
        paginationChange={paginationChange}
      />
    </Card>
  );
};
export default QuestionActivity;
