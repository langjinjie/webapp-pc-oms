import React, { useEffect, useState } from 'react';
import { useDocumentTitle } from 'src/utils/base';
import { Form, Space, Input, Select, Button, DatePicker } from 'antd';
import { NgTable } from 'src/components';
import { TableColumns, TablePagination } from './Config';
import PonitsDetail from './PonitsDetail/PonitsDetail';
import style from './style.module.less';

interface IPonitsList {
  total: number;
  list: any[];
}

interface IPonitsParam {
  visible: boolean;
  ponitsRow: any;
}

const PointsProvide: React.FC = () => {
  const [ponitsList, setPonitsList] = useState<IPonitsList>({ total: 0, list: [] });
  const [renderedList] = useState<{ [key: string]: any }>({});
  const [paginationParam, setPaginationParam] = useState({ pageNum: 1, pageSize: 10 });
  const [searchParam, setSearchParam] = useState<{ [key: string]: any }>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [disabledColumnType, setDisabledColumnType] = useState(-1);
  const [isLoading, setIsloading] = useState(true);
  const [ponitsParam, setPonitsParam] = useState<IPonitsParam>({ visible: false, ponitsRow: {} });
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;
  const getPointsList = async () => {
    setIsloading(true);
    console.log(ponitsList);
    const pointsItem = {
      staffName: '李斯',
      staffId: 2000000,
      time: '2021.12.12',
      blacklist: 0,
      newPonits: 50,
      blackPonits: 0,
      shouldPonits: 25,
      sendedPonits: 25,
      recoveryPonits: 0,
      sendStatus: 0,
      sendTime: '2021.12.13 09:23:45',
      operator: '贾老师'
    };
    const list = [];
    const index = (paginationParam.pageNum - 1) * 10;
    for (let i = index; i < index + 10; i++) {
      const item = { ...pointsItem };
      item.staffId += i;
      item.blacklist = i % 2;
      item.newPonits += i;
      item.blackPonits += i;
      item.shouldPonits += i;
      item.sendedPonits += i;
      item.recoveryPonits += i;
      list.push(item);
    }
    console.log(list);
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve('成功~');
      }, 1000);
    });
    list.forEach((item) => {
      renderedList[item.staffId] = item;
    });
    console.log(renderedList);
    console.log(Object.values(renderedList));
    setSelectedRowKeys([]);
    setDisabledColumnType(-1);
    setPonitsList({ total: 20, list });
    setIsloading(false);
  };
  const resetHandle = () => {
    console.log('重置');
    setSearchParam(form.getFieldsValue());
  };
  // 查询
  const onSearchHandle = () => {
    console.log('查询');
    setPaginationParam({ ...paginationParam, pageNum: 1 });
    setSearchParam(form.getFieldsValue());
  };
  const provideStatusList = [
    { value: 0, label: '已发放' },
    { value: 1, label: '未发放' }
  ];
  // 一键发放积分
  const sendAllPonitsHandle = () => {
    console.log(renderedList);
  };
  useDocumentTitle('积分商城-积分发放');
  useEffect(() => {
    getPointsList();
  }, [paginationParam, searchParam]);
  return (
    <div className={style.wrap}>
      <Form name="base" className={style.form} layout="inline" form={form} onReset={resetHandle}>
        <Space className={style.antSpace}>
          <Form.Item className={style.label} name="resource" label="客户经理姓名：">
            <Input placeholder="待输入" className={style.inputBox} allowClear style={{ width: 290 }} />
          </Form.Item>
          <Form.Item className={style.label} name="businessModel" label="日期：">
            <RangePicker style={{ width: 280 }} />
          </Form.Item>
        </Space>
        <Space className={style.antBtnSpace}>
          <Space size="small">
            <Form.Item className={style.label} name="isDeleted" label="是否有黑名单客户：">
              <Select placeholder="待选择" className={style.selectBox} allowClear style={{ width: 180 }}>
                {provideStatusList.map((item) => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item className={style.label} name="isDeleted" label="积分发放状态：">
              <Select placeholder="待选择" className={style.selectBox} allowClear style={{ width: 180 }}>
                {provideStatusList.map((item) => (
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
          <Button disabled={!selectedRowKeys.length} className={style.sendPonitsBtn}>
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
