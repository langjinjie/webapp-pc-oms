import React, { lazy } from 'react';
import { RouteProps, Switch, Route } from 'react-router-dom';

const routes: RouteProps[] = [
  // 账号管理
  {
    path: '/orgManage',
    component: lazy(() => import('src/pages/OrgManage/AccountManage/AccountManage'))
  }
];

const Orgmanage: React.FC = () => {
  return (
    <div>
      <Switch>
        {routes.map((route, index) => (
          <Route key={index + '' + route.path} path={route.path} component={route.component} />
        ))}
      </Switch>
    </div>
  );
};
export default Orgmanage;
