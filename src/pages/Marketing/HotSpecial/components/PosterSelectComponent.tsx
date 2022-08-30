import { Button, Cascader, Image, Input, PaginationProps, Space, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { getPosterCategoryList, getPosterList } from 'src/apis/marketing';
import { NgTable } from 'src/components';
import { Poster } from 'src/pages/Marketing/Poster/Config';
import { UNKNOWN } from 'src/utils/base';
import style from './style.module.less';

interface PosterSelectComponentProps {
  onChange: (keys: React.Key[], rows: any[]) => void;
  selectedRowKeys: any[];
}
export const PosterSelectComponent: React.FC<PosterSelectComponentProps> = ({ onChange, selectedRowKeys }) => {
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [formValues, setFormValues] = useState<{
    fatherTypeId: string;
    typeId: string;
    name: string;
  }>();
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
  const onSearch = (values: any) => {
    setPagination((pagination) => ({ ...pagination, current: 1 }));

    getList({ ...values, pageNum: 1 });
  };

  const handleSearchValueChange = (values: any) => {
    setFormValues((formValues) => ({ ...formValues, ...values }));
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

  const onResetSearch = () => {
    onSearch({ fatherTypeId: undefined, typeId: undefined, name: '' });
  };

  return (
    <div className="pa20">
      <div className={style.panelWrap}>
        <div className={style.searchWrap}>
          <div className={style.searchItem}>
            <label htmlFor="">
              <span>海报名称：</span>
              <Input
                name="title"
                placeholder="请输入"
                allowClear
                value={formValues?.name}
                onChange={(e) => handleSearchValueChange({ name: e.target.value })}
                className={style.nameInput}
              ></Input>
            </label>
          </div>
          <div className={style.searchItem}>
            <label>
              <span>海报分类：</span>
              <Cascader
                options={categoryList}
                placeholder="请选择"
                allowClear
                changeOnSelect
                fieldNames={{ label: 'name', value: 'typeId', children: 'childs' }}
                className={style.selectWrap}
                value={
                  formValues?.fatherTypeId && formValues?.typeId
                    ? [formValues?.fatherTypeId as string, formValues?.typeId as string]
                    : undefined
                }
                onChange={(value) =>
                  handleSearchValueChange({ fatherTypeId: value?.[0] || undefined, typeId: value?.[1] || undefined })
                }
              ></Cascader>
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
          rowSelection={{
            hideSelectAll: true,

            type: 'checkbox',
            preserveSelectedRowKeys: true,
            selectedRowKeys: selectedRowKeys,
            onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
              console.log(selectedRows);

              const rows = selectedRows.map((item) => ({
                ...item,
                itemId: item?.posterId,
                itemName: item?.name
              }));
              onSelectChange(selectedRowKeys, rows);
            },
            getCheckboxProps: (record: Poster) => {
              return {
                disabled: selectedRowKeys.length >= 5 && !selectedRowKeys.includes(record.posterId),
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
              render: (_: any, record: Poster) => {
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
    </div>
  );
};
