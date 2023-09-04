import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { NgTable } from 'src/components';
import { TableColumns } from './Config';
import AddRules from './AddRules';
import style from './style.module.less';
import classNames from 'classnames';

const RewardRules: React.FC<{ onConfirm: () => void }> = ({ onConfirm }) => {
  const [addVisible, setAddVisible] = useState(false);

  const edit = (row: any) => {
    console.log('row', row);
  };

  const del = (row: any) => {
    console.log('row', row);
  };

  useEffect(() => {
    console.log('奖励规则', onConfirm);
  }, []);

  return (
    <>
      <div>
        <span>活动编号：{'P52230103268794'}</span>
        <span className="ml40">活动名称：{'测试'}</span>
      </div>
      <Button className="mt20" type="primary" shape="round" onClick={() => setAddVisible(true)}>
        新增规则
      </Button>
      <span className={classNames(style.tipsText, 'ml20')}>每个活动最多配置8个题目</span>
      <NgTable className="mt20" columns={TableColumns({ edit, del })} />
      <AddRules visible={addVisible} onClose={() => setAddVisible(false)} />
    </>
  );
};
export default RewardRules;
