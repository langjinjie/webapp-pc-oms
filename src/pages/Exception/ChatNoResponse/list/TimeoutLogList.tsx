import { Button, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { downloadChatTimeoutRecord, getChatTimeoutRecordList } from 'src/apis/exception';
import { NgFormSearch, NgTable } from 'src/components';
import { exportFile } from 'src/utils/base';
import { logSearchCols, logTableColumns, RuleColumns } from './Config';

const TimeoutLogList: React.FC = () => {
  const [dataSource, setDataSource] = useState<Partial<RuleColumns>[]>([]);
  const [pagination, setPagination] = useState({
    pageNum: 1,
    pageSize: 10,
    total: 0
  });
  const [searchValues, setSearchValues] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const getList = async (params?: any) => {
    setLoading(true);
    const res = await getChatTimeoutRecordList({
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      ...searchValues,
      ...params
    });
    setLoading(false);
    if (res) {
      const { list, total } = res;
      setDataSource(list);
      setPagination((pagination) => ({
        ...pagination,
        total,
        pageNum: params?.pageNum || 1,
        pageSize: params?.pageSize || pagination.pageSize
      }));
    }
  };
  const onSearch = (values: any) => {
    setSearchValues(values);
    getList(values);
  };

  useEffect(() => {
    getList();
  }, []);

  const downloadLog = async () => {
    const res = await downloadChatTimeoutRecord(searchValues);
    if (res && res.headers['content-disposition']?.split('=')[1]) {
      const fileName = decodeURI(res.headers['content-disposition']?.split('=')[1]);
      exportFile(res.data, fileName.split('.')[0], fileName.split('.')[1]);
    } else {
      message.warning('下载异常');
    }
  };
  return (
    <div>
      <div className="flex mt30 align-end">
        <div className="cell">
          <NgFormSearch isInline={false} firstRowChildCount={2} searchCols={logSearchCols} onSearch={onSearch} />
        </div>
        <Button type="primary" shape="round" onClick={downloadLog}>
          下载记录
        </Button>
      </div>
      <NgTable
        key={'recordId'}
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}
        className="mt16"
        columns={logTableColumns}
      ></NgTable>
    </div>
  );
};

export default TimeoutLogList;
