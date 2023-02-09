import React, { Key, useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, Row, Select } from 'antd';
import { SelectStaff /* , TagModal */ } from 'src/pages/StaffManage/components';
import { NgTable } from 'src/components';
import { tableColumnsFun } from './Config';
import { PlusOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { requestGetGroupLiveCodeList } from 'src/apis/liveCode';
import style from './style.module.less';

const MomentCode: React.FC = () => {
  const [list, setList] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [form] = Form.useForm();
  const { Item } = Form;
  const { RangePicker } = DatePicker;

  const history = useHistory();

  const getList = async () => {
    const res = await requestGetGroupLiveCodeList({});
    console.log('res', res);
    if (res) {
      setList(res.list);
    }
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
