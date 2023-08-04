import React from 'react';
import { Button, Card } from 'antd';
import { NgFormSearch, NgTable } from 'src/components';
import { searchCols, TableColumns } from './Config';
import style from './style.module.less';

const QuestionActivity: React.FC = () => {
  const onFinish = (values?: any) => {
    console.log('values', values);
  };
  return (
    <Card className={style.card} title="问答活动">
      <Button type="primary" shape="round">
        创建活动
      </Button>
      <NgFormSearch className={style.form} searchCols={searchCols} onSearch={onFinish} />
      <NgTable columns={TableColumns()} />
    </Card>
  );
};
export default QuestionActivity;
