import React, { useEffect, useState } from 'react';
import { Button, ConfigProvider, Empty, message } from 'antd';
import { PaginationProps } from 'antd/es/pagination';
import { RouteComponentProps } from 'react-router-dom';
import { AuthBtn, NgFormSearch, NgTable } from 'src/components';
import { searchCols, tableColumnsFun, StrategyTaskProps } from './Config';
import { changeStatusCorpTpl, getTaskListOfCorp } from 'src/apis/task';
import { OperateType } from 'src/utils/interface';
import OffLineModal from '../../StrategyTask/components/OffLineModal/OffLineModal';
import { useDidRecover } from 'react-router-cache-route';
import { useDocumentTitle } from 'src/utils/base';
type QueryParamsType = Partial<{
  nodeCode: string;
  nodeName: string;
  nodeTypeCode: string;
}>;
const StrategyManageList: React.FC<RouteComponentProps> = ({ history }) => {
  const [visible, setVisible] = useState(false);
  const [tableSource, setTableSource] = useState<StrategyTaskProps[]>([]);
  const [queryParams, setQueryParams] = useState<QueryParamsType>();
  const [current, setCurrent] = useState<StrategyTaskProps>();
  useDocumentTitle('智能运营-策略管理');
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
    const res = await getTaskListOfCorp({ ...queryParams, ...params, pageNum, pageSize });
    if (res) {
      const { list, total } = res;
      setTableSource(list || []);
      setPagination((pagination) => ({ ...pagination, total, current: pageNum, pageSize }));
    }
  };

  useEffect(() => {
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

  const onOperate = (corpTplId: string, operateType: OperateType) => {
    if (operateType === 'view') {
      history.push('/strategyManage/detail?corpTplId=' + corpTplId + '&view=1');
    } else if (operateType === 'edit') {
      history.push('/strategyManage/detail?corpTplId=' + corpTplId);
    } else if (operateType === 'putAway' || operateType === 'outline') {
      setVisible(true);
      const currentItem = tableSource.filter((item) => item.corpTplId === corpTplId)[0];
      setCurrent(currentItem);
    }
  };

  // 监听页面是否需要刷新
  useDidRecover(() => {
    if (window.location.href.indexOf('pageNum') > 0) {
      onSearch({});
      history.replace('/strategyManage', {});
    } else if (window.location.href.indexOf('refresh') > 0) {
      getList();
      history.replace('/strategyManage', {});
    }
  });

  const upOrOffLine = async () => {
    const res = await changeStatusCorpTpl({ corpTplId: current?.corpTplId, status: current?.status === 0 ? 1 : 0 });
    if (res) {
      message.success('操作成功');
      const copyData = [...tableSource];
      copyData.map((item) => {
        if (item.corpTplId === current?.corpTplId) {
          item.status = current?.status === 0 ? 1 : 0;
        }
        return item;
      });
      setTableSource(copyData);
    }
    setVisible(false);
  };
  return (
    <div>
      <div className="container">
        <div className="search-wrap">
          <AuthBtn path="/add">
            <Button
              type="primary"
              shape="round"
              ghost
              onClick={() => history.push('/strategyManage/tmpList')}
              size="large"
            >
              策略模板库
            </Button>
          </AuthBtn>
          <div className={'pt20'}>
            <AuthBtn path="/query">
              <NgFormSearch
                isInline
                firstRowChildCount={3}
                searchCols={searchCols}
                onSearch={onSearch}
                onValuesChange={onValuesChange}
              />
            </AuthBtn>
          </div>

          <div className="mt20">
            <ConfigProvider
              renderEmpty={() => (
                <Empty
                  imageStyle={{
                    height: 60
                  }}
                  description={<span>暂无数据，去策略模板库启用数据</span>}
                ></Empty>
              )}
            >
              <NgTable
                columns={tableColumnsFun({
                  onOperate
                })}
                dataSource={tableSource}
                pagination={pagination}
                paginationChange={paginationChange}
                setRowKey={(record: StrategyTaskProps) => {
                  return record.corpTplId;
                }}
              />
            </ConfigProvider>
          </div>
        </div>
      </div>

      <OffLineModal
        visible={visible}
        content={current?.status === 0 ? '确定要上架吗' : '确定下架'}
        onCancel={() => setVisible(false)}
        onOK={upOrOffLine}
      />
    </div>
  );
};

export default StrategyManageList;
