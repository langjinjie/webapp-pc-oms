/**
 * @name NoticeList
 * @author Lester
 * @date 2021-12-07 16:51
 */
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Card, message, Modal, PaginationProps, Table, TableColumnType } from 'antd';
import { setTitle } from 'lester-tools';
import { Icon } from 'lester-ui';
import classNames from 'classnames';
import { Form } from 'src/components';
import { ItemProps } from 'src/utils/interface';
import { delNotice, queryNoticeList } from 'src/apis/notice';
import style from './style.module.less';

interface SearchParam {
  startTime?: string;
  endTime?: string;
  status?: string;
}

interface NoticeItem {
  noticeId: string;
  title: string;
  status: number;
  startTime: string;
  endTime: string;
}

const { confirm } = Modal;

const NoticeList: React.FC<RouteComponentProps> = ({ history }) => {
  const [noticeList, setNoticeList] = useState<NoticeItem[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total: number) => `共 ${total} 条`
  });
  const [searchParam, setSearchParam] = useState<SearchParam>({});

  const formItemData: ItemProps[] = [
    {
      name: 'title',
      label: '标题',
      type: 'input'
    },
    {
      name: 'status',
      label: '状态',
      type: 'select',
      dataSource: [
        {
          id: '2',
          name: '待生效'
        },
        {
          id: '1',
          name: '生效中'
        },
        {
          id: '3',
          name: '已失效'
        }
      ]
    },
    {
      name: 'time',
      label: '生效时间',
      type: 'rangePicker'
    }
  ];

  /**
   * 获取周报列表数据
   * @param param
   * @param isSearch
   */
  const getNoticeList = async (param?: any, isSearch?: boolean) => {
    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...(isSearch ? {} : searchParam),
      ...param
    };
    const res: any = await queryNoticeList(params);
    if (res) {
      const { list, total } = res;
      setNoticeList(list || []);
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
   * @param noticeId
   * @param type 0-修改 1-查看
   */
  const operateHandle = (noticeId: string, type: number) => {
    history.push('/notice/edit', { noticeId, type });
  };

  /**
   * 删除公告
   * @param noticeId
   * @param opStatus 操作类型 1停止 9删除
   */
  const deleteNotice = (noticeId: string, opStatus: number) => {
    const text = opStatus === 1 ? '停止' : '删除';
    confirm({
      title: '提示',
      content: `确定要${text}？`,
      async onOk () {
        const res: any = await delNotice({ noticeId, opStatus });
        if (res) {
          message.success(`${text}成功!`);
          getNoticeList();
        }
      }
    });
  };

  const columns: TableColumnType<NoticeItem>[] = [
    {
      title: '标题',
      dataIndex: 'title'
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text: number) => (
        <div>
          <span
            className={classNames(style.circle, {
              [style.active]: text === 1
            })}
          />
          {['生效中', '待生效', '已失效'][text - 1]}
        </div>
      )
    },
    {
      title: '生效时间',
      render: (_, item) => `${item.startTime} ${item.endTime}`
    },
    {
      title: '操作',
      dataIndex: 'noticeId',
      render: (text: string, record: NoticeItem) => (
        <>
          {record.status === 1 && (
            <Button type="link" onClick={() => deleteNotice(text, 1)}>
              停止
            </Button>
          )}
          {record.status === 2 && (
            <>
              <Button type="link" onClick={() => operateHandle(text, 0)}>
                编辑
              </Button>
              <Button type="link" onClick={() => deleteNotice(text, 9)}>
                删除
              </Button>
            </>
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
    getNoticeList({
      pageNum,
      pageSize
    });
  };

  const onSubmit = (values: any) => {
    const { time, status, title } = values;
    const params: any = {
      title,
      status,
      pageNum: 1
    };
    if (time && time.length > 0) {
      params.startTime = time[0].startOf('day').format('YYYY-MM-DD HH:mm:ss');
      params.endTime = time[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');
    }
    setSearchParam({
      ...params,
      pageNum: pagination.current
    });
    getNoticeList(params, true);
  };

  useEffect(() => {
    setTitle('公告配置');
    getNoticeList();
  }, []);

  return (
    <Card className={style.listWrap} title="公告配置">
      <div className={style.addBtn} onClick={() => operateHandle('', 0)}>
        <Icon className={style.addIcon} name="xinjian" />
        添加
      </div>
      <Form itemData={formItemData} onSubmit={onSubmit} />
      <Table
        style={{ marginTop: 20 }}
        rowKey="noticeId"
        columns={columns}
        dataSource={noticeList}
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

export default NoticeList;
