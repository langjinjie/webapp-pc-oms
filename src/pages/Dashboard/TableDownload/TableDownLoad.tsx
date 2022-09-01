import { Button, DatePicker, Form, message, PaginationProps, Select } from 'antd';
import { Moment } from 'moment';
import React, { useEffect, useState } from 'react';
import { asyncCreateDownloadFile, dataDownloadList, exportFileWithTable } from 'src/apis/dashboard';
import { AuthBtn, NgTable } from 'src/components';
import { exportFile } from 'src/utils/base';
import { columns, fileProps } from './Config';

const TableDownLoad: React.FC = () => {
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total: number) => {
      return `共 ${total} 条记录`;
    }
  });
  const [dataSource, setDataSource] = useState<fileProps[]>([]);

  const getList = async (params?: any) => {
    const pageNum = params?.pageNum || pagination.current;
    const pageSize = params?.pageSize || pagination.pageSize;
    const res = await dataDownloadList({
      pageNum,
      pageSize
    });
    if (res) {
      const { list, total } = res;
      setDataSource(list);
      setPagination((pagination) => ({ ...pagination, total, current: pageNum, pageSize }));
    }
  };

  useEffect(() => {
    getList();
  }, []);

  const exportFileExcel = async (record: fileProps) => {
    const { data } = await exportFileWithTable({ fileId: record.fileId });

    exportFile(data, record.fileName!);
  };
  const createFile = async (values: { tmpId: string; dateRange: [Moment, Moment] }) => {
    const { tmpId, dateRange } = values;
    const startTime = dateRange[0].format('YYYY-MM-DD');
    const endTime = dateRange[1].format('YYYY-MM-DD');
    const res = await asyncCreateDownloadFile({ tmpId, startTime, endTime });
    if (res) {
      message.success('提交成功');
      getList({ pageNum: 1 });
    }
  };

  const paginationChange = (pageNum: number, pageSize?: number) => {
    getList({ pageNum, pageSize });
  };

  return (
    <div className="container">
      <AuthBtn path="/create">
        <Form layout="inline" onFinish={createFile}>
          <Form.Item label="报表类别" name="tmpId" rules={[{ required: true }]}>
            <Select placeholder="请选择报表类别" allowClear>
              <Select.Option value={1}>每日战报数据</Select.Option>
              <Select.Option value={2}>战报剔除黑名单统计数据</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="日期" name="dateRange" rules={[{ required: true }]}>
            <DatePicker.RangePicker allowClear />
          </Form.Item>
          <Form.Item extra="备注：同样的报表，1分钟内仅能下载一次">
            <Button type="primary" shape="round" htmlType="submit">
              生成报表
            </Button>
          </Form.Item>
        </Form>
      </AuthBtn>
      <div className="mt20">
        <NgTable
          dataSource={dataSource}
          pagination={pagination}
          paginationChange={paginationChange}
          columns={columns({
            handleOperate: exportFileExcel
          })}
        ></NgTable>
      </div>
    </div>
  );
};

export default TableDownLoad;
