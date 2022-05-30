import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Space, DatePicker, Select } from 'antd';
import { NgTable } from 'src/components';
import { TableColumns, TableConfig } from './Config';
import style from './style.module.less';

const WinManage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<{ total: Number; list: any[] }>({ total: 0, list: [] });
  const [searchParam, setSearchParam] = useState<{ [key: string]: any }>({});
  const [paginationParam, setPaginationParam] = useState<{ pageNum: number; pageSize: number }>({
    pageNum: 1,
    pageSize: 10
  });
  const [form] = Form.useForm();
  const { Item } = Form;
  const { RangePicker } = DatePicker;
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
        dataSource={list.list}
        columns={TableColumns()}
        loading={loading}
        className={style.table}
        scroll={{ x: 'max-content' }}
        {...TableConfig({ total: list.total, paginationParam, setPaginationParam })}
      />
      {/* 发放奖品 */}
    </div>
  );
};
export default WinManage;
