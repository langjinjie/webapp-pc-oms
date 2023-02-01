import { PaginationProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { NgFormSearch, NgTable } from 'src/components';
import { searchCols, TableColumnsFun } from './Config';

const CustomerList: React.FC = () => {
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 100,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });

  const [dataSource, setDataSource] = useState([
    {
      key1: '冯媛媛',
      key2: '马雪琴',
      url: require('src/assets/images/avater.jpg'),
      key3: '测试1组',
      key4: '微信',
      key5: '有车',
      key6: '2022-10-23 21:21:03'
    },
    {
      key1: '张明明',
      key2: '马雪琴',
      url: require('src/assets/images/avater.jpg'),
      key3: '测试1组',
      key4: '活动投放',
      key5: '客户忠诚度中，保障意识分低，双11线上活动',
      key6: '2022-11-23 09:21:45'
    },
    {
      key1: '李青阳',
      key2: '马雪琴',
      url: require('src/assets/images/avater.jpg'),
      key3: '测试1组',
      key4: '头条',
      key5: '保障意识分中',
      key6: '2022-11-21 19:01:23'
    },
    {
      key1: '王茜',
      key2: '孙广东',
      url: require('src/assets/images/avater.jpg'),
      key3: '测试1组',
      key4: '微信',
      key5: '客户忠诚度高',
      key6: '2022-06-03 10:20:00'
    },
    {
      key1: '苏晴',
      key2: '马雪琴',
      url: require('src/assets/images/avater.jpg'),
      key3: '测试1组',
      key4: '微信',
      key5: '保障意识分高',
      key6: '2022-08-12 11:31:32'
    },
    {
      key1: '郑乔雄',
      key2: '孙广东',
      url: require('src/assets/images/avater.jpg'),
      key3: '测试1组',
      key4: '线下渠道',
      key5: '客户忠诚度高，保障意识分高， 门店双11促销',
      key6: '2022-11-20 12:20:03'
    },
    {
      key1: '许名扬',
      key2: '孙广东',
      url: require('src/assets/images/avater.jpg'),
      key3: '测试1组',
      key4: '微信',
      key5: '保障意识分低',
      key6: '2022-11-20 13:22:41'
    },
    {
      key1: '张大勋',
      key2: '楚涵嫣',
      url: require('src/assets/images/avater.jpg'),
      key3: '测试1组',
      key4: '活动投放',
      key5: '保障意识分高，双11线上活动',
      key6: '2022-11-03 09:10:43'
    },
    {
      key1: '魏长山',
      key2: '孙广东',
      url: require('src/assets/images/avater.jpg'),
      key3: '测试1组',
      key4: '微信',
      key5: '客户忠诚度高，保障意识分高',
      key6: '2022-11-12 12:21:09'
    },
    {
      key1: '刘强西',
      key2: '楚涵嫣',
      url: require('src/assets/images/avater.jpg'),
      key3: '测试1组',
      key4: '微信',
      key5: '客户忠诚度高，保障意识分高',
      key6: '2022-11-13 21:01:25'
    },
    {
      key1: '冯媛媛',
      key2: '楚涵嫣',
      url: require('src/assets/images/avater.jpg'),
      key3: '测试1组',
      key4: '微信',
      key5: '客户忠诚度低，保障意识分中',
      key6: '2022-11-23 21:21:45'
    },
    {
      key1: '冯媛媛',
      key2: '楚涵嫣',
      url: require('src/assets/images/avater.jpg'),
      key3: '测试1组',
      key4: '微信',
      key5: '客户忠诚度低，保障意识分高',
      key6: '2022-11-24 19:13:12'
    },
    {
      key1: '冯媛媛',
      key2: '楚涵嫣',
      url: require('src/assets/images/avater.jpg'),
      key3: '测试1组',
      key4: '微信',
      key5: '客户忠诚度低，保障意识分中',
      key6: '2022-11-23 14:00:21'
    },
    {
      key1: '冯媛媛',
      key2: '楚涵嫣',
      url: require('src/assets/images/avater.jpg'),
      key3: '测试1组',
      key4: '微信',
      key5: '客户忠诚度高，保障意识分中',
      key6: '2022-11-23 14:20:21'
    },
    {
      key1: '冯媛媛',
      key2: '楚涵嫣',
      url: require('src/assets/images/avater.jpg'),
      key3: '测试1组',
      key4: '微信',
      key5: '客户忠诚度中，保障意识分中',
      key6: '2022-11-23 15:21:51'
    },
    {
      key1: '冯媛媛',
      key2: '楚涵嫣',
      url: require('src/assets/images/avater.jpg'),
      key3: '测试1组',
      key4: '微信',
      key5: '客户忠诚度低，保障意识分高',
      key6: '2022-11-23 16:51:39'
    },
    {
      key1: '冯媛媛',
      key2: '楚涵嫣',
      url: require('src/assets/images/avater.jpg'),
      key3: '测试1组',
      key4: '活动投放',
      key5: '客户忠诚度高，保障意识分低',
      key6: '2022-11-24 21:00:45'
    }
  ]);
  useEffect(() => {
    setDataSource(dataSource);
  }, []);
  const viewItem = (record: any) => {
    console.log(record);
  };
  const onSearch = (values: any) => {
    console.log(values);
  };

  const onPaginationChange = (pageNum: number, pageSize?: number) => {
    setPagination((pagination) => ({ ...pagination, current: pageNum, pageSize }));
  };

  return (
    <div className="container">
      <NgFormSearch searchCols={searchCols} onSearch={onSearch}></NgFormSearch>
      <NgTable
        dataSource={dataSource}
        columns={TableColumnsFun(viewItem)}
        pagination={pagination}
        paginationChange={onPaginationChange}
      ></NgTable>
    </div>
  );
};

export default CustomerList;
