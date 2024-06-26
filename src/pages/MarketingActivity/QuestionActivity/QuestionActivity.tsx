import React, { useEffect, useState } from 'react';
import { Button, Card, message, Table } from 'antd';
import { NgFormSearch } from 'src/components';
import { searchCols, TableColumns, IQuestionActivityRow } from './Config';
import { useHistory } from 'react-router-dom';
import { IPagination } from 'src/utils/interface';
import { copy } from 'tenacity-tools';
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
    const res = await requestQuestionActivityList({ ...values });
    setLoading(false);
    if (res) {
      const { list, total } = res;
      setList(list || []);
      setPagination({ current: pageNum, pageSize, total });
    }
  };

  const onFinish = async (values?: any) => {
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

  // 复制活动链接
  const copyLink = ({ activityId }: IQuestionActivityRow) => {
    const { origin, pathname } = location;
    copy(origin + pathname.split('tenacity-oms')[0] + 'tenacity-webapp-mobile-activity/question?acId=' + activityId);
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
      <Table
        rowKey={'activityId'}
        columns={TableColumns({ putOrDown, edit, copy: copyLink })}
        loading={loading}
        scroll={{ x: 'max-content' }}
        dataSource={list}
        pagination={{ ...pagination, onChange: paginationChange, showSizeChanger: true }}
      />
    </Card>
  );
};
export default QuestionActivity;
