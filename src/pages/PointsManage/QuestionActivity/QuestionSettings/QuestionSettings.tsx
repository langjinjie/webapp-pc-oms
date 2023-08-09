import React from 'react';
import { Button } from 'antd';
import { NgTable } from 'src/components';
import { QuestionTableColumns } from './Config';
import style from './style.module.less';
import classNames from 'classnames';

const QuestionSettings: React.FC = () => {
  // 修改题目
  const edit = (row: any) => {
    console.log('row', row);
  };

  return (
    <>
      <div>
        <span>活动编号：{'P52230103268794'}</span>
        <span className="ml40">活动名称：{'测试'}</span>
      </div>
      <Button className="mt20" type="primary" shape="round">
        新增题目
      </Button>
      <span className={classNames(style.tipsText, 'ml20')}>每个活动最多配置8个题目</span>
      <NgTable className="mt20" columns={QuestionTableColumns({ edit })} />
      <div className="operationWrap">
        <Button htmlType="submit" type="primary" shape="round">
          保存
        </Button>
        <Button className={'ml20'} shape="round">
          下一步
        </Button>
      </div>
    </>
  );
};
export default QuestionSettings;
