/**
 * @desc 在职分配
 */
import React, { useEffect, useState } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Card, PaginationProps, Popover, Button, message } from 'antd';
import { AuthBtn, NgFormSearch, NgTable } from 'src/components';
import { searchCols, IClientColumns, tableColumnsFun } from './Config';
import { useHistory } from 'react-router-dom';
import { DistributionModal } from 'src/pages/StaffManage/components';
import { IdistributionParam } from 'src/pages/StaffManage/components/DistributionModal/DistributionModal';
import {
  requestGetAssignReasonList,
  requestGetTransferClientList,
  requestGetDimissionTransferList,
  requestSyncTransferClientList,
  requestAssignClientTransfer,
  requestDimissionClientTransfer
} from 'src/apis/roleMange';
import style from './style.module.less';
import classNames from 'classnames';

interface IDistributeListProps {
  distributeLisType: 1 | 2; // 1: 在职继承 2: 离职继承
}

const DistributeList: React.FC<IDistributeListProps> = ({ distributeLisType }) => {
  const [reasonCodeList, setReasonCodeList] = useState<{ id: string; name: string }[]>([]);
  const [distributionVisible, setDistribution] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRowList, setselectedRowList] = useState<IClientColumns[]>([]);
  const [formValue, setFormValue] = useState<{ [key: string]: any }>();
  const [syncLoading, setSyncLoading] = useState(false);
  const [resultId, setResultId] = useState('');
  const [tableSource, setTableSource] = useState<{ total: number; list: IClientColumns[] }>({
    total: 0,
    list: []
  });
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10
  });

  const history = useHistory();

  // 获取待分配客户列表
  const getList = async (param?: { [key: string]: any }) => {
    setLoading(true);
    let res;
    if (distributeLisType === 1) {
      res = await requestGetTransferClientList({ ...param });
    } else {
      res = await requestGetDimissionTransferList({ ...param });
    }
    if (res) {
      const { pageNum } = param || {};
      console.log('pageNum', pageNum);
      if (!pageNum || pageNum === 1) {
        setResultId(res.resultId);
      }
      setTableSource({ total: res.total, list: res.list });
    }
    setLoading(false);
  };

  const onSearch = (values?: { [key: string]: any }) => {
    delete values?.beginTime;
    delete values?.endTime;
    setPagination((pagination) => ({ ...pagination, current: 1 }));
    const { staffList, filterTag, addTime, takeoverTime } = values || {};
    let addBeginTime = '';
    let addEndTime = '';
    if (addTime) {
      addBeginTime = addTime[0].startOf('days').format('YYYY-MM-DD HH:mm:ss');
      addEndTime = addTime[1].endOf('days').format('YYYY-MM-DD HH:mm:ss');
      delete values?.addTime;
    }
    let takeoverBeginTime = '';
    let takeoverEndTime = '';
    if (takeoverTime) {
      takeoverBeginTime = takeoverTime[0].startOf('days').format('YYYY-MM-DD HH:mm:ss');
      takeoverEndTime = takeoverTime[1].endOf('days').format('YYYY-MM-DD HH:mm:ss');
      delete values?.takeoverTime;
    }
    setFormValue({
      ...values,
      staffList: staffList?.map(({ staffId }: { staffId: string }) => ({ staffId })),
      filterTag:
        filterTag && filterTag.tagList.length
          ? {
              logicType: filterTag.logicType,
              tagList: filterTag.tagList?.map(({ tagId, groupId }: { tagId: string; groupId: string }) => ({
                tagId,
                groupId
              }))
            }
          : undefined,
      addBeginTime,
      addEndTime,
      takeoverBeginTime,
      takeoverEndTime
    });
    getList({
      pageNum: 1,
      ...values,
      staffList: staffList?.map(({ staffId }: { staffId: string }) => ({ staffId })),
      filterTag:
        filterTag && filterTag.tagList.length
          ? {
              logicType: filterTag.logicType,
              tagList: filterTag.tagList?.map(({ tagId, groupId }: { tagId: string; groupId: string }) => ({
                tagId,
                groupId
              }))
            }
          : undefined,
      addBeginTime,
      addEndTime,
      takeoverBeginTime,
      takeoverEndTime
    });
  };

  // 重置
  const onReset = () => {
    onSearch({});
    setPagination(() => ({ current: 1, pageSize: 10 }));
    setselectedRowList([]);
  };

  const paginationChange = (pageNum: number, pageSize?: number) => {
    setPagination((pagination) => ({
      ...pagination,
      current: pageSize !== pagination.pageSize ? 1 : pageNum,
      pageSize: pageSize as number
    }));
    const newPageNum = pageSize !== pagination.pageSize ? 1 : pageNum;
    const newResultId = newPageNum === 1 ? undefined : resultId;
    getList({ ...formValue, pageNum: newPageNum, pageSize: pageSize as number, resultId: newResultId });
  };

  // 获取分配原因配置值
  const getReasonCodeListHandle = async () => {
    const res = await requestGetAssignReasonList({ queryType: distributeLisType });
    if (res) {
      const reasonCodeList = res.list.map((mapItem: { reasonCode: string; reasonName: string }) => ({
        id: mapItem.reasonCode,
        name: mapItem.reasonName
      }));
      setReasonCodeList(reasonCodeList);
    }
  };

  // 选择框配置对象
  const rowSelection = {
    selectedRowKeys: selectedRowList.map(
      ({ externalUserid, staffId }: IClientColumns) => externalUserid + '-' + staffId
    ),
    onChange: (_: React.Key[], selectedRows: IClientColumns[]) => {
      const currentPageKeys = tableSource.list.map(({ externalUserid, staffId }) => externalUserid + '-' + staffId);
      // 非本页的数据
      const noCurrentRowList = selectedRowList.filter(
        ({ externalUserid, staffId }) => !currentPageKeys.includes(externalUserid + '-' + staffId)
      );
      setselectedRowList([...noCurrentRowList, ...selectedRows]);
    },
    getCheckboxProps: (record: IClientColumns) => {
      return {
        disabled: [1, 4].includes(record.transferStatus),
        name: ''
      };
    }
  };

  // 分配客户
  const distributionHandle = () => {
    setDistribution(true);
  };

  // 分配记录
  const recordListHandle = () => {
    if (distributeLisType === 2) {
      history.push('/resign/record');
    } else {
      history.push('/onjob/record');
    }
  };

  // 同步离职客户列表
  const syncList = async () => {
    setSyncLoading(true);
    const res = await requestSyncTransferClientList();
    if (res) {
      await getList({ ...formValue, pageNum: pagination.current, pageSize: pagination.pageSize });
      message.success('同步成功');
    }
    setSyncLoading(false);
  };

  // 确认分配转接
  const onDistriOk = async (param?: IdistributionParam) => {
    let res = '';
    if (distributeLisType === 1) {
      res = await requestAssignClientTransfer({
        ...param,
        list: selectedRowList.map(({ externalUserid, staffId }) => ({ externalUserid, staffId }))
      });
    } else {
      res = await requestDimissionClientTransfer({
        ...param,
        list: selectedRowList.map(({ externalUserid, staffId }) => ({ externalUserid, staffId }))
      });
    }
    if (res) {
      message.success('客户转接成功，如客户无拒绝则24小时后客户自动转接生效');
      await getList({ ...formValue, pageNum: pagination.current, pageSize: pagination.pageSize });
      setselectedRowList([]);
    }
  };

  const CardTitle = () => {
    const content = (
      <>
        <p>1.客户继承成功后原员工无法再与客户发起会话</p>
        <p>2.客户继承成功后90天内最多可支持二次继承</p>
      </>
    );
    return (
      <div>
        {distributeLisType === 2 ? '离职继承' : '在职继承'}
        <Popover content={content}>
          <QuestionCircleOutlined className="color-text-secondary f16 pointer" />
        </Popover>
      </div>
    );
  };
  useEffect(() => {
    getReasonCodeListHandle();
    getList();
  }, []);
  return (
    <Card className="container" title={<CardTitle />} bordered={false}>
      <AuthBtn path="/query">
        <NgFormSearch
          searchCols={searchCols(reasonCodeList, distributeLisType)}
          isInline={false}
          firstRowChildCount={4}
          onSearch={onSearch}
          onReset={onReset}
        />
      </AuthBtn>
      <div className={'mt20'}>
        <AuthBtn path="/assign">
          <Button
            className={style.distribution}
            disabled={!selectedRowList.length}
            type="primary"
            onClick={distributionHandle}
          >
            分配客户
          </Button>
        </AuthBtn>
        <AuthBtn path="/record">
          <Button className={classNames(style.distributeLog, 'ml20')} onClick={recordListHandle}>
            分配记录
          </Button>
        </AuthBtn>

        {distributeLisType === 2 && (
          <Button className={classNames(style.sync, 'ml20')} onClick={syncList} loading={syncLoading}>
            同步
          </Button>
        )}
        <AuthBtn path="assign">
          <span className={classNames(style.selectNum, 'inline-block')}>
            *共计{tableSource.total}位待分配客户，
            <span className={style.selected}>已选择{selectedRowList.length}位</span>
          </span>
        </AuthBtn>
      </div>
      <div className="mt20">
        <NgTable
          dataSource={tableSource.list || []}
          scroll={{ x: 'max-content' }}
          paginationChange={paginationChange}
          rowSelection={rowSelection}
          loading={loading}
          columns={tableColumnsFun({
            distributeLisType
          })}
          pagination={{
            total: tableSource.total,
            current: pagination.current,
            pageSize: pagination.pageSize
          }}
          setRowKey={(record: IClientColumns) => {
            return record.externalUserid + '-' + record.staffId;
          }}
        />
      </div>
      <DistributionModal
        value={selectedRowList}
        distributeLisType={distributeLisType}
        reasonNameList={reasonCodeList}
        visible={distributionVisible}
        onClose={() => setDistribution(false)}
        onOk={onDistriOk}
      />
    </Card>
  );
};

export default DistributeList;
