/**
 * @name BreadCrumbs
 * @author Lester
 * @date 2021-07-01 15:14
 */

import React from 'react';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { Nav } from 'src/utils/interface';
import style from './style.module.less';

interface BreadCrumbsProps {
  navClick?: (index: number) => void;
  navList: Nav[];
}

const BreadCrumbs: React.FC<BreadCrumbsProps> = ({ navList, navClick }) => {
  const history = useHistory();
  // 点击Nav
  const clickNavListHandle = (path: string) => {
    history.push(path!);
  };

  return (
    <ul className={style.breadList}>
      <li className={style.currentItem}>当前位置：</li>
      {navList.map((item, index: number) => (
        <li
          key={item.name}
          className={classNames(style.breadItem, {
            [style.link]: index < navList.length - 1
          })}
        >
          <span
            className={style.breadName}
            onClick={() => {
              if (navClick) {
                navClick(index);
              } else {
                if (index < navList.length - 1) {
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
          {index < navList.length - 1 && <span className={style.splitSign}>/</span>}
        </li>
      ))}
    </ul>
  );
};

export default BreadCrumbs;
