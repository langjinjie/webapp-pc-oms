import React, { useEffect, useState } from 'react';
import { actionSearchCols, actionTableColumnsFun, ActionRuleColumns } from './ListConfig';
import { AuthBtn, NgFormSearch, NgTable } from 'src/components';
import { PaginationProps } from 'antd/es/pagination';
import { getActionRuleDetail, getActionRuleList } from 'src/apis/task';
import RuleActionSetModal from '../../StrategyTask/components/RuleActionSetModal/RuleActionSetModal';

type QueryParamsType = {};
export const ActionList: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [currentValue, setCurrentValue] = useState<any>();
  const [queryParams, setQueryParams] = useState<QueryParamsType>();
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });
  const [tableSource, setTableSource] = useState<Partial<ActionRuleColumns>[]>([]);

  // 获取列表数据
  const getList = async (params?: any) => {
    const pageNum = params?.pageNum || pagination.current;
    const pageSize = params?.pageSize || pagination.pageSize;
    const res = await getActionRuleList({ ...queryParams, ...params, pageNum, pageSize });
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
    setQueryParams(values);
    getList({ ...values, pageNum: 1 });
  };
  const onValuesChange = (changeValues: any, values: any) => {
    setQueryParams(values);
  };

  const paginationChange = (pageNum: number, pageSize?: number) => {
    getList({ pageNum, pageSize });
  };

  const showDetail = async (actionRuleId: string) => {
    const res = await getActionRuleDetail({ actionRuleId });
    if (res) {
      setCurrentValue(res);
    }

    setVisible(true);
  };
  return (
    <div className="search-wrap">
      <div className={'pt20'}>
        <AuthBtn path="/queryAction">
          <NgFormSearch isInline searchCols={actionSearchCols} onSearch={onSearch} onValuesChange={onValuesChange} />
        </AuthBtn>
      </div>
      <div className="mt20">
        <NgTable
          columns={actionTableColumnsFun({
            onOperate: showDetail
          })}
          dataSource={tableSource}
          pagination={pagination}
          paginationChange={paginationChange}
          setRowKey={(record: ActionRuleColumns) => {
            return record.actionRuleId;
          }}
        />
      </div>
      <RuleActionSetModal
        visible={visible}
        value={currentValue}
        hideBtn
        onCancel={() => setVisible(false)}
        footer={null}
      ></RuleActionSetModal>
    </div>
  );
};
