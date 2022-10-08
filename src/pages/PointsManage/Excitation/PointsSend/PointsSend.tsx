import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select } from 'antd';
import { NgTable } from 'src/components';
import { sendStatusOptions } from 'src/pages/PointsManage/Excitation/Excitation';
import { TableColumns } from 'src/pages/PointsManage/Excitation/PointsSend/Config';
import style from './style.module.less';

const PointsSend: React.FC = () => {
  const [list, setList] = useState<any[]>([]);

  const { Item } = Form;
  const [form] = Form.useForm();
  const { Option } = Select;

  // 获取列表
  const getList = () => {
    setList([]);
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <>
      <Button className={style.uploadBtn} type="primary">
        一键导入
      </Button>
      <Form className={style.form} form={form} layout="inline">
        <Item label="客户经理姓名">
          <Input className={style.input} placeholder="请输入" />
        </Item>
        <Item label="任务状态：">
          <Select className={style.select} placeholder="请选择">
            {sendStatusOptions.map((mapItem) => (
              <Option key={mapItem.value}>{mapItem.label}</Option>
            ))}
          </Select>
        </Item>
        <Button className={style.submitBtn} type="primary">
          查询
        </Button>
        <Button className={style.resetBtn}>重置</Button>
      </Form>
      <NgTable
        rowSelection={{ onChange: () => 1 }}
        columns={TableColumns()}
        scroll={{ x: 'max-content' }}
        dataSource={list}
        className={style.table}
      />
      {list.length === 0 || (
        <div className={style.batchSendWrap}>
          <Button className={style.batchSendBtn}>批量发放</Button>
        </div>
      )}
    </>
  );
};
export default PointsSend;
