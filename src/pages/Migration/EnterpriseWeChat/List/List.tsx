import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';

import styles from './style.module.less';
import { Button, PaginationProps } from 'antd';
import PieChart from './PieChart';
import { Icon, NgTable } from 'src/components';
import { columns } from './Config';
import { useDocumentTitle } from 'src/utils/base';
import EmptyTask from '../components/EmptyTask/EmptyTask';
import DetailModal from '../components/DetailModal/DetailModal';
import { queryTransferCorp } from 'src/apis/migration';

const EnterPriseWechatList: React.FC = () => {
  useDocumentTitle('好友迁移-企微好友');
  const [isEmpty, setIsEmpty] = useState(false);
  const [visibleDetail, setVisibleDetail] = useState(false);
  const [transferInfo, setTransferInfo] = useState({
    corpId: '',
    corpName: '年高-深圳分部',
    targetCorpId: '',
    targetCorpName: '年高总部'
  });
  const history = useHistory();

  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [tableSource] = useState([{}]);
  const handleEdit = () => {
    console.log('edit');
    setPagination((pagination) => ({ ...pagination }));
  };
  const deleteItem = () => {
    console.log('edit');
  };
  const viewItem = () => {
    console.log('edit');
    setVisibleDetail(true);
  };
  const changeItemStatus = () => {
    console.log('edit');
  };
  useEffect(() => {
    setLoading(false);
  }, []);

  const getPieInfo = () => {
    console.log('获取饼图信息');
  };

  const getTaskList = () => {
    console.log('查询列表');
  };

  const getTransferInfo = async () => {
    const res = await queryTransferCorp();
    if (res) {
      setTransferInfo(res);
      getPieInfo();
      getTaskList();
    } else {
      setIsEmpty(false);
    }
  };

  useEffect(() => {
    getTransferInfo();
  }, []);

  // 创建任务成功
  const createdTaskSuccess = async () => {
    // 查询迁移机构信息
    console.log('aas');
    const transferInfo = await queryTransferCorp();
    console.log(transferInfo);
  };

  const myColumns = columns({ handleEdit, deleteItem, viewItem, changeItemStatus });
  return (
    <div className={classNames(styles.migration, 'container')}>
      {isEmpty
        ? (
        <EmptyTask createdSuccess={createdTaskSuccess} />
          )
        : (
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
                <Button type="default" size="large" shape="round" className={styles.btnViewRange}>
                  查看可见范围
                </Button>
              </div>

              <div className={classNames(styles.kanbanRight, 'flex cell')}>
                <PieChart></PieChart>
                <div className={classNames(styles.pieInfo, 'flex cell vertical justify-between')}>
                  <div className={classNames(styles.pieData, 'flex')}>
                    <div>
                      <div className={styles.pieBar}>
                        <i className={classNames(styles.pieTag, styles.pieTag_success)}></i>
                        <span className="font12 color-text-regular">迁移成功</span>
                      </div>
                      <div className="mt10 font16">550（55.0%）</div>
                    </div>
                    <div className="ml50">
                      <div className={styles.pieBar}>
                        <i className={classNames(styles.pieTag, styles.pieTag_wait)}></i>
                        <span className="font12 color-text-regular">待迁移</span>
                      </div>
                      <div className="mt10 font16">550（55.0%）</div>
                    </div>
                  </div>
                  <div className="mt6 font12 color-text-placeholder">饼状图数据更新于 2022-03-12 17:29:17</div>
                </div>
              </div>
            </section>
          </header>

          <div className={classNames(styles.addTask, 'flex align-center')}>
            <Button type="primary" shape="round" size="large" onClick={() => history.push('/enterprise/addTask')}>
              创建群发任务
            </Button>
            <div className="ml30 color-text-placeholder">
              温馨提示：同一个企业每个自然月内，可对同一个客户/客户群发送4条消息，超过上限，客户当月将无法再收到群发消息。
            </div>
          </div>

          <NgTable loading={loading} pagination={pagination} columns={myColumns} dataSource={tableSource} />
        </div>
          )}

      <DetailModal visible={visibleDetail} onClose={() => setVisibleDetail(false)}></DetailModal>
    </div>
  );
};

export default EnterPriseWechatList;
