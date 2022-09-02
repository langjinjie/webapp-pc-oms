import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, message, PaginationProps, Form, Input } from 'antd';
import { NgTable, AuthBtn } from 'src/components';
import { columns, TaskProps } from './Config';
import { exportFile, useDocumentTitle } from 'src/utils/base';
import {
  requestGetWechatTransferTaskList,
  requestExportTransferWechatTask,
  requestOpWechatTransferTask,
  requestGetCreateButtonStatus
} from 'src/apis/migration';
import { Context } from 'src/store';
import moment from 'moment';
import classNames from 'classnames';
import styles from './style.module.less';

const EnterPriseWechatList: React.FC<RouteComponentProps> = ({ history }) => {
  useDocumentTitle('好友迁移-个微好友');
  const { currentCorpId: corpId } = useContext(Context);
  const [searchParam, setSearchParam] = useState<{ [key: string]: any }>({});
  const [btnDisabled, setBtnDisabled] = useState(false);
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

  const [form] = Form.useForm();
  const { Item } = Form;

  // 获取任务列表
  const getTaskList = async (params?: any) => {
    setLoading(true);
    const res = await requestGetWechatTransferTaskList({
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...params
    });
    if (res) {
      const { list, total } = res;
      setTableSource(list || []);
      setPagination((pagination) => ({ ...pagination, total }));
    }
    setLoading(false);
  };

  // 点击查询
  const onFinish = (values: { [key: string]: any }) => {
    setSearchParam(values);
    getTaskList({
      pageNum: 1,
      pageSize: pagination.pageSize,
      ...values
    });
  };

  // 点击重置
  const onResetHandle = () => {
    setSearchParam({});
    getTaskList({
      pageNum: 1,
      pageSize: pagination.pageSize
    });
  };

  // 操作任务
  const operateItem = async (task: TaskProps, operateType: number, index: number) => {
    const res = await requestOpWechatTransferTask({ taskId: task.taskId, corpId, opType: operateType });
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
            pageSize: pagination.pageSize,
            ...searchParam
          });
        }
      }
    }
  };
  // 查看任务详情
  const viewItem = (taskId: string) => {
    history.push('/personal/addTask?taskId=' + taskId);
  };
  // 导出任务详情数据
  const exportData = async (task: TaskProps) => {
    setLoading(true);
    const { data } = await requestExportTransferWechatTask({ taskId: task.taskId });
    setLoading(false);
    const fileName = task.taskName + moment().format('YYYY-MM-DD');
    exportFile(data, fileName);
  };

  // 查询 新增任务按钮状态
  const getCreateBtnStatus = async () => {
    const res = await requestGetCreateButtonStatus();
    if (res) {
      setBtnDisabled(!!res.status);
    }
  };

  const myColumns = columns({ operateItem, viewItem, exportData });

  const onPaginationChange = (pageNum: number, pageSize?: number) => {
    setPagination((pagination) => ({ ...pagination, current: pageNum, pageSize }));
    getTaskList({ pageNum, pageSize, ...searchParam });
  };

  // 点击创建任务
  const clickCreateTask = () => {
    if (btnDisabled) return message.info('联系迁移前机构的企微管理员，配置出单宝A端的可见范围');
    history.push('/personal/addTask');
  };

  useEffect(() => {
    getCreateBtnStatus();
    getTaskList();
  }, []);
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
      <AuthBtn path="/query">
        <Form form={form} className={styles.form} onFinish={onFinish} onReset={onResetHandle} layout="inline">
          <Item label="任务名称" name="taskName">
            <Input className={styles.input} />
          </Item>
          <Button className={styles.searchBtn} htmlType="submit" type="primary">
            查询
          </Button>
          <Button className={styles.resetBtn} htmlType="reset">
            重置
          </Button>
        </Form>
      </AuthBtn>

      <NgTable
        loading={loading}
        pagination={pagination}
        columns={myColumns}
        dataSource={tableSource}
        rowKey={(scope) => scope.taskId}
        paginationChange={onPaginationChange}
      />
    </div>
  );
};

export default EnterPriseWechatList;
