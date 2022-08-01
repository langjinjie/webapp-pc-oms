import { PlusOutlined } from '@ant-design/icons';
import { Button, message, PaginationProps } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { addNode, deleteNode, getNodeList, getNodeTypeList } from 'src/apis/task';
import { AuthBtn, NgFormSearch, NgTable } from 'src/components';
import { CreateNodeModal, NodeTypeProps } from './components/CrateNodeModal';

import { NodeColumns, searchColsFun, tableColumnsFun } from './ListConfig';
import { Context } from 'src/store/index';
import { useDocumentTitle } from 'src/utils/base';

type QueryParamsType = Partial<{
  nodeCode: string;
  nodeName: string;
  nodeName1?: string;
  nodeTypeCode: string;
}>;
const TaskNodeList: React.FC = () => {
  useDocumentTitle('智能运营-节点管理');
  const [visibleCreateNode, setVisibleCreateNode] = useState(false);
  const { nodeOptions, setNodeOptions } = useContext(Context);

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
    if (nodeOptions.length > 0) return;

    const res = (await getNodeTypeList({})) as NodeTypeProps[];
    if (res) {
      setNodeOptions(res);
    }
  };

  // 获取列表数据
  const getList = async (params?: any) => {
    const pageNum = params?.pageNum || pagination.current;
    const pageSize = params?.pageSize || pagination.pageSize;
    const res = await getNodeList({ ...queryParams, ...params, pageNum, pageSize });
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

  const onSearch = ({ nodeName1: nodeName, ...values }: QueryParamsType) => {
    setQueryParams({ ...values, nodeName });
    getList({ ...values, nodeName, pageNum: 1 });
  };

  const onValuesChange = (changeValue: any, { nodeName1: nodeName, ...values }: QueryParamsType) => {
    setQueryParams({ ...values, nodeName });
  };

  const paginationChange = (pageNum: number, pageSize?: number) => {
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
            : values.nodeTypeCode === 'node_quota'
              ? values.nodeQuotaName?.[1]
              : '',
      nodeTypeCode: values.nodeTypeCode
    };
    const res = await addNode(params);
    if (res) {
      message.success('添加成功');
      setVisibleCreateNode(false);
      getList({ pageNum: 1 });
    }
  };
  return (
    <div className="container">
      <AuthBtn path="/create">
        <Button
          type="primary"
          shape="round"
          icon={<PlusOutlined />}
          onClick={() => setVisibleCreateNode(true)}
          size="large"
        >
          新建节点
        </Button>
      </AuthBtn>
      <AuthBtn path="/query">
        <NgFormSearch
          className="mt20"
          searchCols={searchColsFun(nodeOptions)}
          onSearch={onSearch}
          onValuesChange={onValuesChange}
        />
      </AuthBtn>

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
        options={nodeOptions.filter((item: any) => item.typeCode !== 'node_calendar')}
      />
    </div>
  );
};

export default TaskNodeList;
