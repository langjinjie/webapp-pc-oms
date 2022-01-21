/**
 * @name Company
 * @author Lester
 * @date 2021-12-21 13:57
 */
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { setTitle } from 'lester-tools';
import { Table, TableColumnProps, Button } from 'antd';
import { Form, Icon } from 'src/components';
import { queryCompanyList, queryAuthUrl } from 'src/apis/company';
import { ItemProps } from 'src/utils/interface';
import style from './style.module.less';

interface CompanyItem {
  corpId: string;
  corpName: string;
  corpFullName: string;
  status: number;
}

const Company: React.FC<RouteComponentProps> = ({ history }) => {
  const [companyList, setCompanyList] = useState([]);

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
        </>
      )
    }
  ];

  const formData: ItemProps[] = [
    {
      name: 'corpFullName',
      label: '企业',
      placeholder: '可输入企业名称查询',
      type: 'input'
    }
  ];

  const getCompanyList = async (param = {}) => {
    const res: any = await queryCompanyList(param);
    if (res) {
      setCompanyList(res);
    }
  };

  const onSubmit = (values: any) => getCompanyList(values);

  useEffect(() => {
    getCompanyList();
    setTitle('企业管理');
  }, []);

  return (
    <div className={style.wrap}>
      <div className={style.addBtn} onClick={() => history.push('/company/access')}>
        <Icon className={style.addIcon} name="xinjian" />
        添加企业
      </div>
      <Form itemData={formData} onSubmit={onSubmit} />
      <Table rowKey="corpId" dataSource={companyList} columns={columns} className={style.taleWrap} pagination={false} />
    </div>
  );
};

export default Company;
