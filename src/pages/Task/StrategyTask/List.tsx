import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { PaginationProps } from 'antd/es/pagination';
import React, { useEffect, useState } from 'react';
import { useDidRecover } from 'react-router-cache-route';
import { RouteComponentProps } from 'react-router-dom';
import { editTplDisplay, getTaskStrategyTplList, offLineTaskTpl, onLineTaskTplWithCorps } from 'src/apis/task';
import { AuthBtn, NgFormSearch, NgTable } from 'src/components';
import { OnlineModal } from 'src/pages/Marketing/Components/OnlineModal/OnlineModal';
import { OperateType } from 'src/utils/interface';
import OffLineModal from './components/OffLineModal/OffLineModal';
import { TelDisplaySetModal } from './components/TelDisplaySetModal/TelDisplaySetModal';
import { searchCols, tableColumnsFun, StrategyTaskProps } from './ListConfig';

const StrategyTaskList: React.FC<RouteComponentProps> = ({ history }) => {
  const [visibleOnlineModal, setVisibleOnlineModal] = useState(false);
  const [visibleOfflineModal, setVisibleOfflineModal] = useState(false);
  const [visibleDisplayModal, setVisibleDisplayModal] = useState(false);
  const [dataSource, setDataSource] = useState<Partial<StrategyTaskProps>[]>([]);
  const [currentTpl, setCurrentTpl] = useState<StrategyTaskProps>();
  const [queryParams, setQueryParams] = useState({});
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });

  const getTplList = async (params?: any) => {
    const pageNum = params?.pageNum || pagination.current;
    const pageSize = params?.pageSize || pagination.pageSize;
    const res = await getTaskStrategyTplList({
      ...queryParams,
      ...params,
      pageNum,
      pageSize
    });
    if (res) {
      const { list, total } = res;
      setDataSource(list || []);
      setPagination((pagination) => ({ ...pagination, total, current: pageNum, pageSize }));
    }
  };

  useEffect(() => {
    getTplList();
  }, []);
  const onSearch = (values: any) => {
    const { tplCode = '', tplName = '' } = values;
    getTplList({ tplCode, tplName, pageNum: 1 });
    setQueryParams({ tplCode, tplName });
  };
  // 监听页面是否需要刷新
  useDidRecover(() => {
    if (window.location.href.indexOf('pageNum') > 0) {
      onSearch({});
      history.replace('/strategyTask', {});
    } else if (window.location.href.indexOf('refresh') > 0) {
      getTplList();
      history.replace('/strategyTask', {});
    }
  });
  const onValuesChange = (changeValues: any, values: any) => {
    setQueryParams(values);
  };

  const paginationChange = (pageNum: number, pageSize?: number) => {
    getTplList({ pageNum, pageSize });
  };

  const onOperate = (operateType: OperateType, record: StrategyTaskProps) => {
    setCurrentTpl(record);
    if (operateType === 'putAway') {
      // if (!record.displayCoverImg) {
      //   return message.warning('请先配置展示信息后再进行上架');
      // }
      setVisibleOnlineModal(true);
    } else if (operateType === 'outline') {
      setVisibleOfflineModal(true);
    } else if (operateType === 'other') {
      setVisibleDisplayModal(true);
    } else if (operateType === 'view') {
      history.push('/strategyTask/edit?tplId=' + record.tplId + '&view=1');
    } else if (operateType === 'edit') {
      history.push('/strategyTask/edit?tplId=' + record.tplId);
    }
  };
  // 确定上架
  const putAway = async (values: any[]) => {
    setVisibleOnlineModal(false);
    const postData = {
      tplId: currentTpl?.tplId as string,
      onlineCorps: values.map((item) => ({ onlineCorpId: item }))
    };
    const res = await onLineTaskTplWithCorps(postData);
    if (res) {
      message.success('上架成功！');
      getTplList({ pageNum: 1 });
    }
  };
  // 下线模块
  const offLine = async () => {
    setVisibleOfflineModal(false);
    const res = await offLineTaskTpl({ tplId: currentTpl?.tplId as string });
    const currentIndex = dataSource.findIndex((item) => item.tplId === currentTpl?.tplId);
    const copyData = [...dataSource];
    copyData.splice(currentIndex, 1, { ...currentTpl, status: 0 });
    setDataSource(copyData);
    if (res) {
      message.success('下架成功操作成功');
    }
  };
  // 设置模板展示信息
  const setDisplayInfo = async (values: any) => {
    setVisibleDisplayModal(false);
    const res = await editTplDisplay({
      tplId: currentTpl?.tplId as string,
      ...values
    });
    if (res) {
      message.success('设置成功');
    }
  };

  return (
    <div className="container">
      <div className="search-wrap">
        <AuthBtn path="/add">
          <Button
            type="primary"
            shape="round"
            icon={<PlusOutlined />}
            onClick={() => history.push('/strategyTask/edit')}
            size="large"
          >
            新增策略运营模版
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
          <NgTable
            columns={tableColumnsFun({
              onOperate
            })}
            dataSource={dataSource}
            pagination={pagination}
            paginationChange={paginationChange}
            setRowKey={(record: StrategyTaskProps) => {
              return record.tplId + record.tplCode;
            }}
          />
        </div>
      </div>

      <OnlineModal onOk={putAway} visible={visibleOnlineModal} onCancel={() => setVisibleOnlineModal(false)} />
      <OffLineModal visible={visibleOfflineModal} onCancel={() => setVisibleOfflineModal(false)} onOK={offLine} />
      <TelDisplaySetModal
        values={currentTpl}
        visible={visibleDisplayModal}
        onCancel={() => setVisibleDisplayModal(false)}
        onOk={setDisplayInfo}
      />
    </div>
  );
};

export default StrategyTaskList;
