import React, { useContext, useEffect, useState } from 'react';
import { Button, PaginationProps } from 'antd';
import { NgFormSearch, NgTable } from 'src/components';
import { getNewsList, getTagsOrCategorys } from 'src/apis/marketing';
import { Context } from 'src/store';
import { Article } from 'src/pages/Marketing/Article/Config';
import style from './style.module.less';
interface RowProps extends Article {
  itemId?: string;
  itemName?: string;
}

interface ArticleSelectComponentProps {
  onChange: (keys: React.Key[], rows: RowProps[]) => void;
}

export const ArticleSelectComponent: React.FC<ArticleSelectComponentProps> = ({ onChange }) => {
  const { articleCategoryList, setArticleCategoryList } = useContext(Context);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [formValues, setFormValues] = useState<any>();
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 9,
    total: 0,
    simple: true
  });
  const getList = async (params?: any) => {
    const pageNum = params?.pageNum || pagination.current;
    const res = await getNewsList({
      syncBank: 1,
      pageSize: pagination.pageSize,
      ...formValues,
      ...params,
      pageNum
    });
    if (res) {
      const { newsList: list, total } = res;
      setDataSource(list || []);
      setPagination((pagination) => ({ ...pagination, total, current: pageNum }));
    }
  };
  const asyncGetTagsOrCategory = async () => {
    try {
      if (articleCategoryList.length > 0) return;
      const res = await getTagsOrCategorys({ type: 'category' });
      if (res) {
        setArticleCategoryList(res);
      }
    } catch (err) {
      // throw Error(err);
    }
  };

  const paginationChange = (pageNum: number) => {
    setPagination((pagination) => ({ ...pagination, current: pageNum }));
    getList({ pageNum });
  };

  useEffect(() => {
    asyncGetTagsOrCategory();
    getList();
  }, []);
  const onSearch = async (values: any) => {
    setFormValues(values);
    getList({ ...values, pageNum: 1 });
  };
  const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: Article[]) => {
    onChange(selectedRowKeys, selectedRows);
  };
  return (
    <>
      <NgFormSearch
        className={style.customerInput}
        onSearch={onSearch}
        onValuesChange={(changeValue, values) => setFormValues(values)}
        searchCols={[
          {
            name: 'title',
            type: 'input',
            label: '文章名称',
            width: '200px',
            placeholder: '待输入'
          },
          {
            name: 'categoryId',
            type: 'select',
            label: '文章分类',
            options: articleCategoryList,
            width: '200px',
            placeholder: '待输入'
          }
        ]}
        hideReset
      />
      <NgTable
        className="mt20"
        size="small"
        scroll={{ x: 600 }}
        dataSource={dataSource}
        bordered
        pagination={pagination}
        rowSelection={{
          type: 'radio',
          onChange: (selectedRowKeys: React.Key[], selectedRows: Article[]) => {
            onSelectChange(selectedRowKeys, selectedRows);
          }
        }}
        rowKey="newsId"
        paginationChange={paginationChange}
        columns={[
          { title: '文章名称', dataIndex: 'title', key: 'title', width: 300 },
          {
            title: '文章分类',
            dataIndex: 'tagNameList',
            key: 'tagNameList',
            width: 100
          },
          {
            title: '详情',

            width: 80,
            render: (text: string, record: any) => (
              <Button
                type="link"
                onClick={() => {
                  console.log(record);
                }}
              >
                详情
              </Button>
            )
          }
        ]}
      ></NgTable>
    </>
  );
};
