import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { Button, Form, Input, Space, DatePicker, Select } from 'antd';
import { AuthBtn, NgModal, NgTable } from 'src/components';
import { TableColumns, TableConfig } from './Config';
import { Context } from 'src/store';
import { IConfirmModalParam } from 'src/utils/interface';
import { requestGetLotteryManageList, requestExportLotteryManage, requestSendLotteryManage } from 'src/apis/pointsMall';
import style from './style.module.less';
import { RouteComponentProps } from 'react-router-dom';
import { URLSearchParams } from 'src/utils/base';

const WinManage: React.FC<RouteComponentProps> = ({ location }) => {
  const { setConfirmModalParam } = useContext<{ setConfirmModalParam: Dispatch<SetStateAction<IConfirmModalParam>> }>(
    Context
  );
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<{ total: Number; list: any[] }>({ total: 0, list: [] });
  const [searchParam, setSearchParam] = useState<{ [key: string]: any }>({});
  const [addresModalVisible, setAddresModalVisible] = useState(false);
  const [sendWinInfo, setSendWinInfo] = useState<{ winId: string; name: string; goodsType: number }>();
  const [paginationParam, setPaginationParam] = useState<{ pageNum: number; pageSize: number }>({
    pageNum: 1,
    pageSize: 10
  });
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();
  const { Item } = Form;
  const { RangePicker } = DatePicker;
  const { TextArea } = Input;
  // 积分发放状态
  const sendStatusList = [
    { value: 0, label: '未发放' },
    { value: 1, label: '已发放' }
  ];
  // 批量导出数据
  const downLoadStaffList = async () => {
    const res = await requestExportLotteryManage({
      ...searchParam
    });
    if (res) {
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', '中奖列表.xlsx');
      document.body.appendChild(link);
      link.click(); // 点击下载
      link.remove(); // 下载完成移除元素
      window.URL.revokeObjectURL(link.href); // 用完之后使用URL.revokeObjectURL()释放；
    }
  };
  // 获取列表
  const getList = async () => {
    setLoading(true);
    const { activityName } = URLSearchParams(location.search) as { activityName: string };
    const param: { [key: string]: any } = { ...searchParam, ...paginationParam };
    if (activityName) {
      param.activityName = activityName;
      form.setFieldsValue({ activityName });
    }
    const res = await requestGetLotteryManageList(param);
    if (res) {
      setList(res);
    }
    setLoading(false);
  };
  // 搜索
  const onFinish = (values: { [key: string]: any }) => {
    let startTime = '';
    let endTime = '';
    if (values.winTime) {
      startTime = values.winTime[0].startOf('day').format('YYYY-MM-DD HH:mm:ss');
      endTime = values.winTime[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');
      delete values.winTime;
    }
    const param = { ...values, startTime, endTime };
    setSearchParam(param);
    setPaginationParam((param) => ({ ...param }));
  };
  // 重置
  const onReset = () => {
    setSearchParam({});
    setPaginationParam({ pageNum: 1, pageSize: 10 });
  };
  const onCancel = () => {
    setAddresModalVisible(false);
  };
  const onOk = async () => {
    await modalForm.validateFields();
    const { winId } = sendWinInfo || {};
    const confirmOnOk = async () => {
      const res = await requestSendLotteryManage({ winId, ...modalForm.getFieldsValue() });
      if (res) {
        onCancel();
        setConfirmModalParam((param) => ({ ...param, visible: false }));
        // 刷新列表
        setPaginationParam((param) => ({ ...param }));
        modalForm.resetFields();
      }
    };
    setConfirmModalParam({
      title: '奖品发放提醒',
      tips: '是否确认发放 <b>' + sendWinInfo?.name + '</b> 奖品？',
      visible: true,
      okText: '确认发放',
      onOk () {
        confirmOnOk();
      }
    });
  };
  // 发放非物流类奖品
  const sendPrizeHandle = (param: { winId: string; name: string }) => {
    const { winId, name } = param;
    const confirmOnOk = async () => {
      const res = await requestSendLotteryManage({ winId });
      if (res) {
        onCancel();
        setConfirmModalParam((param) => ({ ...param, visible: false }));
        // 刷新列表
        setPaginationParam((param) => ({ ...param }));
      }
    };
    setConfirmModalParam({
      title: '奖品发放提醒',
      tips: '是否确认发放 <b>' + name + '</b> 奖品？',
      visible: true,
      okText: '确认发放',
      onOk () {
        confirmOnOk();
      }
    });
  };
  // tableColumnsOnChange
  const tableColumnsOnChange = (value: any) => {
    setSendWinInfo(value);
    modalForm.setFieldsValue({ deliverAddress: value.deliverAddress });
    setAddresModalVisible(true);
  };
  useEffect(() => {
    getList();
  }, [paginationParam]);

  return (
    <div className={style.wrap}>
      <AuthBtn path="/export">
        <Button className={style.exportData} type="primary" onClick={downLoadStaffList}>
          批量导出数据
        </Button>
      </AuthBtn>
      <AuthBtn path="/query">
        <Form className={style.form} form={form} layout="inline" onFinish={onFinish}>
          <Space className={style.formSpace}>
            <Item className={style.formItem} name="staffName" label="客户经理姓名：">
              <Input style={{ width: 200 }} />
            </Item>
            <Item name="name" label="奖品名称：">
              <Input style={{ width: 250 }} />
            </Item>
            <Item name="activityName" label="活动名称：">
              <Input style={{ width: 250 }} />
            </Item>
          </Space>
          <Space className={style.formSpace}>
            <Item name="winTime" label="中奖时间：">
              <RangePicker format={'YYYY年MM月DD日'} />
            </Item>
            <Item name="sendStatus" label="奖品发放状态：">
              <Select style={{ width: 120 }}>
                {sendStatusList.map((item) => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Item>
            <Button className={style.submitBtn} type="primary" htmlType="submit">
              查询
            </Button>
            <Button className={style.resetBtn} onClick={onReset} htmlType="reset">
              重置
            </Button>
          </Space>
        </Form>
      </AuthBtn>

      <NgTable
        className={style.table}
        dataSource={list.list}
        columns={TableColumns(tableColumnsOnChange, sendPrizeHandle)}
        setRowKey={(record) => record.winId}
        loading={loading}
        scroll={{ x: 'max-content' }}
        {...TableConfig({ total: list.total, paginationParam, setPaginationParam })}
      />
      {/* 发放奖品 */}
      <NgModal
        maskClosable={false}
        className={style.modalWrap}
        title="奖品发放提醒"
        okText="确认发放"
        visible={addresModalVisible}
        onOk={onOk}
        onCancel={onCancel}
        destroyOnClose
      >
        <Form className={style.form} form={modalForm}>
          <Item
            className={style.formItem}
            name="deliverCompany"
            rules={[{ required: sendWinInfo?.goodsType === 4, message: '请输入物流公司' }]}
          >
            <Input className={style.input} placeholder="请输入物流公司" />
          </Item>
          <Item name="deliverCode" rules={[{ required: sendWinInfo?.goodsType === 4, message: '请输入物流单号' }]}>
            <Input className={style.input} placeholder="请输入物流单号" />
          </Item>
          <Item name="deliverAddress" rules={[{ required: sendWinInfo?.goodsType === 4, message: '请输入收货地址' }]}>
            <TextArea className={style.textArea} placeholder="请输入收货地址" />
          </Item>
        </Form>
      </NgModal>
    </div>
  );
};
export default WinManage;
