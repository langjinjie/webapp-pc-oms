import React, { Key, useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, Row, Select } from 'antd';
import { SelectStaff /* , TagModal */ } from 'src/pages/StaffManage/components';
import { NgTable } from 'src/components';
import { tableColumnsFun } from './Config';
import style from './style.module.less';
import { PlusOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

const MomentCode: React.FC = () => {
  const [list, setList] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [form] = Form.useForm();
  const { Item } = Form;
  const { RangePicker } = DatePicker;

  const history = useHistory();

  const getList = () => {
    const list = [
      {
        codeId: 'HM0000001',
        codeName: '超白金客户群1',
        userStaff: '多人',
        channel: '企业微信',
        codeStatus: '正常',
        createrBy: '经理小王',
        createTime: '2022-12-22 15:42:21',
        updateTime: '2022-12-22 15:42:21',
        QRcodeState: { total: 1, soonLimit: 0, timeLimit: 0 }
      },
      {
        codeId: 'HM0000002',
        codeName: '超白金客户群2',
        userStaff: '张三斯',
        channel: '公众号',
        codeStatus: '正常',
        createrBy: '经理小王',
        createTime: '2022-12-22 18:42:21',
        updateTime: '2022-12-22 18:42:21',
        QRcodeState: { total: 1, soonLimit: 0, timeLimit: 0 }
      },
      {
        codeId: 'HM0000003',
        codeName: '财保群',
        userStaff: '张三斯',
        channel: '企业微信',
        codeStatus: '正常',
        createrBy: '经理小王',
        createTime: '2022-12-21 12:42:21',
        updateTime: '2022-12-21 12:42:21',
        QRcodeState: { total: 1, soonLimit: 0, timeLimit: 0 }
      },
      {
        codeId: 'HM0000004',
        codeName: '客户服务节群1',
        userStaff: '张三斯',
        channel: '企业微信',
        codeStatus: '已作废',
        createrBy: '经理小王',
        createTime: '2022-05-01 15:42:21',
        updateTime: '2022-05-01 15:42:21',
        QRcodeState: { total: 1, soonLimit: 0, timeLimit: 0 }
      },
      {
        codeId: 'HM0000004',
        codeName: '客户服务节群2',
        userStaff: '张三斯',
        channel: '企业微信',
        codeStatus: '已作废',
        createrBy: '经理小王',
        createTime: '2022-06-23 16:44:45',
        updateTime: '2022-06-23 16:44:45',
        QRcodeState: { total: 1, soonLimit: 0, timeLimit: 0 }
      },
      {
        codeId: 'HM0000004',
        codeName: '客户服务节群3',
        userStaff: '张三斯',
        channel: '企业微信',
        codeStatus: '已作废',
        createrBy: '经理小王',
        createTime: '2022-06-30 18:32:34',
        updateTime: '2022-06-30 18:32:34',
        QRcodeState: { total: 1, soonLimit: 0, timeLimit: 0 }
      }
    ];
    setList(list);
  };

  const onSelectChange = (selectedRowKeys: Key[]) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection: any = {
    // hideSelectAll: true,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: Key[]) => {
      onSelectChange(selectedRowKeys);
    },
    getCheckboxProps: (record: any) => {
      console.log('record.codeStatus', record.codeStatus);
      return {
        // disabled: record.codeStatus !== '正常'
        disabled: record.codeStatus === '已作废'
      };
    }
  };

  useEffect(() => {
    getList();
  }, []);
  return (
    <div className={style.wrap}>
      <h1>群活码列表</h1>
      <Form className={style.form} form={form}>
        <Row>
          <Item label="群活码ID">
            <Input placeholder="请输入" />
          </Item>
          <Item label="群活码名称">
            <Input placeholder="请输入" />
          </Item>
          <Item label="投放渠道">
            <Select options={[]} placeholder="请选择" />
          </Item>
          <Item label="创建时间">
            <RangePicker allowClear />
          </Item>
        </Row>
        <Row>
          <Item label="更新时间">
            <RangePicker allowClear />
          </Item>
          <Item label="使用员工">
            <SelectStaff type="staff" />
          </Item>
          <Button className={style.submitBtn} type="primary" htmlType="submit">
            查询
          </Button>
          <Button className={style.resetBtn} htmlType="reset">
            重置
          </Button>
        </Row>
      </Form>
      <div className={style.addCode}>
        <Button
          className={style.addCodeBtn}
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => history.push('/momentCode/addCode')}
        >
          新增群活码
        </Button>
      </div>
      <NgTable
        rowKey="codeId"
        columns={tableColumnsFun()}
        scroll={{ x: 'max-content' }}
        dataSource={list}
        rowSelection={rowSelection}
      />
      <div className={style.batch}>
        <Button className={style.batchVoid}>批量作废</Button>
        <Button className={style.batchDel}>批量删除</Button>
        <Button className={style.batchDownLoad}>批量下载</Button>
      </div>
    </div>
  );
};
export default MomentCode;
