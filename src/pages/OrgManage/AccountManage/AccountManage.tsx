import React, { lazy } from 'react';
import { RouteProps, Route } from 'react-router-dom';

const routes: RouteProps[] = [
  {
    path: '/orgManage',
    component: lazy(() => import('src/pages/OrgManage/AccountManage/CorpList/CorpList'))
  }
];

const AccountManage: React.FC = () => {
  return (
    <div>
      {routes.map((route, index) => (
        <Route key={index + '' + route.path} path={route.path} component={route.component} />
      ))}
    </div>
  );
};
export default AccountManage;
