import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { Button, Form, Input, Space, DatePicker, Select } from 'antd';
import { NgModal, NgTable } from 'src/components';
import { TableColumns, TableConfig } from './Config';
import { Context } from 'src/store';
import { IConfirmModalParam } from 'src/utils/interface';
import style from './style.module.less';

const WinManage: React.FC = () => {
  const { setConfirmModalParam } = useContext<{ setConfirmModalParam: Dispatch<SetStateAction<IConfirmModalParam>> }>(
    Context
  );
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<{ total: Number; list: any[] }>({ total: 0, list: [] });
  const [searchParam, setSearchParam] = useState<{ [key: string]: any }>({});
  const [modalParam, setModalParam] = useState<{ visible: boolean; address: string }>({ visible: false, address: '' });
  const [paginationParam, setPaginationParam] = useState<{ pageNum: number; pageSize: number }>({
    pageNum: 1,
    pageSize: 10
  });
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();
  const { Item } = Form;
  const { RangePicker } = DatePicker;
  const { TextArea } = Input;
  // 获取列表
  const getList = async () => {
    console.log('param', { ...searchParam, ...paginationParam });
    setLoading(true);
    const res = {
      total: 1,
      list: [
        {
          staffName: '李斯',
          staffId: '182837810',
          winName: '九阳空气炸锅',
          winTime: '2022.04.10 18:03:10',
          activityName: '贵州人保先锋团队第二轮抽奖',
          leader: '邓洁',
          address: '广东省深圳市南山区粤海街道怡化科技大厦20楼',
          addressCorrection: '',
          winStatus: 0,
          sendTime: '2022.04.13 09:23:45',
          operation: '贾老师'
        }
      ]
    };
    if (res) {
      setTimeout(() => {
        setList(res);
        setLoading(false);
      }, 1000);
    }
  };
  // 搜索
  const onFinish = (values: { [key: string]: any }) => {
    setSearchParam(values);
    setPaginationParam((param) => ({ ...param }));
  };
  // 重置
  const onReset = () => {
    setSearchParam({});
    setPaginationParam({ pageNum: 1, pageSize: 10 });
  };
  const onCancel = () => {
    setModalParam((param) => ({ ...param, visible: false }));
  };
  const onOk = () => {
    console.log('form', modalForm.getFieldsValue());
    const confirmOnOk = () => {
      setConfirmModalParam((param) => ({ ...param, visible: false }));
    };
    setConfirmModalParam({
      title: '奖品发放提醒',
      tips: '是否确认发放红包奖品？',
      visible: true,
      okText: '确认发放',
      onOk () {
        confirmOnOk();
        onCancel();
      }
    });
  };
  useEffect(() => {
    getList();
  }, [paginationParam]);
  return (
    <div className={style.wrap}>
      <Button className={style.exportData} type="primary">
        批量导出数据
      </Button>
      <Form className={style.form} form={form} layout="inline" onFinish={onFinish}>
        <Space className={style.formSpace}>
          <Item className={style.formItem} name="staffName" label="客户经理姓名：">
            <Input style={{ width: 200 }} />
          </Item>
          <Item name="winName" label="奖品名称：">
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
          <Item name="provideStatus" label="奖品发放状态：">
            <Select style={{ width: 120 }} />
          </Item>
          <Button className={style.submitBtn} type="primary" htmlType="submit">
            查询
          </Button>
          <Button className={style.resetBtn} onClick={onReset} htmlType="reset">
            重置
          </Button>
        </Space>
      </Form>
      <NgTable
        className={style.table}
        dataSource={list.list}
        columns={TableColumns(setModalParam)}
        setRowKey={(record) => record.staffId}
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
        visible={modalParam.visible}
        onOk={onOk}
        onCancel={onCancel}
      >
        <Form className={style.form} form={modalForm}>
          <Item className={style.formItem} name="company">
            <Input className={style.input} placeholder="请输入物流公司" />
          </Item>
          <Item name="number">
            <Input className={style.input} placeholder="请输入物流单号" />
          </Item>
          <Item name="address" initialValue={modalParam.address}>
            <TextArea className={style.textArea} placeholder="请输入收货地址" />
          </Item>
        </Form>
      </NgModal>
    </div>
  );
};
export default WinManage;
