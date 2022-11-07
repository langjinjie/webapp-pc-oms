import classNames from 'classnames';
import React from 'react';
import * as echarts from 'echarts/core';
import { Table } from 'antd';
import {
  tableColumns1,
  tableColumns2,
  tableColumns3,
  tableColumns4,
  tableColumns5,
  tableColumnsSubCenterRangking
} from './Config';
import { NgLineChart, NgTable } from 'src/components';
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
          <div className={'flex justify-between pt20'}>
            <div className={styles.ngLineChart}>
              <h4 className={styles.ngLineChartTitle}>客户总人数</h4>
              <div className={'pt40'}>
                <NgLineChart
                  options={{
                    xAxis: {
                      type: 'category',
                      boundaryGap: false,
                      data: ['10/31', '11/01', '11/02', '11/03', '11/04', '11/05', '11/06']
                    },
                    yAxis: {
                      type: 'value',
                      splitLine: {
                        lineStyle: {
                          color: 'rgba(82, 81, 125, 1)',
                          type: 'dashed'
                        }
                      }
                    },
                    series: [
                      {
                        data: [150, 230, 321, 356, 387, 400, 410],
                        type: 'line',
                        smooth: true,
                        areaStyle: {
                          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                              offset: 0,
                              color: 'rgba(255, 134, 46, 0.2)'
                            },
                            {
                              offset: 1,
                              color: 'rgba(255, 134, 46, 0)'
                            }
                          ])
                        },
                        lineStyle: {
                          width: 2,
                          color: 'rgba(255, 155, 27, 1)'
                        },
                        itemStyle: { color: 'rgb(255, 155, 27)' }
                      }
                    ]
                  }}
                />
              </div>
              <div></div>
            </div>
            <div className={styles.ranking}>
              <div className={classNames(styles.titleWrap, 'flex justify-between')}>
                <span>分中心排名</span>
                <span>2022-06-04</span>
              </div>
              <NgTable
                className={styles.rankingTable}
                scroll={{ x: 'max-content' }}
                columns={tableColumnsSubCenterRangking()}
              />
            </div>
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
              <Table rowKey={'taskId'} columns={tableColumns2()} scroll={{ x: 'max-content' }} />
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
