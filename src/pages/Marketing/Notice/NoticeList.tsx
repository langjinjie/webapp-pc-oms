/**
 * @name NoticeList
 * @author Lester
 * @date 2021-12-07 16:51
 */
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button as AntdBtn, Card, message, Modal, PaginationProps, Table, TableColumnType } from 'antd';
import { setTitle } from 'lester-tools';
import { Icon, Button } from 'lester-ui';
import classNames from 'classnames';
import { Form, AuthBtn } from 'src/components';
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
  const [noticeIds, setNoticeIds] = useState<string[]>([]);

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
   */
  const deleteNotice = () => {
    confirm({
      title: '提示',
      content: '确定要删除？',
      async onOk () {
        const res: any = await delNotice({ list: noticeIds });
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
      dataIndex: 'startTime'
    },
    {
      title: '操作',
      dataIndex: 'noticeId',
      render: (text: string, record: NoticeItem) => (
        <>
          {record.status === 2 && (
            <AuthBtn path="/edit">
              <AntdBtn type="link" onClick={() => operateHandle(text, 0)}>
                编辑
              </AntdBtn>
            </AuthBtn>
          )}
          <AuthBtn path="/view">
            <AntdBtn type="link" onClick={() => operateHandle(text, 1)}>
              查看
            </AntdBtn>
          </AuthBtn>
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

  const rowSelection = {
    type: 'checkbox',
    onChange: (selectedRowKeys: string[]) => {
      setNoticeIds(selectedRowKeys);
    }
  };

  useEffect(() => {
    setTitle('公告配置');
    getNoticeList();
  }, []);

  return (
    <Card className={style.listWrap} title="公告配置">
      <AuthBtn path="/add">
        <div className={style.addBtn} onClick={() => operateHandle('', 0)}>
          <Icon className={style.addIcon} name="xinjian" />
          添加
        </div>
      </AuthBtn>
      <AuthBtn path="/query">
        <Form itemData={formItemData} onSubmit={onSubmit} />
      </AuthBtn>
      <Table
        style={{ marginTop: 20 }}
        rowKey="noticeId"
        columns={columns}
        dataSource={noticeList}
        rowSelection={rowSelection}
        pagination={{
          ...pagination,
          showQuickJumper: true,
          onChange: pageChange,
          onShowSizeChange: pageChange
        }}
      />
      <AuthBtn path="/delete">
        <Button disabled={noticeIds.length === 0} onClick={() => deleteNotice()}>
          删除
        </Button>
      </AuthBtn>
    </Card>
  );
};

export default NoticeList;
