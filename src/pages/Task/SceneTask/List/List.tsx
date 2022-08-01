import { Form, PaginationProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { getNodeList, getSceneList } from 'src/apis/task';
import { NgFormSearch, NgTable } from 'src/components';
import DebounceSelect from 'src/components/DebounceSelect/DebounceSelect';
import { SceneColumns, searchCols, tableColumnsFun } from './ListConfig';

const TaskSceneList: React.FC<RouteComponentProps> = ({ history }) => {
  const [tableSource, setTableSource] = useState<Partial<SceneColumns>[]>([]);
  const [queryParams, setQueryParams] = useState<any>();
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });
  const getList = async (params?: any) => {
    const pageNum = params?.pageNum || pagination.current;
    const pageSize = params?.pageSize || pagination.pageSize;
    const res = await getSceneList({
      ...queryParams,
      ...params,
      pageNum,
      pageSize
    });
    if (res) {
      const { list, total } = res;
      setTableSource(list);
      setPagination((pagination) => ({ ...pagination, total }));
    }
    console.log(res);
  };

  useEffect(() => {
    getList();
  }, []);

  const onSearch = (values: any) => {
    const { node, ...others } = values;
    getList({
      nodeId: node?.value || '',
      ...others,
      pageNum: 1
    });
  };

  const onValuesChange = (changeValues: any, values: any) => {
    const { node, ...others } = values;
    setQueryParams({ nodeId: node?.value || '', ...others });
  };

  const paginationChange = (pageNum: number, pageSize?: number) => {
    getList({ pageNum, pageSize });
  };

  // 查询场景详情
  const jumpToDetail = (sceneId: string) => {
    history.push('/taskScene/detail?sceneId=' + sceneId);
  };

  const fetchUserList = async (codeName: string): Promise<any[]> => {
    const res = await getNodeList({ nodeName: codeName });
    if (res) {
      const { list } = res;
      return list.map((item: any) => ({
        label: item.nodeName,
        value: item.nodeId,
        key: item.nodeId
      }));
    } else {
      return [];
    }
  };
  return (
    <div className="container">
      <NgFormSearch
        searchCols={searchCols}
        isInline
        firstRowChildCount={3}
        onSearch={onSearch}
        onValuesChange={onValuesChange}
      >
        <Form.Item label="场景关联节点" name={'node'}>
          <DebounceSelect placeholder="请输入" style={{ width: '180px' }} fetchOptions={fetchUserList} />
        </Form.Item>
      </NgFormSearch>

      <div className="mt20">
        <NgTable
          columns={tableColumnsFun({
            onOperate: jumpToDetail
          })}
          dataSource={tableSource}
          pagination={pagination}
          paginationChange={paginationChange}
          setRowKey={(record: SceneColumns) => {
            return record.sceneId;
          }}
        />
      </div>
    </div>
  );
};

export default TaskSceneList;
