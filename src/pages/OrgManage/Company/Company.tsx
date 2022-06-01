/**
 * @name Company
 * @author Lester
 * @date 2021-12-21 13:57
 */
import React, { useEffect, useState, Key } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { setTitle } from 'tenacity-tools';
import { Table, TableColumnProps, Button, message, Popconfirm } from 'antd';
import { Form, Icon, Modal, AuthBtn } from 'src/components';
import { queryCompanyList, queryAuthUrl, queryAccountList, setAdminUser, copyCompanyFeature } from 'src/apis/company';
import { ItemProps } from 'src/utils/interface';
import style from './style.module.less';

interface CompanyItem {
  corpId: string;
  corpName: string;
  corpFullName: string;
  status: number;
}

interface AccountItem {
  adminId: string;
  userName: string;
  name: string;
  isAdmin: number;
}

const Company: React.FC<RouteComponentProps> = ({ history }) => {
  const [companyList, setCompanyList] = useState<CompanyItem[]>([]);
  const [adminVisible, setAdminVisible] = useState<boolean>(false);
  const [currentCorpId, setCurrentCorpId] = useState<string>('');
  const [accountList, setAccountList] = useState<AccountItem[]>([]);
  const [selectIds, setSelectIds] = useState<Key[]>([]);

  const formData: ItemProps[] = [
    {
      name: 'corpFullName',
      label: '企业',
      placeholder: '可输入企业名称查询',
      type: 'input'
    }
  ];

  const getAuthUrl = async (corpId: string) => {
    const res: any = await queryAuthUrl({
      corpId,
      urlType: 1,
      authType: 1
    });
    if (res) {
      window.open(res);
    }
  };

  const getAccountList = async (corpId: string) => {
    const res: any = await queryAccountList({ corpId });
    if (res) {
      setAccountList(res);
      setSelectIds(res.filter((item: AccountItem) => item.isAdmin === 1).map((item: AccountItem) => item.adminId));
    }
  };

  const setAdmin = async () => {
    const res: any = await setAdminUser({
      corpId: currentCorpId,
      list: selectIds.map((val) => ({ adminId: val }))
    });
    if (res) {
      setAdminVisible(false);
      message.success('设置成功！');
    }
  };

  const copyFeature = async (targetCorpId: string) => {
    const res: any = await copyCompanyFeature({ targetCorpId });
    if (res) {
      message.success('复制成功!');
    }
  };

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

  const columns: TableColumnProps<CompanyItem>[] = [
    {
      title: '企业名称',
      dataIndex: 'corpFullName'
    },
    {
      title: '企业ID',
      dataIndex: 'corpId'
    },
    {
      title: '操作',
      render: (text, record) => (
        <>
          <AuthBtn path="/view">
            <Button type="link" onClick={() => history.push('/company/access', { corpId: record.corpId })}>
              查看
            </Button>
          </AuthBtn>
          <AuthBtn path="/auth">
            <Button type="link" onClick={() => getAuthUrl(record.corpId)}>
              授权
            </Button>
          </AuthBtn>
          <AuthBtn path="/featureView">
            <Button type="link" onClick={() => history.push('/company/feature', { corpId: record.corpId })}>
              查看功能
            </Button>
          </AuthBtn>
          <AuthBtn path="/setAdmin">
            <Button
              type="link"
              onClick={() => {
                setCurrentCorpId(record.corpId);
                setAdminVisible(true);
                getAccountList(record.corpId);
              }}
            >
              设置企业超级管理员
            </Button>
          </AuthBtn>
          <AuthBtn path="/copy">
            <Popconfirm title="确认要一键复制当前企业功能权限到此企业吗？" onConfirm={() => copyFeature(record.corpId)}>
              <Button type="link">一键复制功能权限</Button>
            </Popconfirm>
          </AuthBtn>
        </>
      )
    }
  ];

  const getCompanyList = async (param = {}) => {
    const res: any = await queryCompanyList(param);
    if (res) {
      setCompanyList(res);
    }
  };

  const onSubmit = (values: any) => getCompanyList(values);

  const rowSelection = {
    selectedRowKeys: selectIds,
    onChange: (keys: Key[]) => {
      console.log(keys);
      setSelectIds(keys);
    }
  };

  useEffect(() => {
    getCompanyList();
    setTitle('企业管理');
  }, []);

  return (
    <div className={style.wrap}>
      <AuthBtn path="/add">
        <div className={style.addBtn} onClick={() => history.push('/company/access')}>
          <Icon className={style.addIcon} name="xinjian" />
          添加企业
        </div>
      </AuthBtn>
      <AuthBtn path="/search">
        <Form itemData={formData} onSubmit={onSubmit} />
      </AuthBtn>
      <Table className={style.taleWrap} rowKey="corpId" dataSource={companyList} columns={columns} pagination={false} />
      <Modal
        className={style.adminModal}
        title="设置企业超级管理员"
        visible={adminVisible}
        onClose={() => setAdminVisible(false)}
        onOk={setAdmin}
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

export default Company;
