import { Button, Image, PaginationProps, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { getPosterCategoryList, getPosterList } from 'src/apis/marketing';
import { NgFormSearch, NgTable } from 'src/components';
import { Poster } from 'src/pages/Marketing/Poster/Config';
import { UNKNOWN } from 'src/utils/base';
import { setSearchCols } from './config';
import style from './style.module.less';

interface PosterSelectComponentProps {
  onChange: (keys: React.Key[], rows: any[]) => void;
  selectedRowKeys: any[];
}
export const PosterSelectComponent: React.FC<PosterSelectComponentProps> = ({ onChange, selectedRowKeys }) => {
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [formValues, setFormValues] = useState<any>({});
  const [visible, setVisible] = useState(false);

  const [currentItem, setCurrentItem] = useState<Poster>();
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 9,
    total: 0,
    simple: true
  });
  const getCategoryList = async () => {
    const res = (await getPosterCategoryList({})) || [];
    setCategoryList(res);
  };

  const getList = async (params?: any) => {
    // 列表数据跟新前，先清空操作状态和选中项

    const postParams = {
      ...formValues,
      status: 2,
      pageSize: pagination.pageSize,
      pageNum: pagination.current,
      ...params
    };
    const res = await getPosterList(postParams);
    if (res) {
      const { total, list } = res;
      setDataSource(list);
      setPagination((pagination) => ({ ...pagination, total }));
    }
  };
  useEffect(() => {
    getCategoryList();
    getList();
  }, []);
  const handleSearch = (values: any) => {
    setPagination((pagination) => ({ ...pagination, current: 1 }));
    const { typeIds: [fatherTypeId, typeId] = [undefined, undefined], name } = values;
    getList({ name: name?.trim(), fatherTypeId, typeId, pageNum: 1 });
  };

  const handleSearchValueChange = (changesValue: any, values: any) => {
    const { name, typeIds: [fatherTypeId, typeId] = [undefined, undefined] } = values;
    setFormValues({ name, fatherTypeId, typeId });
  };

  const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]) => {
    onChange(selectedRowKeys, selectedRows);
  };

  const paginationChange = (pageNum: number) => {
    setPagination((pagination) => ({ ...pagination, current: pageNum }));
    getList({ pageNum });
  };

  const preViewPoster = (record: Poster) => {
    setCurrentItem(record);
    setVisible(true);
  };

  return (
    <div>
      <NgFormSearch
        hideReset
        className={style.customerInput}
        searchCols={setSearchCols(categoryList)}
        onSearch={handleSearch}
        onValuesChange={(changesValue, values) => {
          handleSearchValueChange(changesValue, values);
        }}
      />

      <NgTable
        className="mt20"
        size="small"
        scroll={{ x: 600 }}
        rowSelection={{
          hideSelectAll: true,
          type: 'checkbox',
          preserveSelectedRowKeys: true,
          selectedRowKeys: selectedRowKeys,
          onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
            onSelectChange(selectedRowKeys, selectedRows);
          },
          getCheckboxProps: (record: Poster) => {
            return {
              disabled: selectedRowKeys.length > 9 && !selectedRowKeys.includes(record.posterId),
              name: record.name
            };
          }
        }}
        columns={[
          {
            title: '名称',
            dataIndex: 'name',
            align: 'left',
            width: 100,
            ellipsis: {
              showTitle: false
            },
            render: (name: string) => (
              <Tooltip placement="topLeft" title={name}>
                {name || UNKNOWN}
              </Tooltip>
            )
          },
          {
            title: '分类',
            dataIndex: 'typeName',
            align: 'left',
            width: 180,
            render: (text: String, record: Poster) => {
              return record.fatherTypeName ? record.fatherTypeName + '-' + text : text || UNKNOWN;
            }
          },
          {
            title: '操作',
            dataIndex: 'typeName',
            align: 'left',
            width: 80,
            render: (_, record: Poster) => {
              return (
                <Button type="link" onClick={() => preViewPoster(record)}>
                  查看
                </Button>
              );
            }
          }
        ]}
        dataSource={dataSource}
        pagination={pagination}
        paginationChange={paginationChange}
        setRowKey={(record: any) => {
          return record.posterId;
        }}
      />
      <Image
        width={200}
        style={{ display: 'none' }}
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
        preview={{
          visible,
          src: currentItem?.imgUrl,
          onVisibleChange: (value) => {
            setVisible(value);
            if (!value) setCurrentItem(undefined);
          }
        }}
      />
    </div>
  );
};
