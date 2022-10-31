import classNames from 'classnames';
import React from 'react';

import styles from './style.module.less';

const Cockpit: React.FC = () => {
  return (
    <div className={styles.cockpit}>
      <div className={styles.cockpitBanner}>
        <h2 className={styles.bannerTitle}>智能驾驶舱</h2>
        <p className={styles.subTitle}>
          <span>掌握数据</span> <span className="ml20">助力决策</span>
        </p>
      </div>
      <div className={styles.cockpitBody}>
        <div>
          <div className={classNames('flex justify-between', styles.panelHeader)}>
            <h3 className={styles.panelTitle}>关键指标</h3>
            <span className={styles.time}>2022-06-04 11:30:00</span>
          </div>
          <ul className={classNames(styles.importantTarget, 'flex justify-between')}>
            <li>
              <dl>
                <dd>今日客户总人数</dd>
                <dd>6,906</dd>
                <dd>
                  较昨日 <span>+120</span>
                </dd>
                <dt></dt>
              </dl>
            </li>
            <li>
              <dl>
                <dd>今日新增客户数</dd>
                <dd>6,906</dd>
                <dd>
                  较昨日 <span>+120</span>
                </dd>
                <dt></dt>
              </dl>
            </li>
            <li>
              <dl>
                <dd>今日删除客户数</dd>
                <dd>6,906</dd>
                <dd>
                  较昨日 <span>+120</span>
                </dd>
                <dt></dt>
              </dl>
            </li>
            <li>
              <dl>
                <dd>昨日联系客户数</dd>
                <dd>6,906</dd>
                <dd>
                  较昨日 <span>+120</span>
                </dd>
                <dt></dt>
              </dl>
            </li>
          </ul>
        </div>

        <div>
          <h3>关键指标趋势</h3>
          <div>
            <div>
              <h4>客户总人数</h4>
              <div></div>
            </div>
            <div>
              <h4>分中心排名</h4>
            </div>
          </div>
        </div>

        <div>
          <div>
            <h3>团队排名</h3>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cockpit;
