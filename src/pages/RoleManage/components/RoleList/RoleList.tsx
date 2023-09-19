import React, { useEffect, useState, Key, useContext } from 'react';
import { Button, Form, Input, message, Table, TableColumnProps } from 'antd';
import { Icon, NgTable, Modal, AuthBtn, OrgTree } from 'src/components';
// import { OrganizationalTree } from 'src/pages/RoleManage/components';
import { TableColumns, TablePagination } from './Config';
import { IRoleList } from 'src/utils/interface';
import { roleTypeRouteList } from 'src/utils/commonData';
import { useHistory } from 'react-router-dom';
import {
  requesetGetRoleList,
  requestGetRoleAccountList,
  requestAddOrEditRoleAccount,
  requestGetCurRoleUserList
} from 'src/apis/roleMange';
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
  const [treeValue, setTreeValue] = useState<any[]>([]);
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
    if (res) {
      setRoleList(res);
    }
    setLoading(false);
  };
  // 提交
  const onFinishHandle = (values: { name: string }) => {
    setSearchParam(values);
    setPaginationParam((param) => ({ ...param, pageNum: 1 }));
  };
  // 重置
  const onResetHandle = () => {
    setSearchParam({});
    // setPaginationParam((param) => ({ ...param, pageNum: 1 }));
    setPaginationParam((param) => ({ ...param, pageNum: 1, pageSize: 10 }));
  };
  // 新增角色
  const addRole = () => {
    history.push(roleTypeRouteList[roleType - 1]);
  };
  // 管理成员
  const onOk = async () => {
    const res = await requestAddOrEditRoleAccount({
      roleId: adminModalParam.roleId,
      staffList: staffList.map((item) => ({ staffId: item }))
    });
    if (res) {
      message.success('添加/管理成功');
      setAdminParam((param) => ({ ...param, visible: false }));
    }
  };
  const rowSelection = {
    selectedRowKeys: staffList,
    onChange: (keys: Key[]) => {
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
    if (res) {
      setStaffList(res.staffList.map((item: any) => item.staffId));
    }
  };
  // 添加管理成员
  const treeOnOk = async (value: any) => {
    const staffList = value
      .filter((filterItem: any) => filterItem.staffId)
      .map((item: any) => ({ staffId: item.staffId }));
    const deptList = value
      .filter((filterItem: any) => !filterItem.staffId)
      .map((item: any) => ({ deptId: item.deptId }));
    const res = await requestAddOrEditRoleAccount({ roleId: params.roleId, staffList, deptList });
    if (res) {
      message.success('添加/管理成功');
    }
  };
  const treeOnchange = (value: any) => {
    setTreeValue(value);
  };
  // 打开选择组织架构选择树
  const clickTree = async (added: boolean, roleId: string) => {
    if (roleType === 1) {
      setAdminParam({ visible: true, roleId });
    } else {
      // 获取当前角色得成员
      const res = await requestGetCurRoleUserList({ roleId });
      if (res) {
        treeOnchange([...(res.staffList || []), ...(res.deptList || [])]);
        console.log('added', added);
        setParams({ visible: true, added, roleId });
      }
    }
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
      <AuthBtn path="/add">
        <Button
          className={style.addRole}
          type="primary"
          icon={<Icon className={style.btnAddIcon} name="xinjian" />}
          onClick={addRole}
        >
          新增角色
        </Button>
      </AuthBtn>
      <AuthBtn path="/query">
        <Form className={style.form} onFinish={onFinishHandle} onReset={onResetHandle}>
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
      </AuthBtn>
      <NgTable
        className={style.table}
        setRowKey={(row) => row.roleId}
        dataSource={roleList.list}
        loading={loading}
        columns={TableColumns(roleType, clickTree, setPaginationParam)}
        scroll={{ x: 'max-content' }}
        {...TablePagination({
          roleType,
          total: roleList.total,
          paginationParam,
          setPaginationParam
        })}
      />
      {/* 添加/编辑成员 */}
      <OrgTree
        value={treeValue}
        onChange={treeOnchange}
        title={params.added ? '添加成员' : '管理成员'}
        visible={params.visible}
        onCancel={() => setParams((params) => ({ ...params, visible: false }))}
        onOk={treeOnOk}
        isDeleted={0}
      />
      <Modal
        className={style.adminModal}
        title="管理成员"
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
