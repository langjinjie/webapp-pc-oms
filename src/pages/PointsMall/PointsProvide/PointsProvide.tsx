import React, { useEffect, useState } from 'react';
import { useDocumentTitle } from 'src/utils/base';
import { Form, Space, Input, Select, Button, DatePicker } from 'antd';
import { NgTable } from 'src/components';
import { TableColumns, TablePagination } from './Config';
import style from './style.module.less';

interface IPonitsList {
  total: number;
  list: any[];
}

const PointsProvide: React.FC = () => {
  const [ponitsList, setPonitsList] = useState<IPonitsList>({ total: 0, list: [] });
  const [paginationParam, setPaginationParam] = useState({ pageNum: 1, pageSize: 10 });
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [disabledColumnType, setDisabledColumnType] = useState(-1);
  const [isLoading, setIsloading] = useState(true);
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;
  const getPointsList = () => {
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
    for (let i = 0; i < 20; i++) {
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
    setPonitsList({ total: list.length, list });
    setIsloading(false);
  };
  const resetHandle = () => {
    console.log('重置');
  };
  // 查询
  const onSearchHandle = () => {
    console.log('查询');
  };
  const provideStatusList = [
    { value: 0, label: '已发放' },
    { value: 1, label: '未发放' }
  ];
  useDocumentTitle('积分商城-积分发放');
  useEffect(() => {
    getPointsList();
  }, []);
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
            <Form.Item>
              <Button className={style.searchBtn} type="primary" onClick={onSearchHandle}>
                查询
              </Button>
              <Button className={style.resetBtn} htmlType="reset">
                重置
              </Button>
            </Form.Item>
          </Space>
          <Space>
            <Button className={style.provideAllBtn} type="primary">
              一键群发积分
            </Button>
          </Space>
        </Space>
      </Form>
      <NgTable
        className={style.tableWrap}
        setRowKey={(record: any) => record.staffId}
        dataSource={ponitsList.list}
        columns={TableColumns()}
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
    </div>
  );
};
export default PointsProvide;
