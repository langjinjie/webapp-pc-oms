import React, { useEffect, useState, Key, useContext } from 'react';
import { Button, Form, Input, Table, TableColumnProps } from 'antd';
import { Icon, NgTable, Modal } from 'src/components';
import { OrganizationalTree } from 'src/pages/RoleManage/components';
import { TableColumns, TablePagination } from './Config';
import { IRoleList } from 'src/utils/interface';
import { roleTypeRouteList } from 'src/utils/commonData';
import { useHistory } from 'react-router-dom';
import { requesetGetRoleList, requestGetRoleAccountList, requestAddOrEditRoleAccount } from 'src/apis/roleMange';
import { queryAccountList } from 'src/apis/company';
import { Context } from 'src/store';
import style from './style.module.less';

interface IRoleType {
  roleType: 1 | 2 | 3;
}

interface IRoleListParam {
  total: number;
  list: IRoleList[];
}

interface AccountItem {
  adminId: string;
  userName: string;
  name: string;
  isAdmin: number;
}

const RoleList: React.FC<IRoleType> = ({ roleType }) => {
  const { currentCorpId: corpId } = useContext<{ currentCorpId: string }>(Context);
  const [roleList, setRoleList] = useState<IRoleListParam>({ total: 0, list: [] });
  const [adminModalParam, setAdminParam] = useState<{ visible: boolean; roleId: string }>({
    visible: false,
    roleId: ''
  });
  const [staffList, setStaffList] = useState<Key[]>([]);
  const [accountList, setAccountList] = useState<AccountItem[]>([]);
  const [searchParam, setSearchParam] = useState<{ [key: string]: any }>({});
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
  // const roleType2Name = ['后管端角色', 'B端角色', 'A端角色'];
  const history = useHistory();
  const { Item } = Form;
  const adminColumns: TableColumnProps<AccountItem>[] = [
    {
      title: '员工姓名',
      dataIndex: 'name'
    },
    {
      title: '员工账号',
      dataIndex: 'userName'
    }
  ];
  // 获取列表
  const getDetail = async () => {
    setLoading(true);
    const res = await requesetGetRoleList({ roleType, ...searchParam, ...paginationParam });
    console.log(res);
    console.log('roleType', roleType);
    setRoleList(res);
    setLoading(false);
  };
  // 提交
  const onFinishHandle = (values: { name: string }) => {
    setSearchParam(values);
    setPaginationParam((param) => ({ ...param, pageNum: 1 }));
  };
  // 新增角色
  const addRole = () => {
    console.log(roleTypeRouteList[roleType - 1]);
    history.push(roleTypeRouteList[roleType - 1]);
  };
  // 管理成员
  const onOk = async () => {
    const res = await requestAddOrEditRoleAccount({
      roleId: adminModalParam.roleId,
      staffList: staffList.map((item) => ({ staffId: item }))
    });
    console.log(res);
  };
  const rowSelection = {
    selectedRowKeys: staffList,
    onChange: (keys: Key[]) => {
      console.log(keys);
      setStaffList(keys);
    }
  };
  const getAccountList = async (corpId: string) => {
    const res: any = await queryAccountList({ corpId });
    if (res) {
      setAccountList(res);
    }
  };
  // 获取角色成员列表
  const roleAccountList = async () => {
    const res = await requestGetRoleAccountList({ roleId: adminModalParam.roleId });
    console.log(res);
    if (res) {
      setStaffList(res.staffList.map((item: any) => item.staffId));
    }
  };
  // 添加管理成员
  const treeOnOk = async (value: any) => {
    console.log('value', value);
    // await requestAddOrEditRoleAccount({ roleId: params.roleId });
  };
  useEffect(() => {
    getDetail();
  }, [paginationParam]);
  useEffect(() => {
    corpId && getAccountList(corpId);
  }, [corpId]);
  useEffect(() => {
    adminModalParam.visible && roleAccountList();
  }, [adminModalParam]);
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
        className={style.table}
        setRowKey={(row) => row.roleId}
        dataSource={roleList.list}
        loading={loading}
        columns={TableColumns(roleType, setParams, setAdminParam, setPaginationParam)}
        scroll={{ x: 'max-content' }}
        {...TablePagination({
          roleType,
          total: roleList.total,
          paginationParam,
          setPaginationParam
        })}
      />
      {/* 添加/编辑成员 */}
      <OrganizationalTree selectedDept={true} showStaff={true} params={params} setParams={setParams} onOk={treeOnOk} />
      <Modal
        className={style.adminModal}
        title="添加/管理成员"
        visible={adminModalParam.visible}
        onClose={() => setAdminParam((param) => ({ ...param, visible: false }))}
        onOk={onOk}
      >
        <Table
          rowKey="adminId"
          dataSource={accountList}
          columns={adminColumns}
          pagination={false}
          rowSelection={rowSelection}
          scroll={{ y: 400 }}
        />
      </Modal>
    </div>
  );
};
export default RoleList;
