import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useDidRecover } from 'react-router-cache-route';
import { PlusOutlined } from '@ant-design/icons';
import { AuthBtn, NgTable, NgFormSearch } from 'src/components';
import { Button, message, Modal, Space } from 'antd';
import classNames from 'classnames';

import style from './style.module.less';

import {
  activityList,
  activityManage,
  batchOperateActivity,
  setUserRightWithActivity,
  sortCancelTopAtActivity,
  sortTopAtActivity
} from 'src/apis/marketing';
import { SearchCols, columns, ActivityProps } from './Config';
import { useDocumentTitle } from 'src/utils/base';
import moment from 'moment';
import { PaginationProps } from '../Article/Config';
import { SetUserRight } from '../Components/ModalSetUserRight/SetUserRight';

// 状态

enum OperateTypes {
  '上架' = 1,
  '下架' = 2,
  '删除' = 3
}
const ActivityLibrary: React.FC<RouteComponentProps> = ({ history }) => {
  useDocumentTitle('营销素材-活动库');
  interface paramsType {
    activityName: String;
    status: String;
    pageNum: number;
    pageSize: number;
  }
  const [params, setParams] = useState<paramsType>({
    activityName: '',
    status: '',
    pageNum: 1,
    pageSize: 10
  });

  const [operationType, setOperationType] = useState<number | null>(null);
  const [selectedRowKeys, setSelectRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<ActivityProps[]>([]);

  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });

  const [currentItem, setCurrentItem] = useState<ActivityProps | null>();

  // 批量设置权限的状态
  const [selectRows, setSelectRows] = useState<ActivityProps[]>();
  const [visibleSetUserRight, setVisibleSetUserRight] = useState(false);
  const [isBatchSetRight, setIsBatchSetRight] = useState(false);
  const [currentGroupIds, setCurrentGroupIds] = useState<any[]>([]);

  // 查询活动列表
  const getList = async (queryParams: any) => {
    setOperationType(null);
    setSelectRowKeys([]);
    setLoading(true);
    const res: any = await activityList({ ...params, ...queryParams });
    setLoading(false);
    if (res) {
      setDataSource(res.list || []);

      setPagination((pagination) => ({ ...pagination, total: res.total }));
    }
  };

  // 监听页面是否需要刷新
  useDidRecover(() => {
    if (window.location.href.indexOf('pageNum') > 0) {
      setPagination((pagination) => ({ ...pagination, current: 1 }));
      getList({ pageNum: 1 });
      history.replace('/activityLibrary', {});
    }
  });

  // 查看
  const viewItem = (activityId: string) => {
    history.push('/marketingActivity/edit?activityId=' + activityId + '&isView=' + true);
  };

  // 显示配置可见范围模块
  const setRight = (record?: ActivityProps) => {
    if (record) {
      setIsBatchSetRight(false);
      setCurrentItem(record);
    } else {
      const mySet = new Set();
      selectRows?.forEach((item) => {
        mySet.add(item.groupId);
      });
      console.log(Array.from(mySet));
      setCurrentGroupIds(Array.from(mySet));
      setIsBatchSetRight(true);
    }
    setVisibleSetUserRight(true);
  };

  const handleOperate = async (operateType: number, activityId: string, index: number) => {
    // 获取操作类型
    const opreateTitle = OperateTypes[operateType];
    if (operateType === 0) {
      // 编辑
      history.push('/marketingActivity/edit?activityId=' + activityId);
    } else {
      const res = await activityManage({ activityId, type: operateType });
      if (res) {
        message.success(`${opreateTitle}成功！`);
        const copyData = [...dataSource];
        if (operateType === 1) {
          copyData[index].onlineTime = moment().format();
          copyData[index].status = 2;
          setDataSource(copyData);
        } else if (operateType === 2) {
          copyData[index].offlineTime = moment().format();
          copyData[index].status = 3;
          setDataSource(copyData);
        } else {
          copyData.splice(index, 1);
          if (copyData.length === 0) {
            getList({ pageNum: pagination.current - 1 || 1, pageSize: pagination.pageSize });
          }
          setPagination((pagination) => ({ ...pagination, total: pagination.total - 1 || 0 }));
          setDataSource(copyData);
        }
      }
    }
  };

  const addHandle = () => {
    history.push('/marketingActivity/edit');
  };

  // 点击查询按钮
  const onSearch = async (fieldsValue: any) => {
    const { activityName, status } = fieldsValue;
    setParams({
      ...params,
      status: status || null,
      activityName: activityName || null
    });
    setPagination({
      ...pagination,
      current: 1
    });
    getList({ pageNum: 1, activityName, status });
  };
  // 查询条件改变
  const onValuesChange = (changeValues: any, values: any) => {
    const { activityName, status } = values;
    setParams((params) => ({ ...params, status, activityName }));
  };

  const paginationChange = (page: number, pageSize?: number) => {
    setPagination((pagination) => {
      return {
        ...pagination,
        current: page,
        pageSize: pageSize || 10
      };
    });
    getList({ pageNum: page, pageSize });
  };

  useEffect(() => {
    getList({});
  }, []);

  const isDisabled = (operationType: number | null, status: number) => {
    let _isDisabled = false;
    if (operationType) {
      if (operationType === 1 && status === 2) {
        _isDisabled = true;
      } else if (operationType === 2 && (status === 1 || status === 3)) {
        _isDisabled = true;
      }
    }
    return _isDisabled;
  };

  const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: ActivityProps[]) => {
    setSelectRowKeys(selectedRowKeys);
    setSelectRows(selectedRows);
    const current = selectedRows[0];
    if (current) {
      if (current.status === 1 || current.status === 3) {
        setOperationType(1);
      } else {
        setOperationType(2);
      }
    } else {
      setOperationType(null);
    }
  };

  const handleSort = async (record: ActivityProps) => {
    let res: any;
    if (record.isTop === '1') {
      res = await sortCancelTopAtActivity({ activityId: record.activityId });
    } else {
      res = await sortTopAtActivity({ activityId: record.activityId });
    }
    if (res) {
      message.success(record.isTop === '1' ? '取消置顶成功' : '置顶成功');
      onSearch({});
    }
  };

  const rowSelection = {
    hideSelectAll: true,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: ActivityProps[]) => {
      onSelectChange(selectedRowKeys, selectedRows);
    },
    getCheckboxProps: (record: ActivityProps) => {
      return {
        disabled: isDisabled(operationType, record.status),
        name: record.activityName
      };
    }
  };

  const handleToggleOnlineState = (type: number) => {
    Modal.confirm({
      content: type === 1 ? '确认上架？' : '确定下架？',
      cancelText: '取消',
      okText: '确定',
      onOk: async () => {
        const res = await batchOperateActivity({
          type,
          activityIds: selectedRowKeys
        });
        if (res) {
          message.success(type === 1 ? '上架成功' : '下架成功');

          onSearch({});
        }
      }
    });
  };

  // 确认设置权限
  const confirmSetRight = async (values: any) => {
    setVisibleSetUserRight(false);
    const { isSet, groupId, isBatch } = values;
    // [adminId];
    // groupId: 93201136316088326
    const list: any[] = [];
    if (isBatch) {
      selectRows?.forEach((item) => {
        list.push({ activityId: item.activityId, groupId: isSet ? groupId : null });
      });
    } else {
      list.push({ activityId: currentItem?.activityId, groupId: isSet ? groupId : null });
    }
    const res = await setUserRightWithActivity({ list });
    if (res) {
      message.success('设置成功');
      getList({ pageNum: 1 });
      setPagination((pagination) => ({ ...pagination, current: 1 }));
    }
  };

  return (
    <div className={classNames(style.addFriendBox, 'container')}>
      <div className={style.addFriendContent}>
        <div className={style.addFriendPanel}>
          <AuthBtn path="/add">
            <Button
              type="primary"
              onClick={addHandle}
              shape="round"
              icon={<PlusOutlined />}
              size="large"
              style={{ width: 128 }}
            >
              添加
            </Button>
          </AuthBtn>
        </div>
        <div className={style.addFriendSearchBox}>
          <AuthBtn path="/query">
            <NgFormSearch searchCols={SearchCols} onSearch={onSearch} onValuesChange={onValuesChange}></NgFormSearch>
          </AuthBtn>
        </div>
        <div className={'pt20'}>
          <NgTable
            setRowKey={(record: ActivityProps) => {
              return record.activityId;
            }}
            loading={loading}
            columns={columns({ handleOperate, viewItem, handleSort, setRight })}
            rowSelection={rowSelection}
            dataSource={dataSource}
            pagination={pagination}
            paginationChange={paginationChange}
          />
          {dataSource.length > 0 && (
            <div className={'operationWrap'}>
              <Space size={20}>
                <AuthBtn path="/operateBatch">
                  <Button
                    type="primary"
                    shape={'round'}
                    ghost
                    disabled={operationType !== 1}
                    onClick={() => handleToggleOnlineState(1)}
                  >
                    批量上架
                  </Button>
                </AuthBtn>
                <AuthBtn path="/operateBatch">
                  <Button
                    type="primary"
                    shape={'round'}
                    ghost
                    disabled={operationType !== 2}
                    onClick={() => handleToggleOnlineState(2)}
                  >
                    批量下架
                  </Button>
                </AuthBtn>
                <AuthBtn path="/setBatch">
                  <Button
                    type="primary"
                    shape={'round'}
                    ghost
                    disabled={!(selectRows && selectRows.length > 0)}
                    onClick={() => setRight()}
                  >
                    批量添加可见范围
                  </Button>
                </AuthBtn>
              </Space>
            </div>
          )}
        </div>
      </div>

      <SetUserRight
        isBatch={isBatchSetRight}
        groupId={isBatchSetRight ? currentGroupIds : currentItem?.groupId}
        visible={visibleSetUserRight}
        onOk={confirmSetRight}
        onCancel={() => setVisibleSetUserRight(false)}
      />
    </div>
  );
};
export default ActivityLibrary;
