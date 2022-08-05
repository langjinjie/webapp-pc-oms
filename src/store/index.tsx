/**
 * @name index
 * @author Lester
 * @date 2021-05-10 19:56
 */

import React, { createContext, useState, Context as ContextProps } from 'react';
import { InstItem, IConfirmModalParam, MenuItem, NodeType } from 'src/utils/interface';

export const Context: ContextProps<any> = createContext({});

const StoreContext: React.FC = ({ children }) => {
  const [userInfo, setUserInfo] = useState<any>({});
  const [instList, setInstList] = useState<InstItem[]>([]);
  const [isMainCorp, setIsMainCorp] = useState<boolean>(true);
  const [currentCorpId, setCurrentCorpId] = useState<string>('');
  const [articleCategoryList, setArticleCategoryList] = useState<any[]>([]);
  const [articleTagList, setArticleTagList] = useState<any[]>([]);
  const [confirmModalParam, setConfirmModalParam] = useState<IConfirmModalParam>({ visible: false });
  const [menuList, setMenuList] = useState<MenuItem[]>([]);
  const [btnList, setBtnList] = useState<string[]>([]);
  const [nodeOptions, setNodeOptions] = useState<NodeType[]>([]);

  return (
    <Context.Provider
      value={{
        userInfo,
        setUserInfo: (state: any) => setUserInfo({ ...userInfo, ...state }),
        instList,
        setInstList,
        isMainCorp,
        setIsMainCorp,
        currentCorpId,
        setCurrentCorpId,
        articleCategoryList,
        setArticleCategoryList,
        articleTagList,
        setArticleTagList,
        confirmModalParam,
        setConfirmModalParam,
        menuList,
        setMenuList,
        btnList,
        setBtnList,
        nodeOptions,
        setNodeOptions
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default StoreContext;
