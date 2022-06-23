/**
 * @name Index
 * @author Lester
 * @date 2021-05-07 09:26
 */

import React, { useContext } from 'react';
import style from './style.module.less';
import { Context } from 'src/store';
import { useDocumentTitle } from 'src/utils/base';
import { IconTag } from 'src/components/IconSvgs/IconTag';
const Index: React.FC = () => {
  useDocumentTitle('内部运营系统');
  const { userInfo } = useContext(Context);
  return (
    <div className={style.wrap}>
      {userInfo?.corpName}欢迎您
      <IconTag color="red" />
    </div>
  );
};

export default Index;
