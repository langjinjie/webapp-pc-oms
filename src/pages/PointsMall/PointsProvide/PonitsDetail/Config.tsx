import React, { useState, useRef, MutableRefObject } from 'react';
import { ColumnsType } from 'antd/es/table';
import { UNKNOWN } from 'src/utils/base';
import { Icon } from 'src/components';
import { ISendPointsDetail, IFlowList } from 'src/utils/interface';
import { Popover, Table } from 'antd';
import style from './style.module.less';
import classNames from 'classnames';
// import classNames from 'classnames';

const TableColumns = (): ColumnsType<any> => {
  const [isEdit, setIsEdit] = useState('');
  const [remark, setRemark] = useState('');
  const inputRef: MutableRefObject<any> = useRef(null);
  const businessType2NameList = [
    '朋友圈',
    '加好友',
    '销售宝典',
    '营销平台',
    '我的收藏',
    '客户标签',
    '客户雷达',
    '删好友'
  ];
  const action2NameList = [
    '发送',
    '点赞',
    '评论',
    '新加好友',
    '坐席主动删好友',
    '浏览',
    '分享',
    '新增标签',
    '服务建议发送',
    '点击客户雷达',
    '客户经理主动删除'
  ];
  // popoverTable
  const popovercolums: ColumnsType<any> = [
    {
      title: '客户昵称',
      render (row: IFlowList) {
        return (
          <div className={style.clientNickName}>
            <span>{row.clientNickName}</span>
            <span className={classNames(style.addBlackList, { [style.blackList]: row.clientInBlack })}>
              添加进黑名单
            </span>
          </div>
        );
      }
    },
    {
      title: '客户id',
      dataIndex: 'externalUserid'
    }
  ];
  // 输入框失去焦点
  const inputOnblurHandle = (row: ISendPointsDetail) => {
    setIsEdit('');
    row.remark = remark;
  };
  // 点击编辑
  const clickEditHandle = async (row: ISendPointsDetail) => {
    setRemark(row.remark);
    await setIsEdit(row.rewardId);
    inputRef.current.focus();
  };
  // 输入框的onchange事件
  const inputOnChangeHnadle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRemark(event.target.value.trim());
  };
  return [
    {
      title: '任务完成时间',
      dataIndex: 'taskFinishTime'
    },
    {
      title: '功能模块',
      render (row: ISendPointsDetail) {
        return <span>{businessType2NameList[row.businessType - 1]}</span>;
      }
    },
    {
      title: '任务名称',
      render (row: ISendPointsDetail) {
        return <span>{row.taskName || UNKNOWN}</span>;
      }
    },
    {
      title: '行为',
      render (row: ISendPointsDetail) {
        return <span>{action2NameList[row.action - 1]}</span>;
      }
    },
    {
      title: '客户昵称',
      render (row: ISendPointsDetail) {
        return (
          <>
            {row.flowList.slice(0, 3).map((item) => (
              <div className={style.clientNickName} key={item.flowId}>
                <span>{item.clientNickName}</span>
                <span className={classNames(style.addBlackList, { [style.blackList]: item.clientInBlack })}>
                  添加进黑名单
                </span>
              </div>
            ))}
            {row.flowList.length > 3 && (
              <Popover
                content={
                  <>
                    <div className={style.title}>客户明细</div>
                    <Table
                      className={style.popoverTableWrap}
                      rowKey={'flowId'}
                      dataSource={row.flowList}
                      columns={popovercolums}
                      pagination={false}
                    />
                  </>
                }
                trigger="click"
              >
                <span>查看客户明细</span>
              </Popover>
            )}
          </>
        );
      }
    },
    {
      title: '客户id',
      render (row: ISendPointsDetail) {
        return (
          <>
            {row.flowList.slice(0, 3).map((item) => (
              <div className={style.externalUserid} key={item.flowId}>
                {item.externalUserid}
              </div>
            ))}
          </>
        );
      }
    },
    {
      title: '内容',
      render (row: ISendPointsDetail) {
        return (
          <>
            {row.flowList.slice(0, 3).map((item) => (
              <div className={style.cotent} key={item.flowId}>
                {item.cotent}
              </div>
            ))}
          </>
        );
      }
    },
    {
      title: '奖励积分',
      render (row: ISendPointsDetail) {
        return <span>{row.rewardPoints || UNKNOWN}</span>;
      }
    },
    {
      title: '积分发放状态',
      render (row: ISendPointsDetail) {
        return <span>{row.sendStatus || UNKNOWN}</span>;
      }
    },
    {
      title: '备注',
      render (row: ISendPointsDetail) {
        return (
          <span className={style.remark}>
            {isEdit === row.rewardId
              ? (
              <input
                ref={inputRef}
                value={remark}
                onBlur={() => inputOnblurHandle(row)}
                className={style.input}
                type="text"
                readOnly={isEdit !== row.rewardId}
                onChange={inputOnChangeHnadle}
              />
                )
              : (
              <span>{row.remark}</span>
                )}
            {isEdit !== row.rewardId && <Icon name="bianji" onClick={() => clickEditHandle(row)} />}
          </span>
        );
      }
    }
  ];
};

const TablePagination = (arg: { [key: string]: any }): any => {
  const {
    dataSource,
    paginationParam,
    setPaginationParam,
    selectedRowKeys,
    setSelectedRowKeys,
    disabledColumnType,
    setDisabledColumnType
  } = arg;
  // 分页器参数
  const pagination = {
    total: dataSource.total,
    current: paginationParam.pageNum,
    showTotal: (total: number) => `共 ${total} 条`
  };
  // 切换分页
  const paginationChange = (value: number, pageSize?: number) => {
    setPaginationParam({ pageNum: value, pageSize: pageSize as number });
  };
  // 点击选择框
  const onSelectChange = async (newSelectedRowKeys: any[]) => {
    // 判断是取消选择还是开始选择
    if (newSelectedRowKeys.length) {
      let filterRowKeys: string[] = newSelectedRowKeys;
      // 判断是否是首次选择
      if (disabledColumnType === -1) {
        // 获取第一个的状态作为全选筛选条件
        const disabledColumnType = dataSource?.list.find((item: any) => item.staffId === newSelectedRowKeys[0])
          ?.isDeleted as number;
        setDisabledColumnType(disabledColumnType);
        // 判断是否是点击的全选
        if (newSelectedRowKeys.length > 1) {
          // 过滤得到需要被全选的
          filterRowKeys = dataSource.list
            .filter((item: any) => item.isDeleted === disabledColumnType)
            .map((item: any) => item.staffId);
        }
      }
      setSelectedRowKeys(filterRowKeys as string[]);
    } else {
      // 取消全选
      setSelectedRowKeys([]);
      setDisabledColumnType(-1);
    }
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    onSelect (row: any) {
      console.log('选中了');
      console.log(row);
    },
    hideSelectAll: false, // 是否隐藏全选
    getCheckboxProps: (record: any) => ({
      disabled: disabledColumnType === -1 ? false : record.isDeleted !== disabledColumnType,
      name: record.name
    })
  };
  return { pagination, rowSelection, paginationChange };
};
export { TableColumns, TablePagination };
