import React, { useEffect, useState } from 'react';
import { Button, PaginationProps } from 'antd';
import { NgFormSearch, NgTable } from 'src/components';
import { searchCol, tableColumnsFun, ITodayMomentRow } from './Config';
import { OnlineModal } from 'src/pages/Marketing/Components/OnlineModal/OnlineModal';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { SetUserRight } from '../Components/ModalSetUserRight/SetUserRight';
import { useHistory } from 'react-router-dom';
import { requestGetTodayMomentList } from 'src/apis/marketing';
import style from './style.module.less';

const TodayMoment: React.FC = () => {
  const [list, setList] = useState<ITodayMomentRow[]>([]);
  const [onlineModalVisible, setOnlineModalVisible] = useState(false);
  const [visibleSetUserRight, setVisibleSetUserRight] = useState(false);
  const [groupId, setGroupIds] = useState<string>('');
  const [formParam, setFormParam] = useState<{ [key: string]: any }>({});
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const history = useHistory();

  // 获取列表
  const getList = async (values?: any) => {
    console.log('values', values);
    const res = await requestGetTodayMomentList(values);
    if (res) {
      setList(res.list || []);
      setPagination((pagination) => ({ ...pagination, total: res.total || 0 }));
    }
  };

  // 搜索
  const onSearchHandle = (values?: any) => {
    getList(values);
    setFormParam(values);
  };

  // 切换分页
  const paginationChange = (current: number, pageSize?: number) => {
    const pageNum = pageSize !== pagination.pageSize ? 1 : current;
    setPagination((pagination) => ({ ...pagination, current: pageNum, pageSize: pageSize as number }));
    getList({ ...formParam, pageNum, pageSize: pageSize as number });
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

  useEffect(() => {
    getList();
  }, []);
  return (
    <div className="container">
      <Button className={style.addBtn} shape="round" type="primary" onClick={addMomentHandle}>
        创建
      </Button>
      <NgFormSearch searchCols={searchCol} onSearch={onSearchHandle} />
      <NgTable
        id="momentId"
        className="mt24"
        columns={tableColumnsFun({ onlineHandle, setRight })}
        dataSource={list}
        pagination={pagination}
        paginationChange={paginationChange}
      />
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
