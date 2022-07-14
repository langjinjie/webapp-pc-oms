import { PlusOutlined } from '@ant-design/icons';
import { Button, message, PaginationProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { addNode, deleteNode, getNodeList, getNodeTypeList } from 'src/apis/task';
import { NgFormSearch, NgTable } from 'src/components';
import { CreateNodeModal, NodeTypeProps } from './components/CrateNodeModal';

import { NodeColumns, searchColsFun, tableColumnsFun } from './ListConfig';

type QueryParamsType = Partial<{
  nodeCode: string;
  nodeName: string;
  nodeTypeCode: string;
}>;
const TaskNodeList: React.FC = () => {
  const [visibleCreateNode, setVisibleCreateNode] = useState(false);

  const [typeOptions, setTypeOptions] = useState<NodeTypeProps[]>([]);
  const [tableSource, setTableSource] = useState<Partial<NodeColumns>[]>([]);
  const [queryParams, setQueryParams] = useState<QueryParamsType>();
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });

  const getTypeList = async () => {
    const res = (await getNodeTypeList({})) as NodeTypeProps[];
    console.log(res);
    if (res) {
      const filterData = res.filter((item) => item.typeCode !== 'node_calendar');
      setTypeOptions(filterData);
    }
  };

  // 获取列表数据
  const getList = async (params?: any) => {
    console.log(params);
    const pageNum = params?.pageNum || pagination.current;
    const pageSize = params?.pageSize || pagination.pageSize;
    const res = await getNodeList({ ...queryParams, ...params, pageNum, pageSize });
    console.log(res);
    if (res) {
      const { list, total } = res;
      setTableSource(list || []);
      setPagination((pagination) => ({ ...pagination, total, current: pageNum, pageSize }));
    }
  };

  useEffect(() => {
    getList();
    getTypeList();
  }, []);

  const onSearch = (values: QueryParamsType) => {
    console.log(values);
    setQueryParams(values);
    getList({ ...values, pageNum: 1 });
  };

  const onValuesChange = (changeValue: any, values: QueryParamsType) => {
    setQueryParams(values);
  };

  const paginationChange = (pageNum: number, pageSize?: number) => {
    console.log(pageNum, pageSize);

    getList({ pageNum, pageSize });
  };

  const deleteNodeItem = async (nodeId: string, index: number) => {
    const res = await deleteNode({ nodeId });
    if (res) {
      const copyList = [...tableSource];
      copyList.splice(index, 1);
      if (copyList.length > 0) {
        setTableSource(copyList);
        setPagination((pagination) => ({ ...pagination, total: pagination.total! - 1 }));
      } else {
        const pageNum = pagination.current! - 1 || 1;
        getList({ pageNum });
      }
      message.success('删除成功');
    }
  };

  // 创建节点
  const createNode = async (values: any) => {
    const params = {
      nodeDesc: values.nodeDesc,
      nodeName:
        values.nodeTypeCode === 'node_date'
          ? values.nodeDateName
          : values.nodeTypeCode === 'node_tag'
            ? values.nodeTagName?.groupName
            : '',
      nodeTypeCode: values.nodeTypeCode
    };
    const res = await addNode(params);
    setVisibleCreateNode(false);
    if (res) {
      message.success('添加成功');
      getList({ pageNum: 1 });
    }
  };
  return (
    <div className="container">
      <Button
        type="primary"
        shape="round"
        icon={<PlusOutlined />}
        onClick={() => setVisibleCreateNode(true)}
        size="large"
      >
        新建节点
      </Button>
      <NgFormSearch
        className="mt20"
        searchCols={searchColsFun(typeOptions)}
        onSearch={onSearch}
        onValuesChange={onValuesChange}
      />

      <div className="mt20">
        <NgTable
          columns={tableColumnsFun({
            onOperate: deleteNodeItem
          })}
          dataSource={tableSource}
          pagination={pagination}
          paginationChange={paginationChange}
          setRowKey={(record: NodeColumns) => {
            return record.nodeId;
          }}
        />
      </div>

      <CreateNodeModal
        visible={visibleCreateNode}
        onCancel={() => setVisibleCreateNode(false)}
        onSubmit={createNode}
        options={typeOptions}
      />
    </div>
  );
};

export default TaskNodeList;
