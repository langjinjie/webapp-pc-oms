/**
 * @name Company
 * @author Lester
 * @date 2021-12-21 13:57
 */
import React, { useEffect, useState, Key } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { setTitle } from 'lester-tools';
import { Table, TableColumnProps, Button, message } from 'antd';
import { Form, Icon, Modal } from 'src/components';
import { queryCompanyList, queryAuthUrl, queryAccountList, setAdminUser } from 'src/apis/company';
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
    const res: any = await setAdminUser({ corpId: currentCorpId, list: selectIds });
    if (res) {
      setAdminVisible(false);
      message.success('设置成功！');
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
          <Button type="link" onClick={() => history.push('/company/access', { corpId: record.corpId })}>
            查看
          </Button>
          <Button type="link" onClick={() => getAuthUrl(record.corpId)}>
            授权
          </Button>
          <Button type="link" onClick={() => history.push('/company/feature', { corpId: record.corpId })}>
            查看功能
          </Button>
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
    console.log(currentCorpId);
  }, []);

  return (
    <div className={style.wrap}>
      <div className={style.addBtn} onClick={() => history.push('/company/access')}>
        <Icon className={style.addIcon} name="xinjian" />
        添加企业
      </div>
      <Form itemData={formData} onSubmit={onSubmit} />
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
