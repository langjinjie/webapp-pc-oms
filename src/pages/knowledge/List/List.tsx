import { Button, Col, Input, message, Row, Space } from 'antd';
import { PaginationProps } from 'antd/es/pagination';
import { Moment } from 'moment';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { createCategory, deleteChange, getWikiList, offlineChange, onlineChange } from 'src/apis/knowledge';
import { NgFormSearch, NgTable } from 'src/components';
import { OperateType } from 'src/utils/interface';
import { searchColsFun, tableColumnsFun, WikiColumn } from './config';

const KnowledgeList: React.FC<RouteComponentProps> = ({ history }) => {
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });
  const [dataSource, setDataSource] = useState<WikiColumn[]>([]);

  const getList = async (params?: any) => {
    const pageNum = params?.pageNum || pagination.current;
    const pageSize = params?.pageSize || pagination.pageSize;
    const res = await getWikiList({
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
    const { updateTime, createTime, ...otherValues } = values;
    let createTimeBegin;
    let createTimeEnd;
    let updateTimeBegin;
    let updateTimeEnd;
    if (createTime) {
      createTimeBegin = (updateTime as [Moment, Moment])[0].startOf('day').format('YYYY-MM-DD HH:mm:ss');
      createTimeEnd = (updateTime as [Moment, Moment])[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');
    }
    if (updateTime) {
      updateTimeBegin = (updateTime as [Moment, Moment])[0].startOf('day').format('YYYY-MM-DD HH:mm:ss');
      updateTimeEnd = (updateTime as [Moment, Moment])[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');
    }
    getList({ createTimeBegin, createTimeEnd, updateTimeBegin, updateTimeEnd, ...otherValues });
  };

  useEffect(() => {
    getList();
  }, []);

  const createWiki = () => {
    history.push('/knowledge/edit');
  };

  const addCategory = async () => {
    const res = await createCategory({
      parentId: '',
      name: '一级分类3'
    });
    console.log(res);
  };

  // 上架/批量上架
  const putAway = async (data: any) => {
    const res = await onlineChange(data);
    if (res) {
      message.success('上架成功');
    }
    getList({ pageNum: 1 });
  };

  const offline = async (data: any) => {
    const res = await offlineChange(data);
    if (res) {
      message.success('下架成功');
    }
    getList({ pageNum: 1 });
  };
  const deleleWiki = async (data: any) => {
    const res = await deleteChange(data);
    if (res) {
      message.success('删除成功');
    }
    getList({ pageNum: 1 });
  };

  const onOperation = (type: OperateType, record: WikiColumn) => {
    // 执行上架操作
    const list = [{ wikiId: record.wikiId }];
    if (type === 'putAway') {
      putAway({ list });
    } else if (type === 'outline') {
      // 执行下架操作
      offline({ list });
    } else if (type === 'delete') {
      deleleWiki({ list });
    }
  };

  return (
    <div className="container">
      <Row>
        <Col span={4}>
          <Input></Input>
          <Button onClick={addCategory}>添加一级分类</Button>
        </Col>
        <Col span={20}>
          <NgFormSearch searchCols={searchColsFun()} onSearch={onSearch} />

          <Button type="primary" shape="round" className="mt20 mb20" onClick={createWiki}>
            新建知识内容
          </Button>

          <NgTable
            rowKey={'wikiId'}
            columns={tableColumnsFun(onOperation)}
            dataSource={dataSource}
            pagination={pagination}
          ></NgTable>

          {dataSource.length > 0 && (
            <div className={'operationWrap'}>
              <Space>
                <Button type="primary" shape={'round'} ghost disabled={false} onClick={() => console.log('add new ')}>
                  批量上架
                </Button>
                <Button type="primary" shape={'round'} ghost disabled={false} onClick={() => console.log('add new ')}>
                  批量下架
                </Button>
                <Button type="primary" shape={'round'} ghost disabled={false} onClick={() => console.log('add new ')}>
                  批量删除
                </Button>
              </Space>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default KnowledgeList;
