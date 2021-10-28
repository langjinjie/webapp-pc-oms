/**
 * @name StationConfig
 * @author Lester
 * @date 2021-05-22 16:03
 */

import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Table, Button, Card, TableColumnType, PaginationProps } from 'antd';
import { useDidRecover } from 'react-router-cache-route';
import moment from 'moment';
import qs from 'qs';
import { setTitle } from 'lester-tools';
import { Icon } from 'src/components';
import { queryStationList } from 'src/apis/stationConfig';
import style from './style.module.less';

interface StationItem {
  settingId: string;
  settingName: string;
  createTime: string;
  opStaffName: string;
  isOwner: string;
}

const StationConfig: React.FC<RouteComponentProps> = ({ history }) => {
  const [list, setList] = useState<StationItem[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total: number) => `共 ${total} 条`
  });

  /**
   * 操作处理
   * @param settingId
   * @param type 0-修改 1-查看
   */
  const operateHandle = (settingId: number | null, type: number) => {
    history.push(`/station/add?${qs.stringify({ settingId, type })}`);
  };

  /**
   * 获取小站配置列表
   * @param param
   */
  const getStationList = async (param?: Object) => {
    const params: any = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...param
    };
    const res: any = await queryStationList(params);
    if (res) {
      console.log(res);
      const { total, list } = res;
      setList(list || []);
      setPagination({
        ...pagination,
        current: params.pageNum,
        pageSize: params.pageSize,
        total
      });
    }
  };

  /**
   * 分页参数改变
   * @param pageNum
   * @param pageSize
   */
  const pageChange = (pageNum: number, pageSize?: number) => {
    console.log(pageNum, pageSize);
    getStationList({
      pageNum,
      pageSize
    });
  };

  const columns: TableColumnType<StationItem>[] = [
    {
      title: '名称',
      dataIndex: 'settingName'
    },
    {
      title: '创建者',
      dataIndex: 'opStaffName'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (text: string) => moment(text).format('YYYY-MM-DD MM:HH')
    },
    {
      title: '操作',
      dataIndex: 'settingId',
      render: (text: number, record: StationItem) => (
        <>
          <Button type="link" onClick={() => operateHandle(text, 1)}>
            查看
          </Button>
          <Button
            type="link"
            title={record.isOwner === '0' ? '非创建者不可编辑' : ''}
            disabled={record.isOwner === '0'}
            onClick={() => operateHandle(text, 0)}
          >
            编辑
          </Button>
        </>
      )
    }
  ];

  useDidRecover(() => {
    console.log('didRecover');
    getStationList();
  });

  useEffect(() => {
    getStationList();
    setTitle('小站配置');
  }, []);

  return (
    <Card className={style.wrap} title="小站配置" bordered={false}>
      <div className={style.addBtn} onClick={() => operateHandle(null, 0)}>
        <Icon className={style.addIcon} name="xinjian" />
        添加
      </div>
      <Table
        rowKey="settingId"
        dataSource={list}
        columns={columns}
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

export default StationConfig;
