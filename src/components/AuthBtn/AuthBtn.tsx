/**
 * @name AuthBtn
 * @author Lester
 * @date 2022-05-20 17:04
 */
import React, { useContext } from 'react';
import { Context } from 'src/store';

interface AuthBtnProps {
  path: string;
}

const AuthBtn: React.FC<AuthBtnProps> = ({ path, children }) => {
  const { btnList } = useContext(Context);
  if (!btnList.includes(path)) {
    return null;
  }
  return <>{children}</>;
};

export default AuthBtn;
