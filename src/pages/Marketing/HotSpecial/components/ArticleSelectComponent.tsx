import React, { useContext, useEffect, useState } from 'react';
import { Button, Input, PaginationProps, Select, Space } from 'antd';
import { NgTable } from 'src/components';
import { getNewsList, getTagsOrCategorys } from 'src/apis/marketing';
import { Context } from 'src/store';
import { Article } from 'src/pages/Marketing/Article/Config';
import style from './style.module.less';
interface RowProps extends Article {
  itemId?: string;
  itemName?: string;
}

interface ArticleSelectComponentProps {
  selectedRowKeys: React.Key[];
  onChange: (keys: React.Key[], rows: RowProps[]) => void;
}

export const ArticleSelectComponent: React.FC<ArticleSelectComponentProps> = ({ onChange, selectedRowKeys }) => {
  const { articleCategoryList, setArticleCategoryList } = useContext(Context);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [formValues, setFormValues] = useState({
    title: '',
    categoryId: undefined
  });
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
  const onFormValueChange = (values: any) => {
    setFormValues((formValues) => ({ ...formValues, ...values }));
  };
  const onResetSearch = () => {
    onSearch({ title: '', categoryId: undefined });
  };
  return (
    <div className="pa20">
      <div className={style.panelWrap}>
        <div className={style.searchWrap}>
          <div className={style.searchItem}>
            <label htmlFor="">
              <span>文章名称：</span>
              <Input
                name="title"
                placeholder="请输入"
                allowClear
                value={formValues.title}
                onChange={(e) => onFormValueChange({ title: e.target.value })}
                className={style.nameInput}
              ></Input>
            </label>
          </div>
          <div className={style.searchItem}>
            <label>
              <span>文章分类：</span>
              <Select
                placeholder="请选择"
                allowClear
                className={style.selectWrap}
                value={formValues.categoryId}
                onChange={(value) => onFormValueChange({ categoryId: value })}
              >
                {articleCategoryList.map((item: any) => (
                  <Select.Option value={item.id} key={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </label>
          </div>
          <div className={style.searchItem}>
            <Space size={10}>
              <Button
                type="primary"
                shape="round"
                style={{ width: '70px' }}
                onClick={() => onSearch(formValues)}
                className={style.searchBtn}
              >
                查询
              </Button>
              <Button
                type="default"
                shape="round"
                onClick={() => onResetSearch()}
                style={{ width: '70px' }}
                className={style.searchBtn}
              >
                重置
              </Button>
            </Space>
          </div>
        </div>
        <NgTable
          className="mt20"
          size="small"
          scroll={{ x: 600 }}
          dataSource={dataSource}
          bordered
          pagination={pagination}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: selectedRowKeys,
            preserveSelectedRowKeys: true,
            onChange: (selectedRowKeys: React.Key[], selectedRows: Article[]) => {
              const rows = selectedRows.map((item) => ({
                ...item,
                itemId: item?.newsId,
                itemName: item?.title
              }));
              onSelectChange(selectedRowKeys, rows);
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
              width: 180
            }
          ]}
        ></NgTable>
      </div>
    </div>
  );
};
