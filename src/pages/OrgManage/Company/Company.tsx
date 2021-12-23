/**
 * @name Company
 * @author Lester
 * @date 2021-12-21 13:57
 */
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { setTitle } from 'lester-tools';
import { Table, TableColumnProps, Button } from 'antd';
import { Form } from 'src/components';
import { queryCompanyList } from 'src/apis/company';
import { ItemProps } from 'src/utils/interface';
import style from './style.module.less';

interface CompanyItem {
  corpId: string;
  corpName: string;
  status: number;
}

const Company: React.FC<RouteComponentProps> = ({ history }) => {
  const [companyList, setCompanyList] = useState([]);

  const columns: TableColumnProps<CompanyItem>[] = [
    {
      title: '企业名称',
      dataIndex: 'corpName'
    },
    {
      title: '企业ID',
      dataIndex: 'corpId'
    },
    {
      title: '操作',
      render: (text, record) => (
        <Button type="link" onClick={() => history.push('/company/access', { corpId: record.corpId })}>
          查看
        </Button>
      )
    }
  ];

  const formData: ItemProps[] = [
    {
      name: 'name',
      label: '企业',
      placeholder: '可输入企业名称查询',
      type: 'input'
    }
  ];

  const onSubmit = (values: any) => {
    console.log(values);
  };

  const getCompanyList = async () => {
    const res: any = await queryCompanyList();
    if (res) {
      setCompanyList(res);
    }
  };

  useEffect(() => {
    getCompanyList();
    setTitle('企业管理');
  }, []);

  return (
    <div className={style.wrap}>
      <Form itemData={formData} onSubmit={onSubmit} />
      <Table rowKey="corpId" dataSource={companyList} columns={columns} className={style.taleWrap} pagination={false} />
    </div>
  );
};

export default Company;
