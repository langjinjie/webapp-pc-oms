import { Button, Col, Input, message, Row, Space, Tree } from 'antd';
import { PaginationProps } from 'antd/es/pagination';
import classNames from 'classnames';
import { Moment } from 'moment';
import React, { Key, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  createCategory,
  deleteChange,
  getCategoryList,
  getCategoryWithKeyword,
  getWikiList,
  offlineChange,
  onlineChange,
  readuitWiki,
  setScope
} from 'src/apis/knowledge';
import { Empty, NgFormSearch, NgModal, NgTable } from 'src/components';
import { SetUserRight } from 'src/pages/Marketing/Components/ModalSetUserRight/SetUserRight';
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
  isLeaf: boolean;
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
  const [selectedRows, setSelectedRows] = useState<WikiColumn[]>([]);
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const [expandIds, setExpandIds] = useState<Key[]>([]);
  const [dataSource, setDataSource] = useState<WikiColumn[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [currentNode, setCurrentNode] = useState<ICategory | undefined>();
  const [currentList, setCurrentList] = useState<WikiColumn[]>([]);
  const [operateType, setOperateType] = useState<OperateType>();
  const [inputValue, setInputValue] = useState('');
  const [addTitle, setAddTitle] = useState('添加一级分类');
  const [displayType, setDisplayType] = useState<number>(0);
  const [batchInfo, setBatchInfo] = useState({
    title: '',
    content: ''
  });
  const [searchList, setSearchList] = useState<ICategory[]>([]);
  const [isSearch, setIsSearch] = useState(true);
  const [currentWiki, setCurrentWiki] = useState<WikiColumn>();

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
    if (res) {
      setCategories([
        {
          categroyId: '',
          lastLevel: 1,
          level: 0,
          name: '所有分类',
          key: '1',
          isLeaf: true
        },
        ...(res.list.map((item: ICategory) => ({ ...item, isLeaf: item.lastLevel })) || [])
      ]);
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

  const addCategory = async (level: number, node?: ICategory) => {
    if (level === 2) {
      console.log(node);
      setAddTitle(`添加${node?.name}的二级目录`);
    } else {
      setAddTitle('添加一级目录');
    }
    setVisible(true);
  };

  const confirmAddCategory = async () => {
    const res = await createCategory({
      parentId: currentNode?.categroyId,
      name: inputValue
    });
    if (res) {
      message.success('添加目录成功');
      setVisible(false);
    }
  };

  // 上架/批量上架
  const putAway = async (data: any) => {
    const res = await onlineChange(data);
    if (res) {
      message.success('上架成功');
    }
    getList({ pageNum: 1 });
  };

  const filterSelectedRow = (type: OperateType) => {
    let count = 0;
    let currentList: WikiColumn[] = [];
    if (type === 'putAway') {
      currentList = selectedRows.filter((item) => item.auditStatus !== 0 && item.wikiStatus !== 1);
    } else if (type === 'outline') {
      currentList = selectedRows.filter(
        (item) => item.wikiStatus === 2 && item.auditStatus !== 0 && item.auditStatus !== 2
      );
    } else if (type === 'delete') {
      currentList = selectedRows.filter((item) => item.auditStatus !== 0 && item.wikiStatus === 3);
    }
    count = currentList.length;
    setCurrentList(currentList);
    return count;
  };

  const batchOperate = (type: OperateType) => {
    setOperateType(type);
    const count = filterSelectedRow(type);
    if (type === 'putAway') {
      if (count === 0) {
        message.warning('没有符合上架的内容');
      } else {
        setBatchInfo({
          title: '批量上架',
          content: `当前选中的满足上架的内容为${count}个`
        });
        setVisible2(true);
      }
    } else if (type === 'outline') {
      if (count === 0) {
        message.warning('没有符合下架的内容');
      } else {
        setBatchInfo({
          title: '批量下架',
          content: `当前选中的满足下架的内容为${count}个`
        });
        setVisible2(true);
      }
    } else if (type === 'delete') {
      if (count === 0) {
        message.warning('没有符合要删除的内容');
      } else {
        setBatchInfo({
          title: '批量删除',
          content: `当前选中的满足删除的内容为${count}个`
        });
        setVisible2(true);
      }
    }
  };

  const offline = async (data: any) => {
    const res = await offlineChange(data);
    if (res) {
      message.success('下架成功');
    }
    getList({ pageNum: 1 });
  };

  const deleteWiki = async (data: any) => {
    const res = await deleteChange(data);
    if (res) {
      message.success('删除成功');
    }
    getList({ pageNum: 1 });
  };

  const confirmBatchOperate = () => {
    console.log('a', currentList, operateType);
    const list = currentList.map((item) => ({ wikiId: item.wikiId }));
    if (operateType === 'putAway') {
      putAway({ list });
    } else if (operateType === 'outline') {
      offline({ list });
    } else if (operateType === 'delete') {
      deleteWiki({ list });
    }

    setVisible2(false);
  };

  // 重新发起发起申请
  const retryApply = async (wikiId: string) => {
    const res = await readuitWiki({ wikiId });
    if (res) {
      message.success('操作成功');
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
      deleteWiki({ list });
    } else if (type === 'edit') {
      history.push('/knowledge/edit?id=' + record.wikiId);
    } else if (type === 'view') {
      history.push('/knowledge/edit?id=' + record.wikiId + '&isView=1');
    } else if (type === 'other') {
      retryApply(record.wikiId);
    } else if (type === 'scope') {
      setVisible3(true);
      setCurrentWiki(record);
    }
  };

  /**
   * @description 异步加载分类数据
   */
  const onLoadData = async ({ key, children }: ICategory): Promise<void> => {
    if (!children || children?.length === 0) {
      const res: any = await getCategoryList({ parentId: key });
      if (res) {
        const { list } = res;
        const copyData = [...categories];
        copyData.map((item) => {
          if (item.categroyId === key) {
            item.children = list.map((child: ICategory) => ({ ...child, isLeaf: child.lastLevel }));
          }
          return item;
        });
        setCategories(copyData);
      }
    }
  };

  const onSearchCategory = async (value: string) => {
    setIsSearch(true);
    if (value) {
      setDisplayType(1);
      console.log('search', value);
      const res = await getCategoryWithKeyword({ name: value });
      setSearchList(res.list || []);
      setIsSearch(false);
    } else {
      setDisplayType(0);
    }
  };

  const getListWithCategory = (categoryId: string) => {
    console.log(categoryId);
    getList({
      categoryId: categoryId,
      pageNum: 1
    });
  };

  const confirmSetRight = async (values: any) => {
    setVisible3(false);
    const { isSet, groupId } = values;

    const res = await setScope({
      wikiId: currentWiki?.wikiId,
      groupId: isSet ? groupId : null
    });
    if (res) {
      message.success('设置成功');
      getList({ pageNum: 1 });
    }
  };
  return (
    <div className="container">
      <Row>
        <Col span={5}>
          <div className={style.leftWrap}>
            <div className={classNames(style.searchWrap, 'flex')}>
              <Input.Search
                placeholder="搜索分类"
                className={classNames('cell', style.inputWrap)}
                enterButton={<Icon className={style.searchIcon} name="icon_common_16_seach" />}
                onSearch={onSearchCategory}
              ></Input.Search>
              <div className="flex fixed" title="添加分类">
                <Icon className={style.addIcon} name="icon_daohang_28_jiahaoyou" onClick={() => addCategory(1)}></Icon>
              </div>
            </div>
            <div className={style.categoryWrap}>
              {displayType === 0 && (
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
                      {node.level === 1 && currentNode?.categroyId === node.categroyId && (
                        <Icon
                          name="icon_daohang_28_jiahaoyou"
                          className="mr5 f20 color-text-secondary"
                          onClick={() => addCategory(2, node)}
                        />
                      )}
                    </div>
                  )}
                  selectedKeys={[currentNode?.categroyId || '']}
                  onSelect={(selectedKeys, { selectedNodes }) => {
                    if (selectedNodes.length > 0) {
                      setCurrentNode(selectedNodes[0]);
                      getListWithCategory(selectedNodes[0].categroyId);
                    }
                  }}
                />
              )}
              <ul style={{ display: displayType === 1 ? 'block' : 'none' }} className={style.searchList}>
                {searchList.length === 0 && !isSearch && <Empty />}

                {searchList.map((item) => (
                  <li
                    key={item.categroyId}
                    className={classNames(style.searchItem, {
                      [style.active]: item.categroyId === currentNode?.categroyId
                    })}
                    onClick={() => {
                      getListWithCategory(item.categroyId);
                      setCurrentNode(item);
                    }}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Col>
        <Col span={19}>
          <NgFormSearch searchCols={searchColsFun()} onSearch={onSearch} />

          <Button type="primary" shape="round" className="mt20 mb20" onClick={createWiki}>
            新建知识内容
          </Button>

          <NgTable
            rowKey={'wikiId'}
            columns={tableColumnsFun(onOperation)}
            dataSource={dataSource}
            pagination={pagination}
            rowSelection={{
              onChange: (selectedRowKeys: React.Key[], selectedRows: WikiColumn[]) => {
                console.log(selectedRowKeys, selectedRows);
                setSelectedRows(selectedRows);
              }
            }}
          ></NgTable>

          {dataSource.length > 0 && (
            <div className={'operationWrap'}>
              <Space>
                <Button
                  type="primary"
                  shape={'round'}
                  ghost
                  disabled={selectedRows.length === 0}
                  onClick={() => batchOperate('putAway')}
                >
                  批量上架
                </Button>
                <Button
                  type="primary"
                  shape={'round'}
                  ghost
                  disabled={selectedRows.length === 0}
                  onClick={() => batchOperate('outline')}
                >
                  批量下架
                </Button>
                <Button
                  type="primary"
                  shape={'round'}
                  ghost
                  disabled={selectedRows.length === 0}
                  onClick={() => batchOperate('delete')}
                >
                  批量删除
                </Button>
              </Space>
            </div>
          )}
        </Col>
      </Row>

      <NgModal
        title={addTitle}
        width={400}
        visible={visible}
        onOk={confirmAddCategory}
        onCancel={() => setVisible(false)}
      >
        <div className="ml40 mr40 mb40">
          <Input placeholder="请输入目录名" value={inputValue} onChange={(e) => setInputValue(e.target.value)}></Input>
        </div>
      </NgModal>
      <NgModal
        title={batchInfo.title}
        width={400}
        visible={visible2}
        onOk={confirmBatchOperate}
        onCancel={() => setVisible2(false)}
      >
        <div className="ml40 mr40 mb40">{batchInfo.content}</div>
      </NgModal>

      <SetUserRight
        isBatch={false}
        groupId={currentWiki?.groupId}
        visible={visible3}
        onOk={confirmSetRight}
        onCancel={() => setVisible3(false)}
      />
    </div>
  );
};

export default KnowledgeList;
