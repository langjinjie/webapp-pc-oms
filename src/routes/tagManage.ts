import { lazy } from 'react';
import { RouteProps } from 'react-router-dom';

export const tagManage: RouteProps[] = [
  {
    path: '/tagParsing',
    component: lazy(() => import('src/pages/SystemSettings/TagParsing/TagParsing'))
  },
  {
    path: '/tagParsing/clientDetail',
    component: lazy(() => import('src/pages/Exception/DeletionReminder/ClientDetail/ClientDetail'))
  },
  {
    path: '/tagParsing/chatLog',
    component: lazy(() => import('src/pages/Exception/DeletionReminder/ChatLog/ChatLog'))
  }
];
