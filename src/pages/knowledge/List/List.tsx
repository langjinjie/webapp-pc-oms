import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Input, message, Row, Space, Tree } from 'antd';
import { PaginationProps } from 'antd/es/pagination';
import { Moment } from 'moment';
import React, { Key, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  createCategory,
  deleteChange,
  getCategoryList,
  getWikiList,
  offlineChange,
  onlineChange
} from 'src/apis/knowledge';
import { NgFormSearch, NgModal, NgTable } from 'src/components';
import { OperateType } from 'src/utils/interface';
import { Icon } from 'tenacity-ui';
import { searchColsFun, tableColumnsFun, WikiColumn } from './config';
import style from './style.module.less';

interface ICategory {
  categroyId: string;
  lastLevel: number;
  level: number;
  name: string;
  key: Key;
  children: ICategory[];
}
const KnowledgeList: React.FC<RouteComponentProps> = ({ history }) => {
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });
  const [visible, setVisible] = useState(false);
  const [expandIds, setExpandIds] = useState<Key[]>([]);
  const [dataSource, setDataSource] = useState<WikiColumn[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [currentNode, setCurrentNode] = useState<ICategory | undefined>();
  const [inputValue, setInputValue] = useState('');

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

  const getCategories = async () => {
    const res = await getCategoryList({});
    console.log(res);
    if (res) {
      setCategories(res.list || []);
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
    getCategories();
  }, []);

  const createWiki = () => {
    history.push('/knowledge/edit');
  };

  const addCategory = async () => {
    // const res = await createCategory({
    //   parentId: '',
    //   name: '一级分类3'
    // });
    setVisible(true);
  };

  const confirmAddCategory = async () => {
    const res = await createCategory({
      parentId: '',
      name: inputValue
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

  /**
   * @description 异步加载分类数据
   */
  const onLoadData = async ({ key, children }: any): Promise<void> => {
    if (!children || children?.length === 0) {
      const res: any = await getCategoryList({ parentId: key });
      if (res) {
        // setCategories((data) => updateData(data, key, res));
        console.log(res);
        setCategories(res);
      }
    }
  };

  return (
    <div className="container">
      <Row>
        <Col span={4}>
          <div className="flex">
            <Input className="cell"></Input>
            <div className="flex fixed">
              <Button onClick={addCategory} icon={<PlusOutlined />}></Button>
            </div>

            <Tree
              className={style.treeWrap}
              fieldNames={{ title: 'name', key: 'categroyId' }}
              blockNode
              expandedKeys={expandIds}
              onExpand={(keys) => setExpandIds(keys)}
              treeData={categories}
              loadData={onLoadData}
              titleRender={(node) => (
                <div className={style.nodeItem}>
                  {node.name}
                  {
                    <Icon
                      className={style.dotIcon}
                      name="diandian"
                      onClick={(e) => {
                        e.stopPropagation();
                        // handlePosition(e.clientX, e.clientY);
                        // setShowDepart(true);
                        setCurrentNode(node);
                      }}
                    />
                  }
                </div>
              )}
              selectedKeys={[currentNode?.categroyId || '']}
              onSelect={(selectedKeys, { selectedNodes }) => {
                if (selectedNodes.length > 0) {
                  setCurrentNode(selectedNodes[0]);
                }
              }}
            />
          </div>
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

      <NgModal
        title="添加一级目录"
        width={400}
        visible={visible}
        onOk={confirmAddCategory}
        onCancel={() => setVisible(false)}
      >
        <div className="ml40 mr40 mb40">
          <Input placeholder="请输入目录名" value={inputValue} onChange={(e) => setInputValue(e.target.value)}></Input>
        </div>
      </NgModal>
    </div>
  );
};

export default KnowledgeList;
