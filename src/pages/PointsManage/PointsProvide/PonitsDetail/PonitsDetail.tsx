import React, { useState, useEffect, useRef, MutableRefObject, useContext } from 'react';
import { Drawer, Button, message } from 'antd';
import { requestGetSendPonitsDetail, requestSendAllPonitsDetail } from 'src/apis/pointsMall';
import { NgTable } from 'src/components';
import { TableColumns, TablePagination } from './Config';
import { IPointsProvideList, ISendPointsDetail } from 'src/utils/interface';
import { Context } from 'src/store';
import style from './style.module.less';

interface IPonitsParam {
  visible: boolean;
  ponitsRow?: IPointsProvideList;
  sendStatus: boolean;
}

interface IProviderPointsParams extends ISendPointsDetail {
  isProvider?: boolean;
}

interface IPonitsDetail {
  ponitsParam: IPonitsParam;
  setPonitsParam: React.Dispatch<React.SetStateAction<IPonitsParam>>;
}

const PonitsDetail: React.FC<IPonitsDetail> = ({ ponitsParam, setPonitsParam }) => {
  const { setConfirmModalParam } = useContext(Context);
  const { ponitsRow, visible } = ponitsParam;
  const [sendPointsDetail, setSendPointsDetail] = useState<{ total: number; list: ISendPointsDetail[] }>({
    total: 0,
    list: []
  });
  const [paginationParam, setPaginationParam] = useState({ pageNum: 1, pageSize: 10 });
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tableHeight, setTableHeight] = useState(0);
  const [renderedList, setRenderedList] = useState<{ [key: string]: IProviderPointsParams }>({});
  const [sendStatus, setSendStatus] = useState(false); // 告诉发放列表详情页是否发生了一键发放
  const wrapRef: MutableRefObject<any> = useRef(null);
  // 重置
  const onResetHandle = () => {
    setRenderedList({});
    setPonitsParam((param) => ({ ...param, visible: false, sendStatus }));
    setPaginationParam({ pageNum: 1, pageSize: 10 });
    setSelectedRowKeys([]);
    setSendStatus(false);
  };
  // 获取发放积分详情接口
  const getSendPonitsDetail = async () => {
    setIsLoading(true);
    const res = await requestGetSendPonitsDetail({ summaryId: ponitsRow?.summaryId, ...paginationParam });
    if (res) {
      setSendPointsDetail({ total: res.total, list: res.list });
      // 默认选中非黑名单任务
      const initSelectedRowKeys = res.list
        .filter((item: ISendPointsDetail) => !item.blackTask && !item.sendStatus)
        .map((item: ISendPointsDetail) => item.rewardId);
      ponitsRow?.sendStatus || setSelectedRowKeys(initSelectedRowKeys);
      setRenderedList(
        res.list.reduce(
          (prev: { [key: string]: IProviderPointsParams }, now: ISendPointsDetail) => {
            prev[now.rewardId] = now;
            prev[now.rewardId].isProvider = !now.blackTask;
            return prev;
          },
          { ...renderedList }
        )
      );
    }
    setIsLoading(false);
  };
  // 一键发放
  const sendedAllHandle = async () => {
    const selectedRewardIdList = Object.values(renderedList)
      .filter((item) => !item.sendStatus && item.isProvider)
      .map((item) => item.rewardId);
    const unSelectedRewardIdList = Object.values(renderedList)
      .filter((item) => !item.sendStatus && !item.isProvider)
      .map((item) => item.rewardId);
    const res = await requestSendAllPonitsDetail({
      summaryId: ponitsRow?.summaryId,
      selectedRewardIdList,
      unSelectedRewardIdList
    });
    if (res) {
      message.success('积分发放成功');
      const list = sendPointsDetail.list.map((item) => ({
        ...item,
        sendStatus: selectedRowKeys.includes(item.rewardId) ? 1 : item.sendStatus
      }));
      setPonitsParam((ponitsParam) => {
        const { ponitsRow } = ponitsParam;
        return { ...ponitsParam, ponitsRow: { ...ponitsRow, sendStatus: 1 } as IPointsProvideList };
      });
      setSendPointsDetail(({ total }) => ({ total, list }));
      setSelectedRowKeys([]);
      setSendStatus(true);
      setConfirmModalParam({ visible: false });
    }
  };
  // 点击一键发放
  const clickSendPonitsHandle = () => {
    setConfirmModalParam({
      visible: true,
      title: '积分发放提醒',
      tips: '是否确定发放积分？',
      onOk: sendedAllHandle
    });
  };
  useEffect(() => {
    ponitsParam.visible && getSendPonitsDetail();
  }, [ponitsParam.visible, paginationParam]);
  useEffect(() => {
    const drawerHeight = document.getElementsByClassName(style.drawerWrap)[0] as HTMLDivElement;
    setTableHeight(drawerHeight?.offsetHeight - 237 || 0);
  }, [sendPointsDetail]);
  return (
    <div className={style.wrap} ref={wrapRef}>
      <Drawer
        title={
          (ponitsRow?.staffName || '') +
          (ponitsRow?.date || '').replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3') +
          '的积分奖励明细'
        }
        className={style.drawerWrap}
        placement="right"
        onClose={onResetHandle}
        visible={visible}
        width={'90%'}
      >
        <div className={style.btnWrap}>
          <Button
            type={'primary'}
            className={style.sendPoints}
            onClick={clickSendPonitsHandle}
            disabled={!!ponitsRow?.sendStatus}
          >
            一键发放积分
          </Button>
          <span className={style.tip}>温馨提醒：默认发放的是该客户经理当天所有的积分（剔除黑名单客户）。</span>
        </div>
        <NgTable
          className={style.tableWrap}
          setRowKey={(record: ISendPointsDetail) => record.rewardId}
          dataSource={sendPointsDetail.list}
          columns={TableColumns(setPaginationParam)}
          loading={isLoading}
          scroll={{ x: 'max-content', y: tableHeight }}
          {...TablePagination({
            dataSource: sendPointsDetail,
            paginationParam,
            setPaginationParam,
            selectedRowKeys,
            setSelectedRowKeys,
            setRenderedList,
            rowSendStatus: ponitsRow?.sendStatus
          })}
        />
      </Drawer>
    </div>
  );
};
export default PonitsDetail;
