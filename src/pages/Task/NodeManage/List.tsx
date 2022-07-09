import { PlusOutlined } from '@ant-design/icons';
import { Button, PaginationProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { getNodeList, getNodeTypeList } from 'src/apis/task';
import { NgFormSearch, NgTable } from 'src/components';
import { CreateNodeModal, NodeTypeProps } from './components/CrateNodeModal';
import TagFilterComponents from './components/TagModal/TagFilterComponent';

import { NodeColumns, searchColsFun, tableColumnsFun } from './ListConfig';

const TaskNodeList: React.FC<RouteComponentProps> = ({ history }) => {
  const [visibleCreateNode, setVisibleCreateNode] = useState(false);

  const [typeOptions, setTypeOptions] = useState<NodeTypeProps[]>([]);
  const [tableSource, setTableSource] = useState<Partial<NodeColumns>[]>([]);
  const [pagination] = useState<PaginationProps>({
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
  const getList = async () => {
    const res = await getNodeList({});
    console.log(res);
    if (res) {
      const { list } = res;
      setTableSource(list || []);
    }
  };

  useEffect(() => {
    getList();
    getTypeList();
  }, []);

  const onSearch = (values: any) => {
    console.log(values);
  };

  const onValuesChange = () => {
    console.log('onValuesChange');
  };

  const paginationChange = () => {
    console.log();
  };

  const jumpToDetail = () => {
    history.push('/taskScene/detail');
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
            onOperate: () => jumpToDetail()
          })}
          dataSource={tableSource}
          pagination={pagination}
          paginationChange={paginationChange}
          setRowKey={(record: NodeColumns) => {
            return record.nodeId;
          }}
        />
      </div>

      <CreateNodeModal visible={visibleCreateNode} onCancel={() => setVisibleCreateNode(false)} options={typeOptions} />

      <TagFilterComponents />
    </div>
  );
};

export default TaskNodeList;
