import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { getSqlConfigList } from 'src/apis/dashboard';
import { NgFormSearch } from 'src/components';
import NewTableComponent, { MyPaginationProps } from 'src/components/TableComponent/NewTableComponent';
import { OperateType } from 'src/utils/interface';
import { FetchDataRecordType, searchCols, TableColumnFun } from './Config';

const FetchData: React.FC<RouteComponentProps> = ({ history }) => {
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState<MyPaginationProps>({
    pageNum: 1,
    total: 0
  });
  const onSearch = (values: any) => {
    console.log(values);
  };

  console.log();
  const getList = async () => {
    const res = await getSqlConfigList({
      pageNum: 1,
      pageSize: 10
    });
    if (res) {
      setDataSource(res.list);
      setPagination(pagination);
    }
    console.log(res);
  };
  useEffect(() => {
    getList();
  }, []);
  const onAdd = () => {
    history.push('/fetchData/add');
  };

  const onOperate = (type: OperateType, record: FetchDataRecordType) => {
    switch (type) {
      case 'edit':
        history.push('/fetchData/add?id=' + record.sqlId);
    }
  };
  return (
    <div className="container">
      <Button
        type="primary"
        shape="round"
        icon={<PlusOutlined />}
        onClick={() => {
          onAdd();
        }}
        size="large"
      >
        创建模板
      </Button>
      <NgFormSearch className="mt30" onSearch={onSearch} searchCols={searchCols} />
      <NewTableComponent
        className="mt20"
        dataSource={dataSource}
        pagination={pagination}
        rowKey={'sqlId'}
        columns={TableColumnFun(onOperate)}
      />
    </div>
  );
};

export default FetchData;
