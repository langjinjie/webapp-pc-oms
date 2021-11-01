/**
 * @name StationConfig
 * @author Lester
 * @date 2021-05-22 16:03
 */

import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Table, Button, Card, TableColumnType, PaginationProps } from 'antd';
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

/* interface QueryParam {
  startTime?: number;
  endTime?: number;
} */

/* const { Item, useForm } = Form;
const { RangePicker } = DatePicker; */

const StationConfig: React.FC<RouteComponentProps> = ({ history }) => {
  const [list, setList] = useState<StationItem[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total: number) => `共 ${total} 条`
  });
  // const [queryParam, setQueryParam] = useState<QueryParam>({});

  // const [form] = useForm();

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
      // ...queryParam,
      ...param
    };
    const res: any = await queryStationList(params);
    if (res) {
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
      render: (text: number) => (
        <>
          <Button type="link" onClick={() => operateHandle(text, 1)}>
            查看
          </Button>
          <Button type="link" onClick={() => operateHandle(text, 0)}>
            编辑
          </Button>
        </>
      )
    }
  ];

  /* const onsubmit = (values: any) => {
    console.log(values);
    const { onlineTime } = values;
    if (onlineTime && onlineTime.length > 1) {
      console.log(onlineTime);
      const param = {
        startTime: onlineTime[0].startOf('day').valueOf(),
        endTime: onlineTime[1].endOf('day').valueOf()
      };
      setQueryParam({ ...param });
      getStationList({
        pageNum: 1,
        ...param
      });
    } else {
      setQueryParam({});
      getStationList({ pageNum: 1 });
    }
  }; */

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
      {/* <Form className={style.formWrap} form={form} layout="inline" onFinish={onsubmit} onReset={() => onsubmit({})}>
        <Item label="上架时间" name="onlineTime">
          <RangePicker />
        </Item>
        <Item>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button htmlType="reset">重置</Button>
        </Item>
      </Form> */}
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
