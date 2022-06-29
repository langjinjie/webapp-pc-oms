import { PaginationProps } from 'antd';
import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { getSceneList } from 'src/apis/task';
import { NgFormSearch, NgTable } from 'src/components';
import { SceneColumns, searchCols, tableColumnsFun } from './ListConfig';

const TaskSceneList: React.FC<RouteComponentProps> = ({ history }) => {
  const [tableSource] = useState<Partial<SceneColumns>[]>([
    {
      sceneId: '1212121',
      sceneCode: 'SCENE_CODE121',
      sceneName: 'DEMO 数据'
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
  const getList = async () => {
    const res = await getSceneList({});
    console.log(res);
  };

  const onSearch = (values: any) => {
    console.log(values);
    getList({
      ...values
    });
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
      <NgFormSearch
        searchCols={searchCols}
        isInline
        firstRowChildCount={3}
        onSearch={onSearch}
        onValuesChange={onValuesChange}
      ></NgFormSearch>

      <div className="mt20">
        <NgTable
          columns={tableColumnsFun({
            onOperate: () => jumpToDetail()
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
