import React, { useEffect, useState } from 'react';
import { Button, Modal, message } from 'antd';
import { NgTable } from 'src/components';
import { QuestionTableColumns, ITopicRow } from './Config';
import { requestActivityTopicList } from 'src/apis/marketingActivity';
import AddQuestion from './AddQuestion';
import style from './style.module.less';
import classNames from 'classnames';
import qs from 'qs';

const QuestionSettings: React.FC<{
  onConfirm: () => void;
  activityInfo?: { activityId: string; activityName: string };
}> = ({ onConfirm, activityInfo }) => {
  const [addVisible, setAddVisible] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const [currentRow, setCurrentRow] = useState<ITopicRow>();
  const [loading, setLoading] = useState(true);

  // 获取题目列表
  const getList = async () => {
    setLoading(true);
    const { activityId } = qs.parse(location.search, { ignoreQueryPrefix: true });
    const res = await requestActivityTopicList({ activityId });
    setLoading(false);
    if (res) {
      console.log('res', res);
      setList(res);
    }
  };

  // 新增题目
  const addQuestion = () => {
    // 判断题目数量,不能超过8道题目
    if (list.length >= 8) return Modal.warn({ title: '温馨提示', content: '每个活动最多配置8个题目' });
    setAddVisible(true);
  };

  // 修改题目
  const edit = (row: any) => {
    setCurrentRow(row);
    setAddVisible(true);
  };

  const onOk = () => {
    getList();
    setAddVisible(false);
    setCurrentRow(undefined);
    message.success('题目新增成功');
  };

  const onClose = () => {
    setAddVisible(false);
    setCurrentRow(undefined);
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
      <Button className="mt20" type="primary" shape="round" onClick={addQuestion}>
        新增题目
      </Button>
      <span className={classNames(style.tipsText, 'ml20')}>每个活动最多配置8个题目</span>
      <NgTable
        className="mt20"
        dataSource={list}
        loading={loading}
        scroll={{ x: 'max-content' }}
        rowKey="topicId"
        columns={QuestionTableColumns({ edit })}
      />
      {list.length === 0 || (
        <Button className={'mt20'} shape="round" onClick={onConfirm}>
          下一步
        </Button>
      )}
      <AddQuestion value={currentRow} visible={addVisible} onClose={onClose} onOk={onOk} />
    </>
  );
};
export default QuestionSettings;
