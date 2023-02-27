import { PaginationProps } from 'antd/es/pagination';
import { Moment } from 'moment';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { getApplyList } from 'src/apis/knowledge';
import { NgFormSearch, NgTable } from 'src/components';
import { searchColsFun, tableColumnsFun, WikiColumn } from './config';

const KnowledgeApplyList: React.FC<RouteComponentProps> = ({ history }) => {
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });
  const [dataSource, setDataSource] = useState<WikiColumn[]>([]);
  const [queryParams, setQueryParams] = useState<any>({});

  const getList = async (params?: any) => {
    const pageNum = params?.pageNum || pagination.current;
    const pageSize = params?.pageSize || pagination.pageSize;
    const res = await getApplyList({
      ...queryParams,
      ...params,
      pageNum,
      pageSize
    });
    if (res) {
      const { total, list } = res;
      setDataSource(list);
      setPagination((pagination) => ({ ...pagination, total, current: pageNum, pageSize }));
    }
  };
  const onSearch = (values: any) => {
    const { createTime, ...otherValues } = values;
    let createTimeBegin;
    let createTimeEnd;

    if (createTime) {
      createTimeBegin = (createTime as [Moment, Moment])[0].startOf('day').format('YYYY-MM-DD HH:mm:ss');
      createTimeEnd = (createTime as [Moment, Moment])[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');
    }
    setQueryParams({ createTimeBegin, createTimeEnd, ...otherValues });
    getList({ createTimeBegin, createTimeEnd, ...otherValues, pageNum: 1 });
  };

  const onValuesChange = (values: any) => {
    const { createTime, ...otherValues } = values;
    let createTimeBegin;
    let createTimeEnd;

    if (createTime) {
      createTimeBegin = (createTime as [Moment, Moment])[0].startOf('day').format('YYYY-MM-DD HH:mm:ss');
      createTimeEnd = (createTime as [Moment, Moment])[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');
    }
    setQueryParams({ createTimeBegin, createTimeEnd, ...otherValues });
  };

  useEffect(() => {
    getList();
  }, []);

  const onOperation = (record: WikiColumn) => {
    // 执行上架操作
    history.push('/knowledge/apply/detail?id=' + record.approvalNo);
  };

  return (
    <div className="container">
      <NgFormSearch
        searchCols={searchColsFun()}
        isInline={false}
        onValuesChange={(_, values) => onValuesChange(values)}
        firstRowChildCount={3}
        onSearch={onSearch}
      />

      <NgTable
        rowKey={'wikiId'}
        columns={tableColumnsFun(onOperation)}
        dataSource={dataSource}
        pagination={pagination}
        paginationChange={(pageNum, pageSize) => {
          getList({ pageNum, pageSize });
        }}
      ></NgTable>
    </div>
  );
};

export default KnowledgeApplyList;
