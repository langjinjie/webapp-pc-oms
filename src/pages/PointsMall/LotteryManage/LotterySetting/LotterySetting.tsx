import React, { useState } from 'react';
import { Button, Tag } from 'antd';
import { Icon } from 'src/components';
import { AddModal, List } from './components';
import { useDocumentTitle } from 'src/utils/base';
import style from './style.module.less';

const LotterySetting: React.FC = () => {
  const [depLsit, setDepList] = useState<{ deptId: number; deptName: string }[]>([]);
  // const [choosedLsit, setChoosedList] = useState<{ deptId: number; deptName: string }[]>([]);
  const [visible, setVisible] = useState(false);
  const clickAddBtn = () => {
    setVisible(true);
  };
  useDocumentTitle('积分管理-抽奖管理');
  return (
    <div className={style.wrap}>
      <div className={style.lotteryList}>
        <div className={style.list}>
          <div className={style.name}>添加抽奖可见名单：</div>
          <div className={style.chooseList}>
            {depLsit.map((item) => (
              <Tag
                key={item.deptId}
                closeIcon={<Icon name="icon_common_Line_Close" className={style.tagIcon} />}
                className={style.tagItem}
                closable
              >
                {item.deptName}
              </Tag>
            ))}
          </div>
          <Button
            className={style.addBtn}
            icon={<Icon className={style.addBtnIcon} name="xinjian" />}
            onClick={clickAddBtn}
          />
        </div>
        <div className={style.tip}>温馨提醒：未在可见名单的坐席，进入a端抽奖页面时，抽奖按钮置灰。</div>
      </div>
      {/* 组织架构 */}
      <AddModal visible={visible} setVisible={setVisible} depLsit={depLsit} setDepList={setDepList} />
      <List />
    </div>
  );
};
export default LotterySetting;
