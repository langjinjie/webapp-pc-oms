import React, { useContext, useState } from 'react';
import { Button, Tag } from 'antd';
import { AuthBtn, Icon } from 'src/components';
import { AddModal, List } from './components';
import { useDocumentTitle } from 'src/utils/base';
import { IDeptRecord } from 'src/utils/interface';
import { requestAddLotteryScope } from 'src/apis/pointsMall';
import style from './style.module.less';
import { Context } from 'src/store';

const LotterySetting: React.FC = () => {
  const { setConfirmModalParam } = useContext(Context);
  const [depLsit, setDepList] = useState<IDeptRecord>();
  // const [choosedLsit, setChoosedList] = useState<{ deptId: number; deptName: string }[]>([]);
  const [addScopeParam, setAddScopeParam] = useState({ visible: false, added: false });
  const clickAddBtn = () => {
    setAddScopeParam({ added: false, visible: true });
  };
  // 删除抽奖可见名单
  const onClose = async (event: React.MouseEvent<HTMLElement, MouseEvent>, index: number) => {
    event.preventDefault();
    setConfirmModalParam({
      visible: true,
      title: '删除提醒',
      tips: '是否确定把该组从可见名单中删除',
      onOk: async () => {
        const deptIds = depLsit?.scopeDeptIds.split(';') || [];
        deptIds.splice(index, 1);
        // return;
        const res = await requestAddLotteryScope({ deptIds: deptIds.toString().replace(/,/g, ';') });
        if (res) {
          setAddScopeParam({ ...addScopeParam, added: true });
          setConfirmModalParam({ visible: false });
        }
      }
    });
  };
  useDocumentTitle('积分管理-抽奖管理');
  return (
    <div className={style.wrap}>
      <div className={style.lotteryList}>
        <div className={style.list}>
          <div className={style.name}>添加抽奖可见名单：</div>
          <div className={style.chooseList}>
            {depLsit?.scopeDeptNames &&
              depLsit?.scopeDeptNames.split(';').map((item, index) => (
                <Tag
                  key={item + index}
                  closeIcon={
                    <AuthBtn path="/add">
                      <Icon name="icon_common_Line_Close" className={style.tagIcon} />
                    </AuthBtn>
                  }
                  className={style.tagItem}
                  closable
                  onClose={(event) => onClose(event, index)}
                >
                  {item}
                </Tag>
              ))}
          </div>
          <AuthBtn path="/add">
            <Button
              className={style.addBtn}
              icon={<Icon className={style.addBtnIcon} name="xinjian" />}
              onClick={clickAddBtn}
            />
          </AuthBtn>
        </div>
        <div className={style.tip}>温馨提醒：未在可见名单的坐席，进入a端抽奖页面时，抽奖按钮置灰。</div>
      </div>
      {/* 组织架构 */}
      <AddModal addScopeParam={addScopeParam} setAddScopeParam={setAddScopeParam} depLsit={depLsit as IDeptRecord} />
      <List addScopeParam={addScopeParam} setDepList={setDepList} />
    </div>
  );
};
export default LotterySetting;
