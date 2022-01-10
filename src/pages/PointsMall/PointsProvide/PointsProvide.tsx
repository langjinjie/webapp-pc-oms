import React, { useEffect, useState } from 'react';
import { useDocumentTitle } from 'src/utils/base';
import { Form, Space, Input, Select, Button, DatePicker } from 'antd';
import { NgTable } from 'src/components';
import { TableColumns, TablePagination } from './Config';
import { requestGetPonitsSendList, requestSendAllPonits, requestSendPonits } from 'src/apis/pointsMall';
import { IPointsProvideList } from 'src/utils/interface';
import PonitsDetail from './PonitsDetail/PonitsDetail';
import style from './style.module.less';

interface IPonitsList {
  total: number;
  list: IPointsProvideList[];
}

interface IPonitsParam {
  visible: boolean;
  ponitsRow: any;
}

const PointsProvide: React.FC = () => {
  const [ponitsList, setPonitsList] = useState<IPonitsList>({ total: 0, list: [] });
  const [paginationParam, setPaginationParam] = useState({ pageNum: 1, pageSize: 10 });
  const [searchParam, setSearchParam] = useState<{ [key: string]: any }>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [disabledColumnType, setDisabledColumnType] = useState(-1);
  const [isLoading, setIsloading] = useState(true);
  const [ponitsParam, setPonitsParam] = useState<IPonitsParam>({ visible: false, ponitsRow: {} });
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
    }
    setSelectedRowKeys([]);
    setDisabledColumnType(-1);
    setIsloading(false);
  };
  const resetHandle = () => {
    setSearchParam(searchParamHandle());
  };
  // 查询
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
    console.log(searchParamHandle());
    const res = await requestSendAllPonits(searchParamHandle());
    console.log(res);
  };
  // 发放积分
  const sendPoints = async () => {
    const res = await requestSendPonits({ list: selectedRowKeys });
    console.log(res);
  };
  useDocumentTitle('积分商城-积分发放');
  useEffect(() => {
    getPointsList();
  }, [paginationParam, searchParam]);
  return (
    <div className={style.wrap}>
      <Form name="base" className={style.form} layout="inline" form={form} onReset={resetHandle}>
        <Space className={style.antSpace}>
          <Form.Item className={style.label} name="staffName" label="客户经理姓名：">
            <Input placeholder="待输入" className={style.inputBox} allowClear style={{ width: 290 }} />
          </Form.Item>
          <Form.Item className={style.label} name="date" label="日期：">
            <RangePicker style={{ width: 280 }} />
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
              <Button className={style.searchBtn} type="primary" onClick={onSearchHandle}>
                查询
              </Button>
              <Button className={style.resetBtn} htmlType="reset">
                重置
              </Button>
            </Form.Item>
          </Space>
          <Space>
            <Button
              className={style.provideAllBtn}
              type="primary"
              onClick={sendAllPonitsHandle}
              disabled={!!selectedRowKeys.length}
            >
              一键群发积分
            </Button>
          </Space>
        </Space>
      </Form>
      <NgTable
        className={style.tableWrap}
        setRowKey={(record: any) => record.staffId}
        dataSource={ponitsList.list}
        columns={TableColumns({ setPonitsParam })}
        loading={isLoading}
        tableLayout={'fixed'}
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
          <Button disabled={!selectedRowKeys.length} className={style.sendPonitsBtn} onClick={sendPoints}>
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
