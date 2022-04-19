import React, { useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { Icon, NgTable } from 'src/components';
import { TableColumns } from './Config';
import style from './style.module.less';

const RoleOms: React.FC = () => {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { Item } = Form;
  // 获取列表
  const getDetail = () => {
    setTimeout(() => {
      setList([{ roleId: '001', roleName: '超级管理员', status: 1, range: '默认全部' }]);
      setLoading(false);
    }, 1000);
  };
  // 提交
  const onFinishHandle = (values: any) => {
    console.log(values);
  };
  useEffect(() => {
    getDetail();
  }, []);
  return (
    <div className={style.wrap}>
      <Button className={style.addRole} type="primary" icon={<Icon className={style.btnAddIcon} name="xinjian" />}>
        新增角色
      </Button>
      <Form className={style.form} onFinish={onFinishHandle}>
        <Item name="name" label="角色名称">
          <Input className={style.input} placeholder="请输入" />
        </Item>
        <Button className={style.searchBtn} type="primary" htmlType="submit">
          查询
        </Button>
        <Button className={style.resetBtn} htmlType="reset">
          重置
        </Button>
      </Form>
      <NgTable
        setRowKey={(row) => row.roleId}
        dataSource={list}
        loading={loading}
        columns={TableColumns()}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};
export default RoleOms;
