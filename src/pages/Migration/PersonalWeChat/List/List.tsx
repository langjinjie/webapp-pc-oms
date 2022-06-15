import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import classNames from 'classnames';

import styles from './style.module.less';
import { Button, message, PaginationProps } from 'antd';
import { NgTable, AuthBtn } from 'src/components';
import { columns, TaskProps } from './Config';
import { exportFile, useDocumentTitle } from 'src/utils/base';
import {
  requestGetWechatTransferTaskList,
  exportTransferTask,
  operationTransferTask,
  queryTransferCorp
} from 'src/apis/migration';
import { StaffModal } from '../AddTask/component';
import moment from 'moment';

interface TransferInfoProps {
  corpId: string;
  corpName: string;
  targetCorpId: string;
  targetCorpName: string;
}
const EnterPriseWechatList: React.FC<RouteComponentProps> = ({ history }) => {
  useDocumentTitle('好友迁移-个微好友');
  const [visibleDetail, setVisibleDetail] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [transferInfo, setTransferInfo] = useState<TransferInfoProps>({
    corpId: '',
    corpName: '',
    targetCorpId: '',
    targetCorpName: ''
  });

  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [tableSource, setTableSource] = useState<TaskProps[]>([]);

  const getTaskList = async (params?: any) => {
    const { list, total } = await requestGetWechatTransferTaskList({
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...params
    });
    setTableSource(list || []);
    setPagination((pagination) => ({ ...pagination, total }));
    console.log('查询列表', list);
  };

  // 操作任务
  const operateItem = async (task: TaskProps, operateType: number, index: number) => {
    const res = await operationTransferTask({ taskId: task.taskId, corpId: transferInfo.corpId, opType: operateType });
    if (res) {
      if (operateType === 1) {
        message.success('关闭成功');
        const copyTableData = [...tableSource];
        copyTableData[index].taskStatus = 2;
        setTableSource(copyTableData);
      } else {
        message.success('删除成功！');
        const resData = tableSource.splice(index, 1);
        if (resData.length > 1) {
          setTableSource(resData);
          setPagination((pagination) => ({ ...pagination, total: (pagination?.total as number) - 1 }));
        } else {
          getTaskList({
            pageNum: 1,
            pageSize: pagination.pageSize
          });
        }
      }
      console.log(res);
    }
  };
  // 查看任务详情
  const viewItem = (taskId: string) => {
    history.push('/enterprise/addTask?taskId=' + taskId);
  };
  // 导出任务详情数据
  const exportData = async (task: TaskProps) => {
    const { data } = await exportTransferTask({ taskId: task.taskId });
    const fileName = task.taskName + moment().format('YYYY-MM-DD');
    exportFile(data, fileName);
  };

  // 查询 新增任务按钮状态
  const getCreateBtnStatus = () => {
    setBtnDisabled(false);
  };

  const myColumns = columns({ operateItem, viewItem, exportData });

  useEffect(() => {
    setLoading(false);
  }, []);

  const getTransferData = async () => {
    const res: TransferInfoProps = await queryTransferCorp();
    if (res.corpId) {
      setTransferInfo(res);
      getTaskList();
    }
  };

  useEffect(() => {
    getCreateBtnStatus();
    getTransferData();
  }, []);

  const onPaginationChange = (pageNum: number, pageSize?: number) => {
    setPagination((pagination) => ({ ...pagination, current: pageNum, pageSize }));
    getTaskList({ pageNum, pageSize });
  };

  // 点击创建任务
  const clickCreateTask = () => {
    if (btnDisabled) return message.info('联系迁移前机构的企微管理员，配置出单宝A端的可见范围');
    history.push('/personal/addTask');
  };
  return (
    <div className={classNames(styles.migration, 'container')}>
      <div className={classNames(styles.addTask, 'flex align-center')}>
        <AuthBtn path="/add">
          <Button
            className={classNames(styles.addBtn, { [styles.disabled]: btnDisabled })}
            type="primary"
            shape="round"
            size="large"
            onClick={clickCreateTask}
          >
            新增任务
          </Button>
        </AuthBtn>
        <div className="ml30 color-text-placeholder">
          {/* 温馨提示：企业每天可对同一个客户发送1条消息，超过上限，客户当天将无法再收到群发消息。 */}
        </div>
      </div>

      <NgTable
        loading={loading}
        pagination={pagination}
        columns={myColumns}
        dataSource={tableSource}
        rowKey={(scope) => scope.taskId}
        paginationChange={onPaginationChange}
      />
      <StaffModal visible={visibleDetail} onClose={() => setVisibleDetail(false)} />
    </div>
  );
};

export default EnterPriseWechatList;
