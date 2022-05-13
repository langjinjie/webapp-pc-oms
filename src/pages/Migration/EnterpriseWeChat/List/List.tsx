import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import classNames from 'classnames';

import styles from './style.module.less';
import { Button, message, PaginationProps } from 'antd';
import PieChart, { PieDataItem } from './PieChart';
import { Icon, NgTable } from 'src/components';
import { columns, TaskProps } from './Config';
import { exportFile, useDocumentTitle } from 'src/utils/base';
import EmptyTask from '../components/EmptyTask/EmptyTask';
import {
  exportTransferTask,
  getTransferTaskList,
  operationTransferTask,
  queryTransferCorp,
  queryTransferSummary
} from 'src/apis/migration';
import { percentage } from 'src/utils/tools';
import { StaffModal } from '../AddTask/component';
import moment from 'moment';

interface TransferInfoProps {
  corpId: string;
  corpName: string;
  targetCorpId: string;
  targetCorpName: string;
}
const EnterPriseWechatList: React.FC<RouteComponentProps> = ({ history }) => {
  useDocumentTitle('好友迁移-企微好友');
  const [isEmpty, setIsEmpty] = useState<boolean>();
  const [visibleDetail, setVisibleDetail] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [transferInfo, setTransferInfo] = useState<TransferInfoProps>({
    corpId: '',
    corpName: '',
    targetCorpId: '',
    targetCorpName: ''
  });

  interface TransferDataProps {
    transferSuccNum: number;
    unTransferNum: number;
    updateTime: string;
    totalNum: number;
  }
  const [pieChartData, setPieCharData] = useState<PieDataItem[]>([]);
  const [pieInfo, setPieInfo] = useState<TransferDataProps>();

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
    const { list, total } = await getTransferTaskList({
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

  //
  const myColumns = columns({ operateItem, viewItem, exportData });

  useEffect(() => {
    setLoading(false);
  }, []);

  const getPieInfo = async () => {
    const res: TransferDataProps = await queryTransferSummary();
    setPieInfo(res || {});
    if (res) {
      setPieCharData([
        { value: res.transferSuccNum, name: '迁移成功' },
        {
          value: res.unTransferNum,
          name: '待迁移'
        }
      ]);
    }
  };

  const getTransferData = async () => {
    const res: TransferInfoProps = await queryTransferCorp();
    if (res.corpId) {
      setIsEmpty(false);
      setTransferInfo(res);
      getPieInfo();
      getTaskList();
    } else {
      setIsEmpty(true);
    }
  };

  useEffect(() => {
    getTransferData();
    // 测试用的
  }, []);

  // 创建任务成功
  const createdTaskSuccess = async () => {
    // 查询迁移机构信息
    setIsEmpty(false);
    await getTransferData();
  };

  const onPaginationChange = (pageNum: number, pageSize?: number) => {
    setPagination((pagination) => ({ ...pagination, current: pageNum, pageSize }));
    getTaskList({ pageNum, pageSize });
  };

  // 点击创建任务
  const clickCreateTask = () => {
    if (btnDisabled) return message.info('请联系迁移前机构的企微管理员，配置好友传送门的可见范围');
    history.push('/enterprise/addTask');
  };
  return (
    <div className={classNames(styles.migration, 'container')}>
      {isEmpty === true
        ? (
        <EmptyTask createdSuccess={() => createdTaskSuccess()} />
          )
        : isEmpty === false
          ? (
        <div>
          <header>
            <h2 className={classNames('color-text-regular flex align-center', styles.page_title)}>
              企微好友迁移，从未如此简单！
              <span className="flex">
                （{transferInfo.corpName} <Icon name="jiantou" className={styles.arrow}></Icon>{' '}
                {transferInfo.targetCorpName}）
              </span>
            </h2>
            <section className={classNames(styles.kanban, 'flex')}>
              <div className={classNames(styles.kanbanLeft, 'flex vertical justify-between')}>
                <div className="font16 color-text-primary bold">全部客户经理迁移进度</div>
                <Button
                  type="default"
                  size="large"
                  shape="round"
                  className={styles.btnViewRange}
                  onClick={() => setVisibleDetail(true)}
                >
                  查看可见范围
                </Button>
              </div>

              <div className={classNames(styles.kanbanRight, 'flex cell')}>
                <PieChart data={pieChartData}></PieChart>
                <div className={classNames(styles.pieInfo, 'flex cell vertical justify-between')}>
                  <div className={classNames(styles.pieData, 'flex')}>
                    <div>
                      <div className={styles.pieBar}>
                        <i className={classNames(styles.pieTag, styles.pieTag_success)}></i>
                        <span className="font12 color-text-regular">迁移成功</span>
                      </div>
                      <div className="mt10 font16">
                        {pieInfo
                          ? (
                          <span>
                            {pieInfo?.transferSuccNum}（{percentage(pieInfo?.transferSuccNum, pieInfo?.totalNum)}）
                          </span>
                            )
                          : (
                          <span>暂无数据</span>
                            )}
                      </div>
                    </div>
                    <div className="ml50">
                      <div className={styles.pieBar}>
                        <i className={classNames(styles.pieTag, styles.pieTag_wait)}></i>
                        <span className="font12 color-text-regular">待迁移</span>
                      </div>
                      <div className="mt10 font16">
                        {pieInfo
                          ? (
                          <span>
                            {pieInfo?.unTransferNum}（{percentage(pieInfo.unTransferNum!, pieInfo.totalNum!)}）
                          </span>
                            )
                          : (
                          <span>暂无异常</span>
                            )}
                      </div>
                    </div>
                  </div>
                  <div className="mt6 font12 color-text-placeholder">饼状图数据更新于 {pieInfo?.updateTime}</div>
                </div>
              </div>
            </section>
          </header>

          <div className={classNames(styles.addTask, 'flex align-center')}>
            <Button
              className={classNames({ [styles.disabled]: btnDisabled })}
              type="primary"
              shape="round"
              size="large"
              onClick={clickCreateTask}
            >
              创建群发任务
            </Button>
            <div className="ml30 color-text-placeholder">
              温馨提示：企业每天可对同一个客户发送1条消息，超过上限，客户当天将无法再收到群发消息。
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
          <StaffModal setBtnDisabled={setBtnDisabled} visible={visibleDetail} onClose={() => setVisibleDetail(false)} />
        </div>
            )
          : null}
    </div>
  );
};

export default EnterPriseWechatList;
