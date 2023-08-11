import React, { useState } from 'react';
import { Button } from 'antd';
import { NgTable } from 'src/components';
import { QuestionTableColumns } from './Config';
import AddQuestion from './AddQuestion';
import style from './style.module.less';
import classNames from 'classnames';

const QuestionSettings: React.FC = () => {
  const [addVisible, setAddVisible] = useState(false);
  const [list, setList] = useState<any[]>([]);
  // 修改题目
  const edit = (row: any) => {
    console.log('row', row);
  };

  const onOk = (row: any) => {
    setList((list) => [...list, row]);
  };

  return (
    <>
      <div>
        <span>活动编号：{'P52230103268794'}</span>
        <span className="ml40">活动名称：{'测试'}</span>
      </div>
      <Button className="mt20" type="primary" shape="round" onClick={() => setAddVisible(true)}>
        新增题目
      </Button>
      <span className={classNames(style.tipsText, 'ml20')}>每个活动最多配置8个题目</span>
      <NgTable className="mt20" columns={QuestionTableColumns({ edit })} />
      {list.length === 0 || (
        <div className="operationWrap">
          <Button htmlType="submit" type="primary" shape="round">
            保存
          </Button>
          <Button className={'ml20'} shape="round">
            下一步
          </Button>
        </div>
      )}
      <AddQuestion visible={addVisible} onClose={() => setAddVisible(false)} onOk={onOk} />
    </>
  );
};
export default QuestionSettings;
