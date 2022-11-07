import { PaginationProps, Divider, PageHeader } from 'antd';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { getSceneList } from 'src/apis/task';
import { AuthBtn, NgFormSearch, NgTable } from 'src/components';
import { useDocumentTitle } from 'src/utils/base';
import { SceneColumns, searchCols, tableColumnsFun } from './ListConfig';
// import style from './style.module.less';
const TaskSceneList: React.FC<RouteComponentProps> = ({ history }) => {
  const [tableSource, setTableSource] = useState<Partial<SceneColumns>[]>([]);
  const [queryParams, setQueryParams] = useState<any>();
  useDocumentTitle('智能运营-场景管理');
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
      setPagination((pagination) => ({ ...pagination, total, current: pageNum, pageSize }));
    }
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
    setQueryParams({ nodeId: node?.value || '', ...others });
  };

  // 重置无法触发该方法
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

  return (
    <div className={'container'}>
      <PageHeader title="聊天记查询" style={{ padding: '0' }}></PageHeader>
      <Divider style={{ marginTop: '21px' }} />
      <AuthBtn path="/query">
        <NgFormSearch
          searchCols={searchCols}
          isInline
          firstRowChildCount={3}
          onSearch={onSearch}
          onValuesChange={onValuesChange}
        />
      </AuthBtn>

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
