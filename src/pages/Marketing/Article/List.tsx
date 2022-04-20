import React, { useEffect, useState, useContext } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, message, Modal, Space } from 'antd';

import {
  getNewsList,
  operateArticleStatus,
  updateNewsState,
  getNewsDetail,
  getTagsOrCategorys
} from 'src/apis/marketing';

import style from './style.module.less';

import { Context } from 'src/store';

import { NgFormSearch, NgTable } from 'src/components';
import { setSearchCols, SearchParamsProps, columns, Article, PaginationProps } from './Config';
import classNames from 'classnames';
import { PlusOutlined } from '@ant-design/icons';
import { OnlineModal } from '../Components/OnlineModal/OnlineModal';
import { useDocumentTitle } from 'src/utils/base';

const ArticleList: React.FC<RouteComponentProps> = ({ history }) => {
  useDocumentTitle('营销素材-文章库');
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });
  const { currentCorpId, articleCategoryList, setArticleCategoryList, isMainCorp } = useContext(Context);
  const [visibleOnline, setVisibleOnline] = useState(false);
  // operationType 1=上架;2=下架;
  const [operationType, setOperationType] = useState<number | null>(null);
  const [selectedRowKeys, setSelectRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [tableSource, setTableSource] = useState([]);
  const [visible, toggleVisible] = useState(false);
  const [htmlStr, setHtmlStr] = useState('');
  const [currentItem, setCurrentItem] = useState<Article | null>();
  const [queryForm, setQueryForm] = useState({
    title: '',
    minTime: '',
    maxTime: '',
    categoryId: '',
    syncBank: '',
    corpId: ''
  });

  const getList = async (args: any | null) => {
    try {
      setLoading(true);
      const res = await getNewsList({
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        ...queryForm,
        ...args
      });
      if (!res) {
        return false;
      }
      setLoading(false);
      setPagination((pagination) => ({ ...pagination, total: res.total }));
      setTableSource(res.newsList);
    } catch (err) {
      // throw Error(err);
    }
  };
  const asyncGetTagsOrCategory = async (type: 'category' | 'tag') => {
    try {
      const res = await getTagsOrCategorys({ type });
      if (res && type === 'category') {
        setArticleCategoryList(res);
      }
    } catch (err) {
      // throw Error(err);
    }
  };

  useEffect(() => {
    getList({});
    if (articleCategoryList?.length === 0) {
      asyncGetTagsOrCategory('category');
    }
  }, []);

  // 获取列表数据
  const onSearch = (values: SearchParamsProps) => {
    const { title, categoryId, fromSource, rangePicker, syncBank, corpId } = values;
    let minTime = '';
    let maxTime = '';
    if (rangePicker && rangePicker.length > 0) {
      minTime = rangePicker[0].format('YYYY-MM-DD');
      maxTime = rangePicker[1].format('YYYY-MM-DD');
    }
    setQueryForm((queryForm) => ({ ...queryForm, title, categoryId, fromSource, minTime, maxTime, syncBank, corpId }));
    setPagination((pagination) => ({ ...pagination, current: 1 }));
    getList({ title, categoryId, fromSource, minTime, maxTime, syncBank, pageNum: 1, corpId });
  };
  const onValuesChange = (changeVals: any, values: SearchParamsProps) => {
    const { title, categoryId, fromSource, rangePicker, syncBank, corpId } = values;
    let minTime = '';
    let maxTime = '';
    if (rangePicker && rangePicker.length > 0) {
      minTime = rangePicker[0].format('YYYY-MM-DD');
      maxTime = rangePicker[1].format('YYYY-MM-DD');
    }
    setQueryForm((queryForm) => ({ ...queryForm, title, categoryId, fromSource, minTime, maxTime, syncBank, corpId }));
  };

  const handlePreview = () => {
    toggleVisible(!visible);
  };

  const viewItem = async (record: Article) => {
    const res = await getNewsDetail({ newsId: record.newsId });
    const htmlStr = res.crawl === 0 ? res.txt : (res && res.content && res.content[0].content) || '';
    setHtmlStr(htmlStr);
    handlePreview();
  };

  // 删除某条文件
  const deleteItem = async (record: Article) => {
    try {
      const res = await operateArticleStatus({ newsId: record.newsId, opType: 0 });
      if (res) {
        message.success('删除成功');
        await getList({});
      }
    } catch (e) {
      console.log(e);
    }
  };

  // 编辑某条资讯
  const handleEdit = (record: Article) => {
    history.push('/marketingArticle/edit?id=' + record.newsId);
  };
  const paginationChange = (page: number, pageSize?: number) => {
    setPagination((pagination) => {
      return {
        ...pagination,
        current: page,
        pageSize: pageSize || 10
      };
    });
    getList({ pageNum: page, pageSize });
  };
  const handleAdd = () => {
    history.push('/marketingArticle/edit');
  };

  const handleTop = async (record: Article) => {
    const res = await operateArticleStatus({ newsId: record.newsId, opType: record.isTop ? -3 : 3 });
    if (res) {
      message.success(!record.isTop ? '置顶成功' : '取消置顶成功');
      await getList({});
    }
  };

  const onSubmitToggleOnline = async ({
    type,
    corpIds,
    record
  }: {
    type: number;
    corpIds?: string[];
    record?: Article;
  }) => {
    const res = await updateNewsState({
      syncBank: type,
      newsId: operationType ? selectedRowKeys : [record?.newsId || currentItem?.newsId], // 判断是否是批量操作
      corpIds: corpIds || [currentCorpId]
    });
    if (res) {
      const msg = type === 1 ? '上架成功！' : '下架成功！';
      message.success(msg);
      setSelectRowKeys([]);
      setOperationType(null);
      getList({});
    }
  };

  const handleToggleOnlineState = async (type: number, record?: Article) => {
    if (type === 2) {
      if (operationType && !record) {
        Modal.confirm({
          content: isMainCorp ? '下架后会影响所有机构' : '确定下架',
          cancelText: '否',
          okText: '是',
          onOk: () => {
            onSubmitToggleOnline({ type });
          }
        });
      } else {
        onSubmitToggleOnline({ type, record });
      }
    } else {
      if (isMainCorp) {
        setVisibleOnline(true);
      } else {
        Modal.confirm({
          content: '确认上架？',
          cancelText: '取消',
          okText: '确定',
          onOk: () => {
            onSubmitToggleOnline({ type, record });
          }
        });
      }
    }
  };

  // 修改资讯上下架状态
  const changeItemStatus = async (record: Article) => {
    setCurrentItem(record);
    let type = 1;
    if (record.syncBank === 0 || record.syncBank === 2) {
      type = 1;
    } else {
      type = 2;
    }
    handleToggleOnlineState(type, record);
  };

  const myColumns = () => {
    const res = columns({ handleEdit, deleteItem, viewItem, changeItemStatus, handleTop });
    // 根据时候为机构来过滤col
    if (isMainCorp) {
      return res;
    } else {
      return res.filter((column) => column.key !== 'corpNames');
    }
  };
  const isDisabled = (operationType: number | null, status: number) => {
    let _isDisabled = false;
    if (operationType) {
      if (operationType === 1 && status === 1) {
        _isDisabled = true;
      } else if (operationType === 2 && (status === 0 || status === 2)) {
        _isDisabled = true;
      }
    }
    return _isDisabled;
  };
  const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: Article[]) => {
    setSelectRowKeys(selectedRowKeys);
    const current = selectedRows[0];
    if (current) {
      if (current.syncBank === 0 || current.syncBank === 2) {
        setOperationType(1);
      } else {
        setOperationType(2);
      }
    } else {
      setOperationType(null);
    }
  };
  // 表格RowSelection配置项
  const rowSelection = {
    hideSelectAll: true,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: Article[]) => {
      onSelectChange(selectedRowKeys, selectedRows);
    },
    getCheckboxProps: (record: Article) => {
      return {
        disabled: isDisabled(operationType, record.syncBank),
        name: record.title
      };
    }
  };

  const submitOnline = (corpIds: any[]) => {
    onSubmitToggleOnline({ type: 1, corpIds });
    setVisibleOnline(false);
  };

  return (
    <div className={classNames(style.wrap, 'container')}>
      {/* Form 表单查询 start */}
      <Button
        className={style.btnAdd}
        type="primary"
        onClick={handleAdd}
        shape="round"
        icon={<PlusOutlined />}
        size="large"
        style={{ width: 128 }}
      >
        添加
      </Button>
      <div className={'pt20'}>
        <NgFormSearch
          isInline={false}
          searchCols={setSearchCols(articleCategoryList)}
          onSearch={onSearch}
          onValuesChange={onValuesChange}
        />
      </div>
      {/* Form 表单查询 end */}
      {/* 列表数据 start */}
      <div className={'pt5'}>
        <NgTable
          loading={loading}
          columns={myColumns()}
          rowSelection={rowSelection}
          dataSource={tableSource}
          pagination={pagination}
          paginationChange={paginationChange}
          setRowKey={(record: any) => {
            return record.newsId;
          }}
        />
        {tableSource.length > 0 && (
          <div className={'operationWrap'}>
            <Space size={20}>
              <Button
                type="primary"
                shape={'round'}
                ghost
                disabled={operationType !== 1}
                onClick={() => handleToggleOnlineState(1)}
              >
                批量上架
              </Button>
              <Button
                type="primary"
                shape={'round'}
                ghost
                disabled={operationType !== 2}
                onClick={() => handleToggleOnlineState(2)}
              >
                批量下架
              </Button>
            </Space>
          </div>
        )}
        {/* 列表数据 end */}
      </div>
      <OnlineModal visible={visibleOnline} onCancel={() => setVisibleOnline(false)} onOk={submitOnline}></OnlineModal>
      <Modal
        title="预览（实际样式以移动端为准）"
        visible={visible}
        onOk={handlePreview}
        onCancel={handlePreview}
        footer={null}
        width={990}
      >
        <div className={style.previewDesc} dangerouslySetInnerHTML={{ __html: htmlStr }}></div>
      </Modal>
    </div>
  );
};

export default ArticleList;
