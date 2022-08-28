import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { PaginationProps } from 'antd/es/pagination';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { changeHotStatus, getHotList, sortTopHot } from 'src/apis/marketing';
import { NgFormSearch, NgTable } from 'src/components';
import { OperateType } from 'src/utils/interface';
import CreateSpecial from './components/CreateSpecial';
import { HotColumns, searchColsFun, tableColumnsFun } from './ListConfig';

type QueryParamsType = Partial<{
  name: string;
  status: string;
}>;
const HotSpecialList: React.FC<RouteComponentProps> = ({ history }) => {
  const [queryParams, setQueryParams] = useState<QueryParamsType>({});
  const [tableSource, setTableSource] = useState<HotColumns[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 100,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });

  const [visible, setVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<HotColumns>();

  const getList = async (params?: any) => {
    const pageNum = params?.pageNum || pagination.current;
    const pageSize = params?.pageSize || pagination.pageSize;
    const res = await getHotList({
      ...queryParams,
      ...params,
      pageNum,
      pageSize
    });
    if (res) {
      const { list, total } = res;
      setTableSource(list);
      setPagination((pagination) => ({ ...pagination, total, pageSize, current: pageNum }));
    }
  };

  useEffect(() => {
    getList();
  }, []);

  const onSearch = (values: any) => {
    setQueryParams(values);
    getList({ ...values, pageNum: 1 });
  };
  const onValuesChange = (changeValue: any, values: any) => {
    setQueryParams(values);
  };

  const paginationChange = (pageNum: number, pageSize?: number) => {
    getList({ pageNum, pageSize });
  };

  const changeItemStatus = async (record: HotColumns, index: number) => {
    if (record.contentNum === 0) return message.warning('请配置内容信息');
    const res = await changeHotStatus({ topicId: record.topicId, status: record.status === 0 ? 1 : 0 });
    if (res) {
      const recordRes = { ...record, status: record.status === 0 ? 1 : 0 };
      const copyData = [...tableSource];
      copyData.splice(index, 1, recordRes);
      setTableSource(copyData);
      message.success(record.status === 1 ? '下架成功' : '上架成功');
    }
  };

  const operateItem = async (operateType: OperateType, record: HotColumns, index: number) => {
    if (operateType === 'add') {
      history.push('/marketingHot/edit?topicId=' + record.topicId);
    } else if (operateType === 'edit') {
      setVisible(true);
      setCurrentItem(record);
    } else if (operateType === 'putAway' || operateType === 'outline') {
      changeItemStatus(record, index);
    } else if (operateType === 'other') {
      // 置顶操作
      const res = await sortTopHot({ topicId: record.topicId });
      if (res) {
        message.success('置顶成功');
        getList({ pageNum: 1 });
      }
    }
  };

  return (
    <div className="container">
      <Button
        type="primary"
        shape="round"
        icon={<PlusOutlined />}
        onClick={() => {
          setVisible(true);
          setCurrentItem(undefined);
        }}
        size="large"
      >
        创建热门专题
      </Button>
      <NgFormSearch className="mt20" searchCols={searchColsFun()} onSearch={onSearch} onValuesChange={onValuesChange} />

      <div className="mt20">
        <NgTable
          columns={tableColumnsFun({
            onOperate: operateItem
          })}
          dataSource={tableSource}
          pagination={pagination}
          paginationChange={paginationChange}
          setRowKey={(record: HotColumns) => {
            return record.topicId;
          }}
        />
      </div>

      <CreateSpecial
        onSuccess={() =>
          onSearch({
            name: '',
            status: undefined
          })
        }
        visible={visible}
        value={currentItem}
        onClose={() => {
          setVisible(false);
        }}
      />
    </div>
  );
};

export default HotSpecialList;
