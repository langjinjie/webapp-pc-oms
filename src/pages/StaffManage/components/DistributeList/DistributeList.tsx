/**
 * @desc 在职分配
 */
import React, { useEffect, useState } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Card, PaginationProps, Popover, Button } from 'antd';
import { NgFormSearch, NgTable } from 'src/components';
import { searchCols, StaffColumns, tableColumnsFun } from './Config';
import { useHistory } from 'react-router-dom';
import { DistributionClient } from 'src/pages/StaffManage/components';
import style from './style.module.less';
import classNames from 'classnames';

interface IDistributeListProps {
  distributeLisType: 0 | 1; // 0: 在职继承 1: 离职继承
}

const DistributeList: React.FC<IDistributeListProps> = ({ distributeLisType }) => {
  const [tableSource, setTableSource] = useState<Partial<StaffColumns>[]>([]);
  const [reasonCodeList, setReasonCodeList] = useState<{ id: string; name: string }[]>([]);
  const [distributionVisible, setDistribution] = useState(false);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });

  const history = useHistory();

  const onSearch = (value?: any) => {
    console.log('value', value);
  };

  const jumpToDetail = () => {
    history.push('/onjob/client');
  };

  const paginationChange = (pageSize: number) => {
    console.log();
    setPagination((pagination) => ({ ...pagination, pageSize }));
  };

  // 获取分配原因配置值
  const getReasonCodeListHandle = () => {
    setTimeout(() => {
      const reasonCodeList = [
        { reasonCode: 'reason_list_adjust', reasonName: '名单调整' },
        { reasonCode: 'reason_long_sick', reasonName: '长病假' },
        { reasonCode: 'reason_dimission', reasonName: '离职' },
        { reasonCode: 'reason_team_adjust', reasonName: '团队调整' },
        { reasonCode: 'reason_unsettled', reasonName: '临到期未成交' },
        { reasonCode: 'reason_cross_dialing', reasonName: '交叉拨打' },
        { reasonCode: 'reason_other', reasonName: '其他' }
      ].map((mapItem) => ({ id: mapItem.reasonCode, name: mapItem.reasonName }));
      setReasonCodeList(reasonCodeList);
    }, 500);
  };

  // 选择框配置对象
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: Partial<StaffColumns>[]) => {
      console.log('selectedRowKeys', selectedRowKeys);
      console.log('selectedRows', selectedRows);
    }
  };

  // 分配客户
  const distributionHandle = () => {
    setDistribution(true);
  };

  // 分配记录
  const recordListHandle = () => {
    if (distributeLisType) {
      history.push('/resign/record');
    } else {
      history.push('/onjob/record');
    }
  };

  const CardTitle = () => {
    const content = (
      <>
        <p>1.客户继承成功后原员工无法再与客户间发起会话</p>
        <p>2.客户继承成功后90天内最多可支持二次继承</p>
      </>
    );
    return (
      <div>
        {distributeLisType ? '离职继承' : '在职继承'}
        <Popover content={content}>
          <QuestionCircleOutlined className="color-text-secondary f16 pointer" />
        </Popover>
      </div>
    );
  };
  useEffect(() => {
    getReasonCodeListHandle();
    setTableSource([
      {
        key1: '李思思',
        key2: '非车险拓客组',
        key3: '12',
        key4: '是'
      },
      {
        key1: '颜武晨',
        key2: '非车险拓客组',
        key3: '10',
        key4: '是'
      },
      {
        key1: '陶黛晓',
        key2: '非车险拓客组',
        key3: '3',
        key4: '是'
      }
    ]);
  }, []);
  return (
    <Card className="container" title={<CardTitle />} bordered={false}>
      {/* {reasonCodeList && ( */}
      <NgFormSearch
        searchCols={searchCols(reasonCodeList, distributeLisType)}
        isInline={false}
        firstRowChildCount={4}
        onSearch={onSearch}
      />
      {/* )} */}
      <div className={'mt20'}>
        <Button className={style.distribution} type="primary" onClick={distributionHandle}>
          分配客户
        </Button>
        <Button className={classNames(style.distributeLog, 'ml20')} onClick={recordListHandle}>
          分配记录
        </Button>
        <span className={classNames(style.selectNum, 'inline-block')}>
          *共计5000位待分配客户，<span className={style.selected}>已选择54位</span>
        </span>
      </div>
      <div className="mt20">
        <NgTable
          columns={tableColumnsFun({
            onOperate: () => jumpToDetail(),
            distributeLisType
          })}
          dataSource={tableSource}
          pagination={pagination}
          paginationChange={paginationChange}
          rowSelection={rowSelection}
          setRowKey={(record: StaffColumns) => {
            return record.key1;
          }}
        />
      </div>
      <DistributionClient
        reasonNameList={reasonCodeList}
        visible={distributionVisible}
        onClose={() => setDistribution(false)}
      />
    </Card>
  );
};

export default DistributeList;
