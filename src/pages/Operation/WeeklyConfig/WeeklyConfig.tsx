/**
 * @name WeeklyConfig
 * @author Lester
 * @date 2021-11-05 14:00
 */
import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Card, Table, PaginationProps, TableColumnType, Button, Modal, message } from 'antd';
import qs from 'qs';
import classNames from 'classnames';
import { setTitle } from 'lester-tools';
import { Form, Icon } from 'src/components';
import { ItemProps } from 'src/utils/interface';
import { queryWeeklyList, publishConfig, deleteConfig } from 'src/apis/weekly';
import style from './style.module.less';

interface SearchParam {
  startTime?: string;
  endTime?: string;
  status?: string;
}

interface WeeklyItem {
  paperId: string;
  paperTitle: string;
  paperStatus: number;
  sendTime: string;
}

const { confirm } = Modal;

const WeeklyConfig: React.FC<RouteComponentProps> = ({ history }) => {
  const [weeklyList, setWeeklyList] = useState<WeeklyItem[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total: number) => `共 ${total} 条`
  });
  const [searchParam, setSearchParam] = useState<SearchParam>({});

  const formItemData: ItemProps[] = [
    {
      name: 'sendTime',
      label: '发布时间',
      type: 'rangePicker'
    },
    {
      name: 'status',
      label: '发布状态',
      type: 'select',
      dataSource: [
        {
          id: '1',
          name: '未发布'
        },
        {
          id: '2',
          name: '已发布'
        }
      ]
    }
  ];

  /**
   * 获取周报列表数据
   * @param param
   * @param isSearch
   */
  const getWeeklyList = async (param?: any, isSearch?: boolean) => {
    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...(isSearch ? {} : searchParam),
      ...param
    };
    const res: any = await queryWeeklyList(params);
    if (res) {
      const { list, total } = res;
      setWeeklyList(list || []);
      setPagination({
        ...pagination,
        current: params.pageNum,
        pageSize: params.pageSize,
        total
      });
    }
  };

  /**
   * 操作处理
   * @param paperId
   * @param type 0-修改 1-查看
   */
  const operateHandle = (paperId: string, type: number) => {
    history.push(`/weekly/add?${qs.stringify({ paperId, type })}`);
  };

  const deleteWeekly = (paperId: string) => {
    confirm({
      title: '提示',
      content: '确定要删除？',
      async onOk () {
        const res: any = await deleteConfig({ paperId });
        if (res) {
          message.success('删除成功!');
          getWeeklyList();
        }
      }
    });
  };

  /**
   * 发布周报
   * @param paperId
   */
  const publishWeekly = (paperId: string) => {
    confirm({
      title: '提示',
      content: '确定要发布？',
      async onOk () {
        const res: any = await publishConfig({ paperId, sendType: 1 });
        if (res) {
          message.success('发布成功!');
          setWeeklyList(
            weeklyList.map((item) => ({
              ...item,
              paperStatus: item.paperId === paperId ? 2 : item.paperStatus
            }))
          );
        }
      }
    });
  };

  const columns: TableColumnType<WeeklyItem>[] = [
    {
      title: '标题',
      dataIndex: 'paperTitle'
    },
    {
      title: '发布时间',
      dataIndex: 'sendTime'
    },
    {
      title: '发布状态',
      dataIndex: 'paperStatus',
      render: (text: number) => (
        <div>
          <span
            className={classNames(style.circle, {
              [style.active]: text === 2
            })}
          />
          {['未发布', '已发布'][text - 1]}
        </div>
      )
    },
    {
      title: '操作',
      dataIndex: 'paperId',
      render: (text: string, record: WeeklyItem) => (
        <>
          {record.paperStatus === 1 && (
            <>
              {!record.sendTime && (
                <Button type="link" onClick={() => publishWeekly(text)}>
                  发布
                </Button>
              )}
              <Button type="link" onClick={() => operateHandle(text, 0)}>
                编辑
              </Button>
            </>
          )}
          {record.paperStatus === 2 && (
            <Button type="link" onClick={() => deleteWeekly(text)}>
              删除
            </Button>
          )}
          <Button type="link" onClick={() => operateHandle(text, 1)}>
            查看
          </Button>
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
    getWeeklyList({
      pageNum,
      pageSize
    });
  };

  const onSubmit = (values: any) => {
    console.log(values);
    const { sendTime, status } = values;
    const params: any = {
      status,
      pageNum: 1
    };
    if (sendTime && sendTime.length > 0) {
      params.startTime = sendTime[0].startOf('day').format('YYYY-MM-DD HH:mm:ss');
      params.endTime = sendTime[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');
    }
    setSearchParam(values);
    getWeeklyList(params, true);
  };

  useEffect(() => {
    setTitle('周报列表');
    getWeeklyList();
  }, []);

  return (
    <Card className={style.wrap} title="周报列表">
      <div className={style.addBtn} onClick={() => operateHandle('', 0)}>
        <Icon className={style.addIcon} name="xinjian" />
        添加
      </div>
      <Form itemData={formItemData} onSubmit={onSubmit} />
      <Table
        style={{ marginTop: 20 }}
        rowKey="paperId"
        columns={columns}
        dataSource={weeklyList}
        pagination={{
          ...pagination,
          showQuickJumper: true,
          onChange: pageChange,
          onShowSizeChange: pageChange
        }}
      />
    </Card>
  );
};

export default WeeklyConfig;