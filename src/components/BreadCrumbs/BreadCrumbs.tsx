/**
 * @name BreadCrumbs
 * @author Lester
 * @date 2021-07-01 15:14
 */

import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useHistory, useLocation } from 'react-router-dom';
import { Nav } from 'src/utils/interface';
import style from './style.module.less';

interface BreadCrumbsProps {
  navClick?: (index: number) => void;
  navList?: Nav[];
  className?: string;
}

const BreadCrumbs: React.FC<BreadCrumbsProps> = ({ navList, navClick, className }) => {
  const history = useHistory();
  const location = useLocation();

  const newNavList = useMemo(() => {
    return navList || (location.state as { navList?: Nav[] })?.navList || [];
  }, [location]);
  // 点击Nav
  const clickNavListHandle = (path: string) => {
    history.push(path!);
  };

  return (
    <ul className={classNames(style.breadList, className)}>
      <li className={style.breadItem}>当前位置：</li>
      {newNavList.map((item, index: number) => (
        <li
          key={item.name}
          className={classNames(style.breadItem, {
            [style.link]: index < newNavList.length - 1
          })}
        >
          <span
            className={style.breadName}
            onClick={() => {
              if (navClick) {
                navClick(index);
              } else {
                if (index < newNavList.length - 1) {
                  if (item.path) {
                    clickNavListHandle(item.path!);
                  } else {
                    history.goBack();
                  }
                }
              }
            }}
          >
            {item.name}
          </span>
          {index < newNavList.length - 1 && <span className={style.splitSign}>/</span>}
        </li>
      ))}
    </ul>
  );
};

export default BreadCrumbs;
