import React from 'react';
import { Button, Card } from 'antd';
import { NgFormSearch, NgTable } from 'src/components';
import { searchCols, TableColumns } from './Config';
import style from './style.module.less';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';

const QuestionActivity: React.FC = () => {
  const history = useHistory();

  const onFinish = (values?: any) => {
    console.log('values', values);
  };

  // 上下架
  const putOrDown = (row: any) => {
    console.log('row', row);
  };

  // 编辑修改
  const edit = (row: any) => {
    console.log('row', row);
  };

  // 复制活动
  const copyActivity = (row: any) => {
    console.log('row', row);
  };

  // 创建活动
  const addActivity = () => {
    history.push('/checkIn/add');
  };

  return (
    <Card className={style.card} title="打卡活动">
      <Button type="primary" shape="round" onClick={addActivity}>
        创建活动
      </Button>
      <NgFormSearch className={classNames(style.form, 'mt20')} searchCols={searchCols} onSearch={onFinish} />
      <NgTable className="mt20" columns={TableColumns({ putOrDown, edit, copyActivity })} />
    </Card>
  );
};
export default QuestionActivity;
