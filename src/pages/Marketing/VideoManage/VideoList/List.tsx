import { PlusOutlined } from '@ant-design/icons';
import { Button, PaginationProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { NgFormSearch, NgTable } from 'src/components';
import { searchCols, tableColumnsFun } from './Config';

const VideoList: React.FC<RouteComponentProps> = ({ history }) => {
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 3,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });
  const [dataSource] = useState([
    {
      key1: 'V00001',
      key2: '《时间的托付》',
      key3: 1,
      key4: '诺稻科技',
      key5: '贾璇',
      key6: '2022-08-11 12:11:12',
      desc: '抗疫MV，文化'
    },
    {
      key1: 'V00002',
      key2: '《送教上门》',
      key3: 2,
      key4: '诺稻科技',
      key5: '贾璇',
      key6: '2022-07-30 14:00:00',
      desc: '国寿财深圳，管培生计划'
    },
    {
      key1: 'V00003',
      key2: '《要投就投中国人寿》',
      key3: 1,
      key4: '诺稻科技',
      desc: '姚明，CBA',
      key5: '贾璇',
      key6: '2022-07-29 10:10:45'
    }
  ]);
  const onSearch = () => {
    console.log('search');
  };
  useEffect(() => {
    setPagination((pagination) => ({ ...pagination, total: 3 }));
  }, []);

  const addVideo = () => {
    history.push('/marketingVideo/edit');
  };
  return (
    <div className="container">
      <Button className="mt10 mb20" type="primary" icon={<PlusOutlined />} shape="round" onClick={addVideo}>
        上传视频
      </Button>
      <NgFormSearch firstRowChildCount={3} searchCols={searchCols} onSearch={onSearch} />
      <NgTable columns={tableColumnsFun()} dataSource={dataSource} pagination={pagination} />
    </div>
  );
};

export default VideoList;
