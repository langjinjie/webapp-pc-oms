import classNames from 'classnames';
import React from 'react';
import { Table } from 'antd';
import { tableColumns1, tableColumns2, tableColumns3, tableColumns4, tableColumns5 } from './Config';
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
            <li className={classNames(styles.targetItem, 'cell')}>
              <dl>
                <dt className={classNames(styles.targetIcon, styles.targetIcon1)}></dt>
                <dd>今日客户总人数</dd>
                <dd className={styles.count}>6,906</dd>
                <dd className="mt14">
                  较昨日 <span className="color-danger ">+120</span>
                </dd>
              </dl>
            </li>
            <li className={classNames(styles.targetItem, 'cell')}>
              <dl>
                <dt className={classNames(styles.targetIcon, styles.targetIcon2)}></dt>
                <dd>今日新增客户数</dd>
                <dd>6,906</dd>
                <dd>
                  较昨日 <span>+120</span>
                </dd>
              </dl>
            </li>
            <li className={classNames(styles.targetItem, 'cell')}>
              <dl>
                <dt className={classNames(styles.targetIcon, styles.targetIcon3)}></dt>
                <dd>今日删除客户数</dd>
                <dd>6,906</dd>
                <dd>
                  较昨日 <span>+120</span>
                </dd>
              </dl>
            </li>
            <li className={classNames(styles.targetItem, 'cell')}>
              <dl>
                <dt className={classNames(styles.targetIcon, styles.targetIcon4)}></dt>
                <dd>昨日联系客户数</dd>
                <dd>6,906</dd>
                <dd>
                  较昨日 <span>+120</span>
                </dd>
              </dl>
            </li>
          </ul>
        </div>

        <div className="mt40">
          <div className={classNames('flex justify-between', styles.panelHeader)}>
            <h3 className={styles.panelTitle}>关键指标趋势</h3>
          </div>
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
        <div className="mt40">
          <div className={classNames('flex justify-between')}>
            <div className={classNames('flex justify-between', styles.panelHeaderChildren1)}>
              <h3 className={styles.panelTitle}>团队排名</h3>
              <span className={styles.time}>2022-06-04 11:30:00</span>
            </div>
            <div className={classNames('flex justify-between', styles.panelHeaderChildren2)}>
              <h3 className={styles.panelTitle}>客户经理排名</h3>
              <span className={styles.time}>2022-06-04 11:30:00</span>
            </div>
          </div>
          <div className={styles.tableBox}>
            <div className={styles.table}>
              <Table rowKey={'taskId'} columns={tableColumns1()} />
            </div>
            <div className={styles.table}>
              <Table rowKey={'taskId'} columns={tableColumns2()} />
            </div>
          </div>
        </div>
        <div className="mt40">
          <div className={classNames('flex justify-between')}>
            <div className={classNames('flex justify-between', styles.panelHeaderChildren1)}>
              <h3 className={styles.panelTitle}>特征标签</h3>
              <span className={styles.time}>2022-06-04 11:30:00</span>
            </div>
            <div className={classNames('flex justify-between', styles.panelHeaderChildren2)}>
              <h3 className={styles.panelTitle}>文章查看情况</h3>
              <span className={styles.time}>2022-06-04 11:30:00</span>
            </div>
          </div>

          <div className={styles.tableBox}>
            <div className={''}>
              <div>地图</div>
            </div>
            <div className={styles.table1}>
              <div className={styles.browse}>浏览客户数</div>
              <div className={styles.browseNum}>16.362</div>
              <Table rowKey={'taskId'} columns={tableColumns3()} />
            </div>
          </div>
        </div>
        <div className="mt40">
          <div className={classNames('flex justify-between')}>
            <div className={classNames('flex justify-between', styles.panelHeaderChildren1)}>
              <h3 className={styles.panelTitle}>产品偏好</h3>
              <span className={styles.time}>2022-06-04 11:30:00</span>
            </div>
            <div className={classNames('flex justify-between', styles.panelHeaderChildren2)}>
              <h3 className={styles.panelTitle}>销售概率</h3>
              <span className={styles.time}>2022-06-04 11:30:00</span>
            </div>
          </div>
          <div className={styles.tableBox}>
            <div className={styles.table2}>
              <div className={styles.browse}>浏览客户数</div>
              <div className={styles.browseNum}>1362</div>
              <Table rowKey={'taskId'} columns={tableColumns4()} />
            </div>
            <div className={styles.table}>
              <Table rowKey={'taskId'} columns={tableColumns5()} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cockpit;
