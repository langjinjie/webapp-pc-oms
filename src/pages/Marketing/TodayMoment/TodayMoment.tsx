import React, { useEffect, useState } from 'react';
import { Button, Modal, PaginationProps, message } from 'antd';
import { NgFormSearch, NgTable } from 'src/components';
import { searchCol, tableColumnsFun, ITodayMomentRow } from './Config';
import { OnlineModal } from 'src/pages/Marketing/Components/OnlineModal/OnlineModal';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { SetUserRight } from '../Components/ModalSetUserRight/SetUserRight';
import { useHistory } from 'react-router-dom';
import {
  requestGetTodayMomentList,
  requestDownTodayMoment,
  requestUpTodayMoment,
  requestSetScopeTodayMoment
} from 'src/apis/todayMoment';
import style from './style.module.less';

const TodayMoment: React.FC = () => {
  const [list, setList] = useState<ITodayMomentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlineModalVisible, setOnlineModalVisible] = useState(false);
  const [visibleSetUserRight, setVisibleSetUserRight] = useState(false);
  const [groupId, setGroupIds] = useState<string>('');
  const [formParam, setFormParam] = useState<{ [key: string]: any }>({});
  const [currentRow, setCurrentRow] = useState<ITodayMomentRow>();
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const history = useHistory();

  // 获取列表
  const getList = async (values?: any) => {
    setLoading(true);
    const res = await requestGetTodayMomentList(values);
    if (res) {
      setList(res.list || []);
      setPagination((pagination) => ({ ...pagination, total: res.total || 0 }));
    }
    setLoading(false);
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

  // 上下架
  const onlineHandle = (row: ITodayMomentRow) => {
    // 1-上架状态,需要进行下架处理
    if (row.state === 1) {
      Modal.confirm({
        title: '下架提示',
        content: '是否确定下架该今日朋友圈',
        centered: true,
        async onOk () {
          const res = await requestDownTodayMoment({ momentIds: [row.momentId] });
          if (res) {
            getList({ ...formParam, pageNum: pagination.current, pageSize: pagination.pageSize });
            message.success('该今日朋友圈下架成功');
          }
        }
      });
    } else {
      setCurrentRow(row);
      setOnlineModalVisible(true);
    }
  };

  // 提交上架
  const onlineOnOkHandle = async (corpIds: CheckboxValueType[]) => {
    const res = await requestUpTodayMoment({ momentIds: [currentRow?.momentId], corpIds });
    if (res) {
      setOnlineModalVisible(false);
      setCurrentRow(undefined);
      getList({ ...formParam, pageNum: pagination.current, pageSize: pagination.pageSize });
      message.success('改今日朋友圈上架成功');
    }
  };
  // 编辑今日朋友圈
  const editHandle = (row: ITodayMomentRow) => {
    history.push('/todayMoment/add?momentId=' + row.momentId, {
      navList: [{ path: '/todayMoment', name: '今日朋友圈' }, { name: '编辑' }]
    });
  };

  // 显示配置可见范围模块
  const setRight = (row: ITodayMomentRow) => {
    setCurrentRow(row);
    setGroupIds(row.groupId || '');
    setVisibleSetUserRight(true);
  };
  // 提交配置可见范围
  const setRightOnOkHandle = async (values?: any) => {
    const res = await requestSetScopeTodayMoment({ momentIds: [currentRow?.momentId], groupId: values.groupId });
    if (res) {
      setCurrentRow(undefined);
      setGroupIds('');
      setVisibleSetUserRight(false);
      message.success('可见范围配置成功');
      getList({ ...formParam, pageNum: pagination.current, pageSize: pagination.pageSize });
    }
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
        rowKey="momentId"
        loading={loading}
        className="mt24"
        columns={tableColumnsFun({ onlineHandle, editHandle, setRight })}
        dataSource={list}
        scroll={{ x: 'max-content' }}
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
