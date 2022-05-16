/**
 * @name CompanyFeature
 * @author Lester
 * @date 2022-05-16 10:59
 */
import React from 'react';
import { Collapse } from 'antd';
import { BreadCrumbs } from 'src/components';
import style from './style.module.less';

const { Panel } = Collapse;
const CompanyFeature: React.FC = () => {
  return (
    <div className={style.wrap}>
      <BreadCrumbs navList={[{ name: '企业管理' }, { name: '查看功能' }]} />
      <div className={style.title}>功能权限</div>
      <Collapse accordion>
        <Panel key={1} header="年高后管端（M端）"></Panel>
        <Panel key={2} header="客户经理端（A端）"></Panel>
      </Collapse>
    </div>
  );
};

export default CompanyFeature;
