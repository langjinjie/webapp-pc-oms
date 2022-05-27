/**
 * @name LotteryConfig
 * @author Lester
 * @date 2022-05-26 14:20
 */
import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Table, TableColumnType } from 'antd';
import { BreadCrumbs } from 'src/components';
import { queryActivityConfig } from 'src/apis/pointsMall';
import style from './style.module.less';

interface PrizeItem {
  goodsId: string;
  name: string;
  imgUrl: string;
  goodsType: number;
  totalStock: number;
  consumeStock: number;
  winWeight: number;
  exchangeDesc: string;
}

const LotteryConfig: React.FC<RouteComponentProps> = ({ history, location }) => {
  const [prizeList, setPrizeList] = useState<PrizeItem[]>([]);

  const columns: TableColumnType<PrizeItem>[] = [
    {
      title: '奖品序号',
      render: (_, r, index) => index + 1
    },
    {
      title: '奖品名称',
      dataIndex: 'name'
    },
    {
      title: '奖品图片',
      dataIndex: 'imgUrl',
      render: (text: string) => <img style={{ width: 100 }} src={text} alt="" />
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
      render: (text: number) => <div>{text}</div>
    },
    {
      title: '生效时间',
      dataIndex: 'startTime'
    },
    {
      title: '操作',
      dataIndex: 'activityId',
      render: (text: string, record: PrizeItem) => (
        <Button type="link" onClick={() => history.push('/lotteryConfig/prize/add', { goodsId: record.goodsId })}>
          编辑
        </Button>
      )
    }
  ];

  const getActivityConfig = async () => {
    const { activityId }: any = location.state || {};
    const res: any = await queryActivityConfig({ activityId });
    if (res) {
      setPrizeList(res.list || []);
    }
  };

  useEffect(() => {
    getActivityConfig();
  }, []);

  return (
    <div className={style.lotteryConfig}>
      <BreadCrumbs navList={[{ name: '抽奖配置' }, { name: '奖品配置' }]} />
      <Table style={{ marginTop: 20 }} rowKey="goodsId" columns={columns} dataSource={prizeList} pagination={false} />
    </div>
  );
};

export default LotteryConfig;
