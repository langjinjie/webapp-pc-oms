import { PaginationProps, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { getMomentList } from 'src/apis/marketing';
import { NgFormSearch, NgTable } from 'src/components';
import { Poster } from 'src/pages/Marketing/Poster/Config';
import { UNKNOWN } from 'src/utils/base';
import { setSearchCols } from './config';

interface PosterSelectComponentProps {
  onChange: (keys: React.Key[], rows: any[]) => void;
  selectedRowKeys: any[];
  tplType: string;
}
export const MomentSelectComponent: React.FC<PosterSelectComponentProps> = ({ onChange, selectedRowKeys, tplType }) => {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [formValues, setFormValues] = useState<any>({});

  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 9,
    total: 0,
    simple: true
  });

  const getList = async (params?: any) => {
    // 列表数据跟新前，先清空操作状态和选中项

    const postParams = {
      ...formValues,
      tplType: (tplType + '').slice(1, 2),
      pageSize: pagination.pageSize,
      pageNum: pagination.current,
      ...params
    };
    const res = await getMomentList(postParams);
    if (res) {
      const { total, list } = res;
      setDataSource(list);
      setPagination((pagination) => ({ ...pagination, total }));
    }
  };

  useEffect(() => {
    getList();
  }, [tplType]);
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

  return (
    <div>
      <NgFormSearch
        hideReset
        className={'modalForm'}
        searchCols={setSearchCols}
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
          type: 'radio',
          preserveSelectedRowKeys: true,
          selectedRowKeys: selectedRowKeys,

          onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
            const rows = selectedRows.map((item) => ({
              ...item,
              itemId: item?.feedId,
              itemName: item?.name
            }));
            onSelectChange(selectedRowKeys, rows);
          },
          getCheckboxProps: (record: Poster) => {
            return {
              disabled: selectedRowKeys.length >= 9 && !selectedRowKeys.includes(record.posterId),
              name: record.name
            };
          }
        }}
        columns={[
          {
            title: '名称',
            dataIndex: 'name',
            align: 'left',
            width: 500,
            ellipsis: {
              showTitle: false
            },
            render: (name: string) => (
              <Tooltip placement="topLeft" title={name}>
                {name || UNKNOWN}
              </Tooltip>
            )
          }
        ]}
        dataSource={dataSource}
        pagination={pagination}
        paginationChange={paginationChange}
        setRowKey={(record: any) => {
          return record.feedId;
        }}
      />
    </div>
  );
};
