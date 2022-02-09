import React, { useState, useRef, MutableRefObject, useContext } from 'react';
import { ColumnsType } from 'antd/es/table';
import { UNKNOWN } from 'src/utils/base';
import { Icon } from 'src/components';
import { ISendPointsDetail, IFlowList, IConfirmModalParam } from 'src/utils/interface';
import { message, Popover, Table, Tooltip } from 'antd';
import { requestModifyRemark, requestAddBlackList } from 'src/apis/pointsMall';
import { Context } from 'src/store';
import style from './style.module.less';
import classNames from 'classnames';
// import classNames from 'classnames';

interface IProviderPointsParams extends ISendPointsDetail {
  isProvider?: boolean;
}

const TableColumns = (
  setPaginationParam: React.Dispatch<React.SetStateAction<{ pageNum: number; pageSize: number }>>
): ColumnsType<any> => {
  const { setConfirmModalParam } = useContext(Context);
  const [isEdit, setIsEdit] = useState('');
  const [remark, setRemark] = useState('');
  const inputRef: MutableRefObject<any> = useRef(null);
  // 解决input框宽度自适应问题
  const [inputWidth, setInputWidth] = useState(0);
  const [spanNode, setSpanNode] = useState<HTMLSpanElement>();
  // 功能模块
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
  // 行为
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
  // 提交添加黑名单
  const addBlackListHandle = async (row: IFlowList, rewardId: string) => {
    const { externalUserid } = row;
    const res = await requestAddBlackList({ externalUserid, rewardId });
    if (res) {
      message.success('添加黑名单成功');
      setPaginationParam((param) => ({ ...param }));
      setConfirmModalParam((param: IConfirmModalParam) => ({ ...param, visible: false }));
    }
  };
  // 点击添加黑名单
  const clickAddBlackListHandle = (row: IFlowList, rewardId: string) => {
    const { clientInBlack } = row;
    if (clientInBlack) return false;
    setConfirmModalParam({
      visible: true,
      title: '温馨提醒',
      tips: '是否确定将该用户加入黑名单？',
      onOk: () => addBlackListHandle(row, rewardId),
      onCancel () {
        setConfirmModalParam((param: IConfirmModalParam) => ({ ...param, visible: false }));
      }
    });
  };
  // popoverTable
  const popovercolums: ColumnsType<any> = [
    {
      title: '客户昵称',
      render (row: IFlowList) {
        return (
          <div className={style.clientNickName}>
            <span>{row.clientNickName || '/'}</span>
            {row.clientNickName && (
              <span
                className={classNames(style.addBlackList, { [style.blackList]: row.clientInBlack })}
                onClick={() => clickAddBlackListHandle(row, row?.rewardId as string)}
              >
                {row.clientInBlack ? '客户黑名单' : '添加进黑名单'}
              </span>
            )}
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
  const inputOnblurHandle = async (row: ISendPointsDetail) => {
    if (remark !== row.remark) {
      const res = await requestModifyRemark({ rewardId: row.rewardId, remark: remark || ' ' });
      if (res) {
        row.remark = remark;
        message.success('备注修改成功');
      }
    }
    setIsEdit('');
    document.body.removeChild(spanNode as HTMLSpanElement);
    setSpanNode(undefined);
  };
  const onkeydownHandle = (e: React.KeyboardEvent<HTMLInputElement>, row: ISendPointsDetail) => {
    if (e.keyCode === 13) {
      inputOnblurHandle(row);
    }
  };
  // 点击编辑
  const clickEditHandle = async (row: ISendPointsDetail) => {
    const remarkWidth = document.getElementsByClassName(style.remark)[0].clientWidth;
    setInputWidth(remarkWidth || 0);
    setRemark(row.remark || '');
    await setIsEdit(row.rewardId);
    inputRef.current.focus();
    // 创建一个span
    const spanNode = document.createElement('span');
    spanNode.style.visibility = 'hidden';
    spanNode.style.fontSize = '14px';
    spanNode.style.display = 'inline-block';
    (spanNode as HTMLSpanElement).textContent = row.remark;
    document.body.appendChild(spanNode);
    setInputWidth(spanNode?.clientWidth as number);
    setSpanNode(spanNode);
  };
  // 输入框的onchange事件
  const inputOnChangeHnadle = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.value.trim().length === 40 && message.info('最多能输入40个字符');
    setRemark(event.target.value.trim());
    (spanNode as HTMLSpanElement).textContent = event.target.value.trim();
    setInputWidth(spanNode?.clientWidth as number);
  };
  return [
    {
      title: '任务完成时间',
      dataIndex: 'taskFinishTime'
    },
    {
      title: '功能模块',
      render (row: ISendPointsDetail) {
        return <span className={style.funModule}>{businessType2NameList[row.businessType - 1]}</span>;
      }
    },
    {
      title: '任务名称',
      render (row: ISendPointsDetail) {
        return (
          <span className={style.maskName}>
            {`${row.taskName}${row.actionNum > 1 ? `（${row.realActionNum}/${row.actionNum}）` : ''}` || UNKNOWN}
          </span>
        );
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
            {row.flowList.slice(0, 3).map((item, index) => (
              <div className={style.clientNickName} key={item.flowId}>
                <span>{item.clientNickName || UNKNOWN}</span>
                {item.clientNickName && (
                  <span
                    className={classNames(style.addBlackList, { [style.blackList]: item.clientInBlack })}
                    onClick={() => clickAddBlackListHandle(row.flowList[index], row.rewardId)}
                  >
                    {item.clientInBlack ? '客户黑名单' : '添加进黑名单'}
                  </span>
                )}
              </div>
            ))}
            {row.flowList.length > 3 && (
              <Popover
                placement="rightTop"
                content={
                  <>
                    <div style={{ textAlign: 'center', marginBottom: '20px', marginTop: '8px' }}>客户明细</div>
                    <Table
                      className={style.popoverTableWrap}
                      rowKey={'flowId'}
                      dataSource={row.flowList.map((item) => ({ ...item, rewardId: row.rewardId }))}
                      columns={popovercolums}
                      pagination={false}
                    />
                  </>
                }
                trigger="click"
              >
                <span className={style.checkAllClient}>查看客户明细</span>
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
              <span className={style.externalUserid} key={item.flowId}>
                {item.externalUserid || UNKNOWN}
              </span>
            ))}
          </>
        );
      }
    },
    {
      title: '内容',
      ellipsis: true,
      render (row: ISendPointsDetail) {
        return (
          <>
            {row.flowList.slice(0, 3).map((item) => (
              <Tooltip
                placement="bottomLeft"
                key={item.flowId}
                title={item.content}
                destroyTooltipOnHide={true}
                overlayClassName={style.contentTooltip}
              >
                <div className={style.content} key={item.flowId}>
                  {item.content}
                </div>
              </Tooltip>
            ))}
          </>
        );
      }
    },
    {
      title: '奖励积分',
      width: 88,
      render (row: ISendPointsDetail) {
        return <span className={row.blackTask ? style.backPonits : ''}>{row.rewardPoints || UNKNOWN}</span>;
      }
    },
    {
      title: '积分发放状态',
      width: 116,
      render (row) {
        return (
          <span className={classNames(style.sendStatus, { [style.sended]: row.sendStatus })}>
            {row.sendStatus ? '已发放' : '未发放'}
          </span>
        );
      }
    },
    {
      title: '备注',
      ellipsis: true,
      render (row: ISendPointsDetail) {
        return (
          <span className={style.remark} style={isEdit === row.rewardId ? { width: inputWidth } : { width: '100%' }}>
            {isEdit === row.rewardId
              ? (
              <input
                ref={inputRef}
                value={remark}
                onBlur={() => inputOnblurHandle(row)}
                className={style.input}
                type="text"
                onChange={inputOnChangeHnadle}
                style={{ width: inputWidth }}
                onKeyDown={(e) => onkeydownHandle(e, row)}
                maxLength={40}
              />
                )
              : (
              <Tooltip placement="bottomLeft" title={row.remark} destroyTooltipOnHide={true}>
                <span className={style.text}>
                  {(row.remark || '').slice(0, 10) + ((row.remark || '').length > 10 ? '...' : '')}
                </span>
              </Tooltip>
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
    setRenderedList,
    rowSendStatus
  } = arg;
  // 分页器参数
  const pagination = {
    total: dataSource.total,
    current: paginationParam.pageNum,
    pageSize: paginationParam.pageSize,
    showTotal: (total: number) => `共 ${total} 条`
  };
  // 切换分页
  const paginationChange = (value: number, pageSize?: number) => {
    setPaginationParam({ pageNum: value, pageSize: pageSize as number });
  };
  // 点击选择框
  const onSelectChange = async (newSelectedRowKeys: any[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    // 选择框改变
    onChange: onSelectChange,
    // 单选操作
    onSelect (record: IProviderPointsParams, selected: boolean) {
      setRenderedList((list: IProviderPointsParams) => ({
        ...list,
        [record.rewardId]: { ...record, isProvider: selected }
      }));
    },
    // 全选操作
    onSelectAll (record: boolean, selected: IProviderPointsParams[], selectedRows: IProviderPointsParams[]) {
      let newRenderedParam: { [key: string]: IProviderPointsParams } = {};
      let renderedList: IProviderPointsParams[] = [];
      if (record) {
        renderedList = selected;
      } else {
        renderedList = selectedRows;
      }
      newRenderedParam = renderedList.reduce((prev, now) => {
        prev[now.rewardId] = now;
        prev[now.rewardId].isProvider = record;
        return prev;
      }, newRenderedParam);
      setRenderedList((list: IProviderPointsParams) => ({ ...list, ...newRenderedParam }));
    },
    hideSelectAll: false, // 是否隐藏全选
    getCheckboxProps: () => ({
      disabled: rowSendStatus // 已发放积分的不能被选中
    })
  };
  return { pagination, rowSelection, paginationChange };
};
export { TableColumns, TablePagination };
