/**
 * @name NoticeList
 * @author Lester
 * @date 2021-12-07 16:51
 */
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Card, message, Modal, PaginationProps, Table, TableColumnType } from 'antd';
import { setTitle } from 'lester-tools';
import classNames from 'classnames';
import qs from 'qs';
import { Form, Icon } from 'src/components';
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
  noticeTitle: string;
  status: number;
  sendTime: string;
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
      name: 'noticeTitle',
      label: '标题',
      type: 'input'
    },
    {
      name: 'status',
      label: '状态',
      type: 'select',
      dataSource: [
        {
          id: '1',
          name: '待生效'
        },
        {
          id: '2',
          name: '生效中'
        },
        {
          id: '3',
          name: '已生效'
        }
      ]
    },
    {
      name: 'sendTime',
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
    history.push(`/notice/edit?${qs.stringify({ noticeId, type })}`);
  };

  /**
   * 删除公告
   * @param noticeId
   */
  const deleteNotice = (noticeId: string) => {
    confirm({
      title: '提示',
      content: '确定要删除？',
      async onOk () {
        const res: any = await delNotice({ noticeId });
        if (res) {
          message.success('删除成功!');
          getNoticeList();
        }
      }
    });
  };

  const columns: TableColumnType<NoticeItem>[] = [
    {
      title: '标题',
      dataIndex: 'noticeTitle'
    },
    {
      title: '状态',
      dataIndex: 'paperStatus',
      render: (text: number) => (
        <div>
          <span
            className={classNames(style.circle, {
              [style.active]: text === 2
            })}
          />
          {['待生效', '生效中', '已失效'][text - 1]}
        </div>
      )
    },
    {
      title: '生效时间',
      dataIndex: 'sendTime'
    },
    {
      title: '操作',
      dataIndex: 'noticeId',
      render: (text: string, record: NoticeItem) => (
        <>
          {record.status === 1 && (
            <Button type="link" onClick={() => operateHandle(text, 0)}>
              编辑
            </Button>
          )}
          {record.status === 2 && (
            <Button type="link" onClick={() => deleteNotice(text)}>
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
    getNoticeList({
      pageNum,
      pageSize
    });
  };

  const onSubmit = (values: any) => {
    const { sendTime, status, title } = values;
    const params: any = {
      title,
      status,
      pageNum: 1
    };
    if (sendTime && sendTime.length > 0) {
      params.startTime = sendTime[0].startOf('day').format('YYYY-MM-DD HH:mm:ss');
      params.endTime = sendTime[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');
    }
    setSearchParam(values);
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
        rowKey="paperId"
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
