import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'antd';
import { nodeSearchCols, tableColumns, RuleColumns } from './ListConfig';
import { PlusOutlined } from '@ant-design/icons';
import { NgFormSearch, NgTable } from 'src/components';
import { PaginationProps } from 'antd/es/pagination';
import CreateRuleModal from '../components/CreateNodeRuleModal';
import { Context } from 'src/store';
import { getNodeRuleList, getNodeTypeList } from 'src/apis/task';
import { NodeType } from 'src/utils/interface';

type QueryParamsType = Partial<{
  nodeCode: string;
  nodeName: string;
  nodeTypeCode: string;
}>;
export const NodeList: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const { nodeOptions, setNodeOptions } = useContext(Context);
  const [queryParams, setQueryParams] = useState<QueryParamsType>();
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });
  const [tableSource, setTableSource] = useState<Partial<RuleColumns>[]>([]);
  const getTypeList = async () => {
    if (nodeOptions.length > 0) return;

    const res = (await getNodeTypeList({})) as NodeType[];
    if (res) {
      const filterData = res.filter((item) => item.typeCode !== 'node_calendar');
      setNodeOptions(filterData);
    }
  };

  // 获取列表数据
  const getList = async (params?: any) => {
    const pageNum = params?.pageNum || pagination.current;
    const pageSize = params?.pageSize || pagination.pageSize;
    const res = await getNodeRuleList({ ...queryParams, ...params, pageNum, pageSize });
    if (res) {
      const { list, total } = res;
      setTableSource(list || []);
      setPagination((pagination) => ({ ...pagination, total, current: pageNum, pageSize }));
    }
  };

  useEffect(() => {
    getTypeList();
    getList();
  }, []);

  const onSearch = (values: any) => {
    getList({ ...values, pageNum: 1 });
    setQueryParams(values);
  };
  const onValuesChange = (changeValues: any, values: any) => {
    setQueryParams(values);
  };

  const paginationChange = (pageNum: number, pageSize?: number) => {
    getList({ pageNum, pageSize });
  };

  const createRule = async () => {
    setVisible(false);

    getList({ pageNum: 1 });
  };
  return (
    <div className="search-wrap">
      <Button type="primary" shape="round" icon={<PlusOutlined />} onClick={() => setVisible(true)} size="large">
        新建节点规则
      </Button>
      <div className={'pt20'}>
        <NgFormSearch
          isInline={false}
          firstRowChildCount={2}
          searchCols={nodeSearchCols}
          onSearch={onSearch}
          onValuesChange={onValuesChange}
        />
      </div>
      <div className="mt20">
        <NgTable
          columns={tableColumns}
          dataSource={tableSource}
          pagination={pagination}
          paginationChange={paginationChange}
          setRowKey={(record: RuleColumns) => {
            return record.nodeRuleId;
          }}
        />
      </div>
      <CreateRuleModal
        onSubmit={createRule}
        visible={visible}
        onCancel={() => setVisible(false)}
        options={nodeOptions}
      />
    </div>
  );
};
