import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, message, Modal, Space } from 'antd';

import {
  getNewsList,
  deleteNews,
  updateNewsState,
  getNewsDetail,
  getTagsOrCategorys,
  TagsOrCategoryProps
} from 'src/apis/marketing';

import style from './style.module.less';

// import { GlobalContent, UPDATE_CATEGORY, UPDATE_TAGS } from 'src/store';

import { NgFormSearch, NgTable } from 'src/components';
import { setSearchCols, SearchParamsProps, columns, Article } from './Config';
import { useGetCorps } from 'src/utils/corp';
import classNames from 'classnames';
import { PlusOutlined } from '@ant-design/icons';

interface paginationProps {
  current: number;
  pageSize: number;
  total: number;
  showTotal: (total: any) => string;
}

const ArticleList: React.FC<RouteComponentProps> = ({ history }) => {
  const { data: corpList } = useGetCorps();
  const [pagination, setPagination] = useState<paginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });
  // operationType 1=上架;2=下架;
  const [operationType, setOperationType] = useState<number | null>(null);
  const [selectedRowKeys, setSelectRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [tableSource, setTableSource] = useState([]);
  const [visible, toggleVisible] = useState(false);
  const [htmlStr, setHtmlStr] = useState('');
  const [queryForm, setQueryForm] = useState({
    title: '',
    minTime: '',
    maxTime: '',
    categoryId: '',
    syncBank: '',
    corpId: ''
  });
  // const { data, dispatch } = useContext(GlobalContent);
  const categoryList: TagsOrCategoryProps[] = [];

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
      // dispatch({
      //   type: type === 'category' ? UPDATE_CATEGORY : UPDATE_TAGS,
      //   data: res
      // });
      console.log(res);
    } catch (err) {
      // throw Error(err);
    }
  };

  useEffect(() => {
    getList({});
    if (categoryList.length === 0) {
      asyncGetTagsOrCategory('category');
    }
  }, []);

  // 获取列表数据
  const onSearch = (values: SearchParamsProps) => {
    const { title, categoryId, rangePicker, syncBank, corpId } = values;
    let minTime = '';
    let maxTime = '';
    if (rangePicker && rangePicker.length > 0) {
      minTime = rangePicker[0].format('YYYY-MM-DD');
      maxTime = rangePicker[1].format('YYYY-MM-DD');
    }
    setQueryForm((queryForm) => ({ ...queryForm, title, categoryId, minTime, maxTime, syncBank, corpId }));
    setPagination((pagination) => ({ ...pagination, current: 1 }));
    getList({ title, categoryId, minTime, maxTime, syncBank, pageNum: 1, corpId });
  };
  const onValuesChange = (changeVals: any, values: SearchParamsProps) => {
    const { title, categoryId, rangePicker, syncBank, corpId } = values;
    let minTime = '';
    let maxTime = '';
    if (rangePicker && rangePicker.length > 0) {
      minTime = rangePicker[0].format('YYYY-MM-DD');
      maxTime = rangePicker[1].format('YYYY-MM-DD');
    }
    setQueryForm((queryForm) => ({ ...queryForm, title, categoryId, minTime, maxTime, syncBank, corpId }));
  };

  // 修改资讯上下架状态
  const changeItemStatus = async (record: Article) => {
    const res = await updateNewsState({ newsId: record.newsId, syncBank: record.syncBank === 1 ? 2 : 1 });
    if (res) {
      message.success('操作成功！');
      await getList({});
    }
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
      await deleteNews({ newsIds: record.newsId });
      message.success('删除成功');
      await getList({});
    } catch (e) {
      console.log(e);
    }
  };

  // 编辑某条资讯
  const handleEdit = (record: Article) => {
    history.push('/marketing/article/edit?id=' + record.newsId);
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
    history.push('/marketing/article/edit');
    console.log('新增');
  };

  const myColumns = columns({ handleEdit, deleteItem, viewItem, changeItemStatus });
  const isDisabled = (operationType: number | null, status: number) => {
    let _isDisabled = false;
    if (operationType) {
      if (operationType === 1 && status === 2) {
        _isDisabled = true;
      } else if (operationType === 2 && (status === 1 || status === 3)) {
        _isDisabled = true;
      }
    }
    return _isDisabled;
  };
  const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: Article[]) => {
    setSelectRowKeys(selectedRowKeys);
    const current = selectedRows[0];
    if (current) {
      if (current.status === 1 || current.status === 3) {
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
        disabled: isDisabled(operationType, record.status),
        name: record.name
      };
    }
  };

  const handleToggleOnlineState = async (type: number) => {
    if (type === 2) {
      Modal.confirm({
        content: '下架后会影响所有机构',
        cancelText: '否',
        okText: '是',
        onOk: () => {
          // onSubmitToggleOnline(type);
        }
      });
    } else {
      // setVisible(true);
    }
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
          searchCols={setSearchCols(categoryList, corpList)}
          onSearch={onSearch}
          onValuesChange={onValuesChange}
        />
      </div>
      {/* Form 表单查询 end */}
      {/* 列表数据 start */}
      <div className={'pt20'}>
        <NgTable
          loading={loading}
          columns={myColumns}
          rowSelection={rowSelection}
          dataSource={tableSource}
          pagination={pagination}
          paginationChange={paginationChange}
          setRowKey={(record: any) => {
            return record.newsId;
          }}
        />
        <div className={style.operationWrap}>
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
        {/* 列表数据 end */}
      </div>
      <Modal
        title="预览（实际样式以移动端为准）"
        visible={visible}
        onOk={handlePreview}
        onCancel={handlePreview}
        footer={null}
      >
        <div className="bf-preview-desc" dangerouslySetInnerHTML={{ __html: htmlStr }}></div>
      </Modal>
      ;
    </div>
  );
};

export default ArticleList;
