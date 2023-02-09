import React from 'react';
import classNames from 'classnames';
import style from './style.module.less';

interface ITabsProps {
  tabs: any[];
  tabIndex: number;
  setTabIndex: (param: number) => void;
  fetchList?: (() => Promise<void>)[];
}

const Tabs: React.FC<ITabsProps> = ({ tabs, tabIndex, setTabIndex, fetchList }) => {
  const clickTabHandle = (index: number) => {
    return () => {
      setTabIndex(index);
      fetchList && fetchList[index]?.();
    };
  };
  return (
    <div className={style.tabsWrap}>
      {tabs.map((item, index) => (
        <span
          key={item}
          className={classNames(style.tabItem, { [style.active]: index === tabIndex })}
          onClick={clickTabHandle(index)}
        >
          {item}
        </span>
      ))}
    </div>
  );
};
export default Tabs;
