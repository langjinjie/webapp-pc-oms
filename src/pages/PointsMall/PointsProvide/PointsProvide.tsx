import React, { useContext, useEffect, useState } from 'react';
import { useDocumentTitle } from 'src/utils/base';
import { Form, Space, Input, Select, Button, DatePicker, message } from 'antd';
import { NgTable } from 'src/components';
import { TableColumns, TablePagination } from './Config';
import { requestGetPonitsSendList, requestSendAllPonits, requestSendPonits } from 'src/apis/pointsMall';
import { IPointsProvideList, IConfirmModalParam } from 'src/utils/interface';
import { Context } from 'src/store';
import moment from 'moment';
import PonitsDetail from './PonitsDetail/PonitsDetail';
import style from './style.module.less';

interface IPonitsList {
  total: number;
  list: IPointsProvideList[];
}

interface IPonitsParam {
  visible: boolean;
  ponitsRow?: IPointsProvideList;
  sendStatus: boolean;
}

const PointsProvide: React.FC = () => {
  const { setConfirmModalParam } = useContext(Context);
  const [ponitsList, setPonitsList] = useState<IPonitsList>({ total: 0, list: [] });
  const [paginationParam, setPaginationParam] = useState({ pageNum: 1, pageSize: 10 });
  const [searchParam, setSearchParam] = useState<{ [key: string]: any }>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [disabledColumnType, setDisabledColumnType] = useState(-1);
  const [isLoading, setIsloading] = useState(true);
  const [ponitsParam, setPonitsParam] = useState<IPonitsParam>({ visible: false, sendStatus: false });
  const [allSendStatus, setAllSendStatus] = useState(false); // 当前列表是否点击一键发放成功
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;
  // 处理查询参数
  const searchParamHandle = () => {
    const { staffName, date, isBlackClient, sendStatus } = form.getFieldsValue();
    let beginTime = '';
    let endTime = '';
    if (date) {
      beginTime = date[0].format('YYYY-MM-DD') + ' 00:00:00';
      endTime = date[1].format('YYYY-MM-DD') + ' 23:59:59';
    }
    return { staffName, beginTime, endTime, isBlackClient, sendStatus };
  };
  const getPointsList = async () => {
    setIsloading(true);
    const res = await requestGetPonitsSendList({ ...searchParam, ...paginationParam });
    if (res) {
      setPonitsList({ total: res.total, list: res.list });
      setDisabledColumnType(-1);
      setIsloading(false);
      ponitsParam.sendStatus || setSelectedRowKeys([]);
      setAllSendStatus(false);
    }
  };
  // 查询/重置
  const onSearchHandle = () => {
    setPaginationParam({ ...paginationParam, pageNum: 1 });
    setSearchParam(searchParamHandle());
  };
  // 积分发放状态
  const sendStatusList = [
    { value: 0, label: '未发放' },
    { value: 1, label: '已发放' }
  ];
  // 是否有黑名单客户
  const isBlackClientList = [
    { value: 0, label: '没有' },
    { value: 1, label: '有' }
  ];
  // 一键发放积分
  const sendAllPonitsHandle = async () => {
    const res = await requestSendAllPonits(searchParamHandle());
    if (res) {
      message.success('一键发放成功');
      // 发放完成重新获取列表最新数据
      setSearchParam((param) => ({ ...param }));
      setConfirmModalParam((param: IConfirmModalParam) => ({ ...param, visible: false }));
      setAllSendStatus(true);
    }
  };
  // 取消ConfirmModal
  const onCancel = () => {
    setConfirmModalParam((param: IConfirmModalParam) => ({ ...param, visible: false }));
  };
  // 点击一键发放
  const clickSendAllPonitsHandle = () => {
    setConfirmModalParam({
      visible: true,
      title: '积分发放提醒',
      tips: '是否确定群发积分？',
      onOk: sendAllPonitsHandle,
      onCancel
    });
  };
  // 发放积分
  const sendPoints = async () => {
    const list = selectedRowKeys.map((item) => ({ summaryId: item }));
    const res = await requestSendPonits({ list });
    if (res) {
      message.success('积分发放成功');
      const list = ponitsList.list;
      list.forEach((item) => {
        if (selectedRowKeys.includes(item.summaryId)) {
          item.sendStatus = 1;
          item.sendedPoints = item.mustSendPoints;
        }
      });
      setPonitsList(({ total, list }) => ({ total, list }));
      setSelectedRowKeys([]);
      setConfirmModalParam((param: IConfirmModalParam) => ({ ...param, visible: false }));
    }
  };
  // 点击发放积分
  const clickSendPonitsHandle = () => {
    setConfirmModalParam({
      visible: true,
      title: '积分发放提醒',
      tips: `是否确定${selectedRowKeys.length === 1 ? '发放' : '群发'}选中的积分？`,
      onOk: sendPoints,
      onCancel
    });
  };
  // 禁止选择今天之后的日期
  const disabledDate = (current: moment.Moment) => {
    return current > moment().endOf('day');
  };
  useDocumentTitle('积分商城-积分发放');
  useEffect(() => {
    ponitsParam.visible || getPointsList();
  }, [paginationParam, searchParam]);
  useEffect(() => {
    ponitsParam.sendStatus && getPointsList();
  }, [ponitsParam]);
  useEffect(() => {
    console.log(ponitsList.list);
  }, [ponitsList]);
  return (
    <div className={style.wrap}>
      <Form name="base" className={style.form} layout="inline" form={form} onReset={onSearchHandle}>
        <Space className={style.antSpace}>
          <Form.Item className={style.label} name="staffName" label="客户经理姓名：">
            <Input placeholder="待输入" className={style.inputBox} allowClear style={{ width: 290 }} />
          </Form.Item>
          <Form.Item className={style.label} name="date" label="日期：">
            <RangePicker style={{ width: 280 }} disabledDate={disabledDate} />
          </Form.Item>
        </Space>
        <Space className={style.antBtnSpace}>
          <Space size="small">
            <Form.Item className={style.label} name="isBlackClient" label="是否有黑名单客户：">
              <Select placeholder="待选择" className={style.selectBox} allowClear style={{ width: 180 }}>
                {isBlackClientList.map((item) => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item className={style.label} name="sendStatus" label="积分发放状态：">
              <Select placeholder="待选择" className={style.selectBox} allowClear style={{ width: 180 }}>
                {sendStatusList.map((item) => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item style={{ width: 186 }}>
              <Button className={style.searchBtn} type="primary" onClick={onSearchHandle} disabled={isLoading}>
                查询
              </Button>
              <Button className={style.resetBtn} htmlType="reset" disabled={isLoading}>
                重置
              </Button>
            </Form.Item>
          </Space>
          <Space>
            <Button
              className={style.provideAllBtn}
              type="primary"
              onClick={clickSendAllPonitsHandle}
              disabled={!!selectedRowKeys.length || allSendStatus}
            >
              一键群发积分
            </Button>
          </Space>
        </Space>
      </Form>
      <NgTable
        className={style.tableWrap}
        setRowKey={(record: any) => record.summaryId}
        dataSource={ponitsList.list}
        columns={TableColumns({ setPonitsParam })}
        loading={isLoading}
        scroll={{ x: 'max-content' }}
        {...TablePagination({
          dataSource: ponitsList,
          paginationParam,
          setPaginationParam,
          selectedRowKeys,
          setSelectedRowKeys,
          disabledColumnType,
          setDisabledColumnType
        })}
      />
      {!!ponitsList.total && (
        <div className={style.sendPonits}>
          <Button
            disabled={!selectedRowKeys.length}
            type="primary"
            className={style.sendPonitsBtn}
            onClick={clickSendPonitsHandle}
          >
            发放积分
          </Button>
        </div>
      )}
      {/* 积分详情 */}
      <PonitsDetail ponitsParam={ponitsParam} setPonitsParam={setPonitsParam} />
    </div>
  );
};
export default PointsProvide;
