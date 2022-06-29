import { PlusOutlined } from '@ant-design/icons';
import { Button, PaginationProps } from 'antd';
import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { NgFormSearch, NgTable } from 'src/components';
import { CreateNodeModal } from './components/CrateNodeModal';
import { NodeColumns, searchCols, tableColumnsFun } from './ListConfig';

const TaskNodeList: React.FC<RouteComponentProps> = ({ history }) => {
  const [visibleCreateNode, setVisibleCreateNode] = useState(false);
  const [tableSource] = useState<Partial<NodeColumns>[]>([
    {
      nodeId: 'SCENE_CODE121',
      nodeName: 'DEMO 数据'
    }
  ]);
  const [pagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });

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
      <NgFormSearch className="mt20" searchCols={searchCols} onSearch={onSearch} onValuesChange={onValuesChange} />

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

      <CreateNodeModal visible={visibleCreateNode} onCancel={() => setVisibleCreateNode(false)} />
    </div>
  );
};

export default TaskNodeList;
