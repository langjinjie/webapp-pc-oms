/**
 * @name ActivityList
 * @author Lester
 * @date 2022-05-26 14:21
 */
import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

import { RouteComponentProps } from 'react-router-dom';
import { Button, PaginationProps, Table, TableColumnType, Modal as AntdModal, message } from 'antd';
import { AuthBtn, Form } from 'src/components';
import { queryLotteryActivity, operateActivity, giveOutPrize } from 'src/apis/pointsMall';
import ActivityEdit from './ActivityEdit';
import style from './style.module.less';

interface SearchParam {
  activityName?: string;
}

export interface ActivityItem {
  activityId: string;
  activityName: string;
  startTime: string;
  endTime: string;
  dateCreated: string;
  createBy: string;
  status: number;
  sendStatus: number;
  sendTime: string;
  opName: string;
}

const ActivityList: React.FC<RouteComponentProps> = ({ history }) => {
  const [activityList, setActivityList] = useState<ActivityItem[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total: number) => `共 ${total} 条`
  });
  const [searchParam, setSearchParam] = useState<SearchParam>({});
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [editType, setEditType] = useState<number>(0);
  const [currentActivity, setCurrentActivity] = useState<ActivityItem | null>(null);

  enum statusArr {
    '未开始未上架' = 0,
    '未开始已上架',
    '已开始未上架',
    '进行中',
    '已结束'
  }

  const onEdit = (item: ActivityItem | null, type: number) => {
    setCurrentActivity(item);
    setEditType(type);
    setEditVisible(true);
  };

  /**
   * 获取活动列表
   * @param param
   */
  const getActivityList = async (param?: any) => {
    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...searchParam,
      ...param
    };
    const res: any = await queryLotteryActivity(params);
    if (res) {
      const { list, total } = res;
      setActivityList(list || []);
      setPagination({
        ...pagination,
        current: params.pageNum,
        pageSize: params.pageSize,
        total
      });
    }
  };

  const onOperate = (activityId: string) => {
    AntdModal.confirm({
      title: '提示',
      content: '是否确定上架活动，活动一经上架不可下架，上架前请核对奖品配置信息噢～。',
      icon: null,
      async onOk () {
        const res: any = await operateActivity({ activityId, type: 1 });
        if (res) {
          message.success('上架成功');
          getActivityList();
        }
      }
    });
  };

  const onGive = (activityId: string) => {
    AntdModal.confirm({
      title: '提示',
      content: '是否确定发放大奖',
      icon: null,
      async onOk () {
        const res: any = await giveOutPrize({ activityId });
        if (res) {
          message.success('发放成功');
          getActivityList();
        }
      }
    });
  };

  const columns: TableColumnType<ActivityItem>[] = [
    {
      title: '活动名称',
      dataIndex: 'activityName'
    },
    {
      title: '活动开始时间',
      dataIndex: 'startTime'
    },
    {
      title: '活动结束时间',
      dataIndex: 'endTime'
    },
    {
      title: '创建时间',
      dataIndex: 'dateCreated'
    },
    {
      title: '创建人',
      dataIndex: 'createBy',
      width: 100
    },
    {
      title: '大奖发放时间',
      dataIndex: 'sendTime'
    },
    {
      title: '大奖发放人',
      dataIndex: 'opName',
      width: 110
    },
    {
      title: '活动状态',
      dataIndex: 'status',
      render: (text: number) => (
        <div>
          <span
            className={classNames(style.circle, {
              [style.green]: text === 3,
              [style.grey]: text === 4
            })}
          />
          {statusArr[text]}
        </div>
      )
    },
    {
      title: '生效时间',
      dataIndex: 'startTime'
    },
    {
      title: '操作',
      dataIndex: 'activityId',
      width: 280,
      fixed: 'right',
      render: (text: string, record: ActivityItem) => (
        <>
          {[0, 1].includes(record.status) && (
            <AuthBtn path="/edit">
              <Button type="link" onClick={() => onEdit(record, 1)}>
                编辑
              </Button>
            </AuthBtn>
          )}
          {[0, 2].includes(record.status) && (
            <AuthBtn path="/operate">
              <Button type="link" onClick={() => onOperate(text)}>
                上架活动
              </Button>
            </AuthBtn>
          )}
          <AuthBtn path="/config">
            <Button type="link" onClick={() => history.push('/lotteryConfig/prize', { activityId: text })}>
              奖品配置
            </Button>
          </AuthBtn>
          {[3, 4].includes(record.status) && (
            <AuthBtn path="/winnerList">
              <Button type="link" onClick={() => history.push('/winManage?activityName=' + record.activityName)}>
                中奖名单
              </Button>
            </AuthBtn>
          )}
          {record.status === 3 && (
            <AuthBtn path="/givePrize">
              <Button type="link" disabled={record.sendStatus === 1} onClick={() => onGive(record.activityId)}>
                大奖发放
              </Button>
            </AuthBtn>
          )}
        </>
      )
    }
  ];

  /**
   * 分页参数改变
   * @param pageNum
   * @param pageSize
   */
  const pageChange = (pageNum: number, pageSize?: number) => {
    getActivityList({
      pageNum,
      pageSize
    });
  };

  const onSubmit = ({ activityName = '' }: any) => {
    const params: any = {
      activityName,
      pageNum: 1
    };
    getActivityList(params);
    setSearchParam({ activityName });
  };

  useEffect(() => {
    getActivityList();
  }, []);

  return (
    <div className={style.activityList}>
      <AuthBtn path="/add">
        <Button className={style.addBtn} type="primary" shape="round" onClick={() => onEdit(null, 0)}>
          创建抽奖活动
        </Button>
      </AuthBtn>
      <AuthBtn path="/query">
        <Form
          className={style.mb30}
          itemData={[{ name: 'activityName', label: '活动名称', type: 'input' }]}
          onSubmit={onSubmit}
        />
      </AuthBtn>
      <Table
        rowKey="activityId"
        scroll={{ x: 1200 }}
        columns={columns}
        dataSource={activityList}
        pagination={{
          ...pagination,
          showQuickJumper: true,
          onChange: pageChange,
          onShowSizeChange: pageChange
        }}
      />
      <ActivityEdit
        visible={editVisible}
        onClose={() => setEditVisible(false)}
        onOk={() => getActivityList({ pageNum: 1 })}
        type={editType}
        data={currentActivity}
      />
    </div>
  );
};

export default ActivityList;
