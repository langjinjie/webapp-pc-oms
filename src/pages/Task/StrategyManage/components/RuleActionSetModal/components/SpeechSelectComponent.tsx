import React, { useEffect, useState } from 'react';
import { PaginationProps } from 'antd';
import { NgFormSearch, NgTable } from 'src/components';
import { getCategoryList, getSpeechList } from 'src/apis/salesCollection';
import { SpeechProps } from 'src/pages/SalesCollection/SpeechManage/Config';

interface ProductSelectComponentProps {
  onChange: (keys: React.Key[], rows: any[]) => void;
}

export const SpeechSelectComponent: React.FC<ProductSelectComponentProps> = ({ onChange }) => {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [formValues, setFormValues] = useState<any>();
  const [categories, setCategories] = useState<any[]>([]);

  const [lastCategory, setLastCategory] = useState<any>();
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 9,
    total: 0,
    simple: true
  });
  const getList = async (params?: any) => {
    const pageNum = params?.pageNum || pagination.current;
    const res = await getSpeechList({
      pageSize: pagination.pageSize,
      ...formValues,
      ...params,
      pageNum,
      status: 1,
      sceneId: lastCategory?.sceneId || ''
    });
    if (res) {
      const { list, total } = res;
      setDataSource(list || []);
      setPagination((pagination) => ({ ...pagination, total, current: pageNum }));
    }
  };

  const loadData = async (selectedOptions: any) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    // 异步加载子类目
    const res = await getCategoryList({ sceneId: targetOption.sceneId, catalogId: targetOption.catalogId });

    targetOption.loading = false;
    if (res) {
      res.forEach((item: any) => {
        if (item.lastLevel === 0) {
          item.isLeaf = false;
        }
      });
      targetOption.children = res;
    }
    setCategories([...categories]);
  };
  const onCascaderChange = (value: any, selectedOptions: any) => {
    const lastSelectedOptions = selectedOptions[selectedOptions.length - 1] || {};
    setLastCategory(lastSelectedOptions);
    setPagination((pagination) => ({ ...pagination, current: 1 }));
    let params = {};
    if (lastSelectedOptions.lastLevel === 1) {
      params = {
        content: '',
        contentType: '',
        sensitive: '',
        status: ''
      };
      setFormValues(() => ({ ...formValues, ...params }));
    }
  };

  const getCategory = async (params?: any) => {
    const res = await getCategoryList({ ...params });
    if (res) {
      res.forEach((item: any) => {
        if (item.lastLevel === 0) {
          item.isLeaf = false;
        }
      });
      setCategories(res);
      return res;
      // setCategories(res);
    }
  };

  const paginationChange = (pageNum: number) => {
    setPagination((pagination) => ({ ...pagination, current: pageNum }));
    getList({ pageNum });
  };

  useEffect(() => {
    getList();
    getCategory();
  }, []);
  const onSearch = async (values: any) => {
    const { catalogIds } = values;
    setFormValues({
      catalogId: catalogIds?.[catalogIds.length - 1] || undefined
    });
    getList({ catalogId: catalogIds?.[catalogIds.length - 1] || undefined, pageNum: 1 });
  };
  const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]) => {
    onChange(selectedRowKeys, selectedRows);
  };
  return (
    <>
      <NgFormSearch
        onSearch={onSearch}
        onValuesChange={(changeValue, values) => setFormValues(values)}
        loadData={loadData}
        onChangeOfCascader={onCascaderChange}
        searchCols={[
          {
            name: 'catalogIds',
            type: 'cascader',
            label: '选择目录',
            width: '220px',
            placeholder: '请输入',
            fieldNames: { label: 'name', value: 'catalogId', children: 'children' },
            cascaderOptions: categories
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
          onChange: (selectedRowKeys: React.Key[], selectedRows: SpeechProps[]) => {
            const rows = selectedRows.map((item) => ({ itemId: item.contentId, itemName: item.content }));
            onSelectChange(selectedRowKeys, rows);
          }
        }}
        rowKey="contentId"
        paginationChange={paginationChange}
        columns={[{ title: '话术内容', dataIndex: 'content', key: 'content' }]}
      ></NgTable>
    </>
  );
};
