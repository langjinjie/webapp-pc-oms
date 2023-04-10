import React, { useState } from 'react';
import { Button } from 'antd';
import { NgFormSearch, NgTable } from 'src/components';
import { searchCol, tableColumnsFun } from './Config';
import { OnlineModal } from 'src/pages/Marketing/Components/OnlineModal/OnlineModal';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import style from './style.module.less';
import { SetUserRight } from '../Components/ModalSetUserRight/SetUserRight';
import { useHistory } from 'react-router-dom';

const TodayMoment: React.FC = () => {
  const [onlineModalVisible, setOnlineModalVisible] = useState(false);
  const [visibleSetUserRight, setVisibleSetUserRight] = useState(false);
  const [groupId, setGroupIds] = useState<string>('');

  const history = useHistory();

  // 搜索
  const onSearchHandle = (value: any) => {
    console.log('value', value);
  };

  // 创建今日朋友圈
  const addMomentHandle = () => {
    history.push('/todayMoment/add', { navList: [{ path: '/todayMoment', name: '今日朋友圈' }, { name: '新增' }] });
  };

  // 上架
  const onlineHandle = (row: any) => {
    console.log('row', row);
    setOnlineModalVisible(true);
  };

  // 提交上架
  const onlineOnOkHandle = (corpIds: CheckboxValueType[]) => {
    console.log('corpIds', corpIds);
    setOnlineModalVisible(false);
  };

  // 显示配置可见范围模块
  const setRight = (record?: any) => {
    setGroupIds(record.groupId || '');
    setVisibleSetUserRight(true);
  };
  // 提交配置可见范围
  const setRightOnOkHandle = (values?: any) => {
    console.log('values', values);
  };
  return (
    <div className="container">
      <Button className={style.addBtn} shape="round" type="primary" onClick={addMomentHandle}>
        创建
      </Button>
      <NgFormSearch searchCols={searchCol} onSearch={onSearchHandle} />
      <NgTable className="mt24" columns={tableColumnsFun({ onlineHandle, setRight })} dataSource={[{}]} />
      <OnlineModal
        isCheckAll
        visible={onlineModalVisible}
        onCancel={() => setOnlineModalVisible(false)}
        onOk={onlineOnOkHandle}
      />
      <SetUserRight
        visible={visibleSetUserRight}
        onOk={setRightOnOkHandle}
        groupId={groupId}
        onCancel={() => setVisibleSetUserRight(false)}
      />
    </div>
  );
};
export default TodayMoment;
