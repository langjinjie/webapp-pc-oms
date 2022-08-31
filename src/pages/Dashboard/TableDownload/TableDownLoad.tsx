import { PaginationProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { dataDownloadList, exportFileWithTable } from 'src/apis/dashboard';
import { NgFormSearch, NgTable } from 'src/components';
import { exportFile } from 'src/utils/base';
import { columns, fileProps, SearchCols } from './Config';

const TableDownLoad: React.FC = () => {
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });
  const [dataSource, setDataSource] = useState<fileProps[]>([]);
  const onSearch = (values: any) => {
    console.log(values);
  };

  const getList = async () => {
    const res = await dataDownloadList({
      pageNum: pagination.current,
      pageSize: pagination.pageSize
    });
    console.log(res);
    if (res) {
      const { list, total } = res;
      setDataSource(list);
      setPagination((pagination) => ({ ...pagination, total }));
    }
  };

  useEffect(() => {
    getList();
  }, []);

  const exportFileExcel = async (record: fileProps) => {
    const { data } = await exportFileWithTable({ fileId: record.fileId });

    exportFile(data, record.fileName!);
  };
  return (
    <div className="container">
      <NgFormSearch searchCols={SearchCols} onSearch={onSearch} />
      <div className="mt20">
        <NgTable
          dataSource={dataSource}
          pagination={pagination}
          columns={columns({
            handleOperate: exportFileExcel
          })}
        ></NgTable>
      </div>
    </div>
  );
};

export default TableDownLoad;
