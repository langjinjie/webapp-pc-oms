import React, { useState, useEffect, useRef, MutableRefObject } from 'react';
import { Drawer, Button } from 'antd';
import { requestGetSendPonitsDetail } from 'src/apis/pointsMall';
import { NgTable } from 'src/components';
import { TableColumns, TablePagination } from './Config';
import { IPointsProvideList, ISendPointsDetail } from 'src/utils/interface';
import style from './style.module.less';

interface IPonitsParam {
  visible: boolean;
  ponitsRow: IPointsProvideList;
}

interface IPonitsDetail {
  ponitsParam: IPonitsParam;
  setPonitsParam: (param: IPonitsParam) => void;
}

const PonitsDetail: React.FC<IPonitsDetail> = ({ ponitsParam, setPonitsParam }) => {
  const { ponitsRow, visible } = ponitsParam;
  const [sendPointsDetail, setSendPointsDetail] = useState<{ total: number; list: ISendPointsDetail[] }>({
    total: 0,
    list: []
  });
  const [paginationParam, setPaginationParam] = useState({ pageNum: 1, pageSize: 10 });
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tableHeight, setTableHeight] = useState(0);
  const [renderedList, setRenderedList] = useState<{ [key: string]: ISendPointsDetail }>({});
  const wrapRef: MutableRefObject<any> = useRef(null);
  // 获取发放积分详情接口
  const getSendPonitsDetail = async () => {
    setIsLoading(true);
    setSelectedRowKeys([]);
    const res = await requestGetSendPonitsDetail({});
    if (res) {
      setSendPointsDetail({ total: res.total, list: res.list });
      // 默认选中非黑名单任务
      const initSelectedRowKeys = res.list
        .filter((item: ISendPointsDetail) => !item.isBlackTask)
        .map((item: ISendPointsDetail) => item.rewardId);
      setSelectedRowKeys((keys) => Array.from(new Set([...keys, ...initSelectedRowKeys])));
      setRenderedList(
        res.list.reduce((now: ISendPointsDetail, prev: { [key: string]: ISendPointsDetail }) => {
          prev[now.rewardId] = now;
          return prev;
        }, renderedList)
      );
    }
    setIsLoading(false);
  };
  // 关闭抽屉
  const onCloseHandle = () => {
    setPonitsParam({ ...ponitsParam, visible: false });
  };
  // 一键发放
  const sendedAllHandle = () => {
    console.log('selectedRowKeys', selectedRowKeys);
    // console.log('renderedKeys', renderedKeys);
  };
  useEffect(() => {
    ponitsParam.visible && getSendPonitsDetail();
  }, [ponitsParam, paginationParam]);
  useEffect(() => {
    const drawerHeight = document.getElementsByClassName(style.drawerWrap)[0] as HTMLDivElement;
    setTableHeight(drawerHeight?.offsetHeight - 236 || 0);
  }, [sendPointsDetail]);
  return (
    <div className={style.wrap} ref={wrapRef}>
      <Drawer
        title={ponitsRow.staffName + ponitsRow.date + '的积分奖励明细'}
        className={style.drawerWrap}
        placement="right"
        onClose={onCloseHandle}
        visible={visible}
        width={'90%'}
      >
        <div className={style.btnWrap}>
          <Button className={style.sendPoints} onClick={sendedAllHandle}>
            一键发放积分
          </Button>
          <span className={style.tip}>温馨提醒：发放的是该客户经理当天所有的积分（剔除黑名单客户）。</span>
        </div>
        <NgTable
          className={style.tableWrap}
          setRowKey={(record: ISendPointsDetail) => record.rewardId}
          dataSource={sendPointsDetail.list}
          columns={TableColumns()}
          loading={isLoading}
          tableLayout={'fixed'}
          scroll={{ x: 'max-content', y: tableHeight }}
          {...TablePagination({
            dataSource: sendPointsDetail,
            paginationParam,
            setPaginationParam,
            selectedRowKeys,
            setSelectedRowKeys
          })}
        />
      </Drawer>
    </div>
  );
};
export default PonitsDetail;
