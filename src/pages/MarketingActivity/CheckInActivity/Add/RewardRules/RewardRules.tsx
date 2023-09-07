import React, { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import { NgTable } from 'src/components';
import { TableColumns, IRuleItem } from './Config';
import { requestCheckInActivityRuleList, requestDelQuestionActivityPrize } from 'src/apis/marketingActivity';
import AddRules from './AddRules';
import style from './style.module.less';
import classNames from 'classnames';
import qs from 'qs';

const RewardRules: React.FC<{ activityInfo?: { activityId: string; activityName: string } }> = ({ activityInfo }) => {
  const [addVisible, setAddVisible] = useState(false);
  const [list, setList] = useState<IRuleItem[]>([]);
  const [currentRow, setCurrentRow] = useState<IRuleItem>();

  const getList = async () => {
    const { actId } = qs.parse(location.search, { ignoreQueryPrefix: true });
    const res = await requestCheckInActivityRuleList({ actId });
    if (res) {
      setList(res.list || []);
    }
  };

  const edit = (row: IRuleItem) => {
    setCurrentRow(row);
    setAddVisible(true);
  };

  const del = async ({ actId, prId }: IRuleItem) => {
    const res = await requestDelQuestionActivityPrize({ actId, prId });
    if (res) {
      getList();
      message.success('规则删除成功');
    }
  };

  const onOk = () => {
    setAddVisible(false);
    setCurrentRow(undefined);
    getList();
    message.success(`奖励规则${currentRow ? '编辑' : '新增'}成功`);
  };

  useEffect(() => {
    getList();
  }, []);
  return (
    <>
      <div>
        <span>活动编号：{activityInfo?.activityId}</span>
        <span className="ml40">活动名称：{activityInfo?.activityName}</span>
      </div>
      <Button className="mt20" type="primary" shape="round" onClick={() => setAddVisible(true)}>
        新增规则
      </Button>
      <span className={classNames(style.tipsText, 'ml20')}>每个活动最多配置8个题目</span>
      <NgTable
        className="mt20"
        rowKey="prId"
        scroll={{ x: 'max-content' }}
        columns={TableColumns({ edit, del })}
        dataSource={list}
      />
      <AddRules value={currentRow} visible={addVisible} onClose={() => setAddVisible(false)} onOk={onOk} />
    </>
  );
};
export default RewardRules;
