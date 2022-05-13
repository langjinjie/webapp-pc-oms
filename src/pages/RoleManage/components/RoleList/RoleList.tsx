import React, { useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { Icon, NgTable } from 'src/components';
import { AddOrEditUser } from 'src/pages/RoleManage/components';
import { TableColumns, TablePagination } from './Config';
import { IRoleList } from 'src/utils/interface';
import { roleTypeRouteList } from 'src/utils/commonData';
import { useHistory } from 'react-router-dom';
import style from './style.module.less';

interface IRoleType {
  roleType: 1 | 2 | 3;
}

interface IRoleListParam {
  total: number;
  list: IRoleList[];
}

const RoleList: React.FC<IRoleType> = ({ roleType }) => {
  const [roleList, setRoleList] = useState<IRoleListParam>({ total: 0, list: [] });
  const [roleName, setRoleName] = useState('');
  // 添加/编辑成岩
  const [params, setParams] = useState<{ visible: boolean; added: boolean; roleId: string }>({
    visible: false,
    added: true,
    roleId: ''
  });
  const [paginationParam, setPaginationParam] = useState<{ pageNum: number; pageSize: number }>({
    pageNum: 1,
    pageSize: 10
  });
  const [loading, setLoading] = useState(true);
  const roleType2Name = ['后管端角色', 'B端角色', 'A端角色'];
  const history = useHistory();
  const { Item } = Form;
  // 获取列表
  const getDetail = () => {
    setLoading(true);
    console.log('roleName', roleName);
    console.log('roleType', roleType);
    setTimeout(() => {
      const list = new Array(10).fill(1).map((_, index) => ({
        roleId: 1 + index + '',
        roleName: '超级管理员-' + roleType2Name[roleType - 1],
        status: (index % 3) % 2,
        roleRange: '默认全部',
        isDefault: index % 2,
        userNum: 66
      }));
      setRoleList({ total: list.length, list });
      setLoading(false);
    }, 300);
  };
  const inputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoleName(event.target.value);
  };
  // 提交
  const onFinishHandle = (values: { name: string }) => {
    console.log(values);
    setPaginationParam((param) => ({ ...param, pageNum: 1 }));
  };
  // 新增角色
  const addRole = () => {
    console.log(roleTypeRouteList[roleType - 1]);
    history.push(roleTypeRouteList[roleType - 1]);
  };
  useEffect(() => {
    getDetail();
  }, [paginationParam]);
  return (
    <div className={style.wrap}>
      <Button
        className={style.addRole}
        type="primary"
        icon={<Icon className={style.btnAddIcon} name="xinjian" />}
        onClick={addRole}
      >
        新增角色
      </Button>
      <Form className={style.form} onFinish={onFinishHandle}>
        <Item name="roleName" label="角色名称">
          <Input className={style.input} placeholder="请输入" onChange={inputOnChange} />
        </Item>
        <Button className={style.searchBtn} type="primary" htmlType="submit">
          查询
        </Button>
        <Button className={style.resetBtn} htmlType="reset">
          重置
        </Button>
      </Form>
      <NgTable
        className={style.table}
        setRowKey={(row) => row.roleId}
        dataSource={roleList.list}
        loading={loading}
        columns={TableColumns(roleType, setParams)}
        scroll={{ x: 'max-content' }}
        {...TablePagination({
          roleType,
          total: roleList.total,
          paginationParam,
          setPaginationParam
        })}
      />
      {/* 添加/编辑成员 */}
      <AddOrEditUser params={params} setParams={setParams} />
    </div>
  );
};
export default RoleList;
