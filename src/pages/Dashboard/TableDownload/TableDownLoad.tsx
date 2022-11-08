import { Button, DatePicker, Form, message, PaginationProps, Select } from 'antd';
import moment, { Moment } from 'moment';
import React, { useEffect, useState } from 'react';
import {
  asyncCreateDownloadFile,
  dataDownloadList,
  exportFileWithTable,
  requestGetTempleList
} from 'src/apis/dashboard';
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
  const [templeList, setTempleList] = useState<{ templateName: string; tmpId: string; type: 0 | 1 }[]>([]);
  const [templeType, setTempleType] = useState<0 | 1>(0);

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

  // 获取报表类别
  const getListCategory = async () => {
    const res = await requestGetTempleList();
    if (res) {
      setTempleList(res);
    }
  };

  // 选择报表类型
  const selectOnChange = (value: string) => {
    const templeType = templeList.find((findItem) => findItem.tmpId === value)?.type || 0;
    setTempleType(templeType);
  };

  useEffect(() => {
    getList();
    getListCategory();
  }, []);

  const exportFileExcel = async (record: fileProps) => {
    const { data } = await exportFileWithTable({ fileId: record.fileId });

    exportFile(data, record.fileName!);
  };
  const createFile = async (values: { tmpId: string; dateRange: [Moment, Moment] }) => {
    const { tmpId, dateRange } = values;
    // templeType为1时,时间的开始时间为2021-08-01, 结束时间为当前时间
    const startTime = dateRange?.[0].format('YYYY-MM-DD') || '2021-08-01';
    const endTime = dateRange?.[1].format('YYYY-MM-DD') || moment().format('YYYY-MM-DD');
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
            <Select placeholder="请选择报表类别" allowClear onChange={selectOnChange}>
              {templeList.map((mapItem) => (
                <Select.Option key={mapItem.tmpId} value={mapItem.tmpId}>
                  {mapItem.templateName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="日期" name="dateRange" rules={[{ required: templeType === 0 }]}>
            {/* type为1 不能选择时间 */}
            <DatePicker.RangePicker disabled={templeType === 1} allowClear />
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
          rowKey={'id'}
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
