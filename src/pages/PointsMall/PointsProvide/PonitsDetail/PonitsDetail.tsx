import React, { useState, useEffect } from 'react';
import { Drawer } from 'antd';
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
  const [disabledColumnType, setDisabledColumnType] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);
  // 获取发放积分详情接口
  const getSendPonitsDetail = async () => {
    setIsLoading(true);
    const res = await requestGetSendPonitsDetail({});
    console.log(res);
    if (res) {
      setSendPointsDetail({ total: res.total, list: res.list });
    }
    setIsLoading(false);
  };
  // 关闭抽屉
  const onCloseHandle = () => {
    setPonitsParam({ ...ponitsParam, visible: false });
  };
  useEffect(() => {
    console.log(ponitsParam.ponitsRow);
    getSendPonitsDetail();
  }, [ponitsParam]);
  return (
    <>
      <Drawer
        title={ponitsRow.staffName + ponitsRow.date + '的积分奖励明细'}
        placement="right"
        onClose={onCloseHandle}
        visible={visible}
        width={'90%'}
      >
        <NgTable
          className={style.tableWrap}
          setRowKey={(record: any) => record.staffId}
          dataSource={sendPointsDetail.list}
          columns={TableColumns()}
          loading={isLoading}
          tableLayout={'fixed'}
          scroll={{ x: 'max-content' }}
          {...TablePagination({
            dataSource: sendPointsDetail,
            paginationParam,
            setPaginationParam,
            selectedRowKeys,
            setSelectedRowKeys,
            disabledColumnType,
            setDisabledColumnType
          })}
        />
      </Drawer>
    </>
  );
};
export default PonitsDetail;
