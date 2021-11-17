import React from 'react';
import classNames from 'classnames';
import style from './style.module.less';

interface ITabsProps {
  tabs: any[];
  tabIndex: number;
  setTabIndex: (param: number) => void;
  showCurrentTabContent?: (() => Promise<void>)[];
}

const Tabs: React.FC<ITabsProps> = ({ tabs, tabIndex, setTabIndex, showCurrentTabContent }) => {
  const clickTabHandle = (index: number) => {
    return () => {
      setTabIndex(index);
      showCurrentTabContent && showCurrentTabContent[index]();
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
