/**
 * @name CompanyFeature
 * @author Lester
 * @date 2022-05-16 10:59
 */
import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { BreadCrumbs } from 'src/components';
import { queryCompanyFeature } from 'src/apis/company';
import { PricilegeItem } from 'src/pages/RoleManage/components';
import { MenuItem } from 'src/utils/interface';
import style from './style.module.less';

const CompanyFeature: React.FC<RouteComponentProps> = ({ location }) => {
  const [featureList, setFeatureList] = useState<MenuItem[]>([]);

  const getFeatureList = async () => {
    const { corpId }: any = location.state;
    const res: any = await queryCompanyFeature({ corpId });
    if (res) {
      setFeatureList(res);
    }
  };

  useEffect(() => {
    getFeatureList();
  }, []);

  return (
    <div className={style.wrap}>
      <BreadCrumbs navList={[{ name: '企业管理' }, { name: '查看功能' }]} />
      <div className={style.title}>功能权限</div>
      <div className={style.featureList}>
        {featureList.map((item) => (
          <PricilegeItem key={item.sysType} item={item} readonly />
        ))}
      </div>
    </div>
  );
};

export default CompanyFeature;
