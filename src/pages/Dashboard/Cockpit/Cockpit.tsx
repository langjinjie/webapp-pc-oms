import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
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
import { NgTable } from 'src/components';
import { ECOption, NgLineChart } from 'src/components/LineChart/LineChart';
import { requestGetBicontrolAdminView } from 'src/apis/dashboard';
import { IBicontrolAdminView } from 'src/utils/interface';
import Map from 'src/pages/Dashboard/components/Map/Map';
import styles from './style.module.less';

const Cockpit: React.FC = () => {
  const [bicontrolAdminView, setBicontrolAdminView] = useState<IBicontrolAdminView>();
  const [lineChartData, setLineChatrData] = useState<{ xAxisData: any[]; yAxisData: any[] }>({
    xAxisData: [],
    yAxisData: []
  });

  // 获取总体数据
  const getBicontrolAdminView = async () => {
    const res: IBicontrolAdminView = await requestGetBicontrolAdminView();
    if (res) {
      // 处理关键指标
      const bicontrolAdminView: IBicontrolAdminView = {
        ...res,
        compareTotalClientCnt: res.totalClientCnt - res.lastTotalClientCnt,
        compareAddClientCnt: res.dayAddClientCnt - res.lastDayAddClientCnt,
        compareDelClientCnt: res.dayDelClientCnt - res.lastDayDelClientCnt,
        compareChatFriendCount: res.chatFriendCount - res.lastChatFriendCount
      };
      setBicontrolAdminView(bicontrolAdminView);
      // 处理折线图数据
      const lineChartData = {
        xAxisData: res.totalClientCntList.map((mapItem) => mapItem.dataX),
        yAxisData: res.totalClientCntList.map((mapItem) => mapItem.dataY)
      };
      // 处理地图数据
      bicontrolAdminView.tagDistbList.forEach((item) => {
        item.name = item.provName;
        item.value = item.clientCnt;
        item.tooltip = {
          show: true,
          formatter: `${item.provName}<br/>
          客户数 <b class="italic">${item.clientCnt}</b><br/>
          互动客户数 <b class="italic">${item.interactClientCnt}</b><br/>
          沉默客户数 <b class="italic">${item.silClientCnt}</b>`
        };
      });
      console.log('bicontrolAdminView.tagDistbList', bicontrolAdminView.tagDistbList);
      setLineChatrData(lineChartData);
    }
  };
  const ngLineChartOptions: ECOption = {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: lineChartData.xAxisData
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
    tooltip: {
      show: true,
      trigger: 'axis',
      formatter (params: any) {
        return `<div class="tooltip">
        <div>${params[0].name}</div>
        <div class="mt10 bold">客户总人数：${params[0].value}</div>
      </div>`;
      },
      textStyle: { color: '#fff' },
      backgroundColor: 'rgba(0,0,0,0.6)',
      borderColor: 'transparent',
      padding: 10,
      borderRadius: 16,
      extraCssText: 'box-shadow: none; opacity: 0.9'
    },
    series: [
      {
        data: lineChartData.yAxisData,
        type: 'line',
        smooth: true,
        symbolSize: 6,
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
          width: 4,
          color: 'rgba(255, 155, 27, 1)'
        },
        itemStyle: { color: 'rgb(255, 155, 27)' }
      }
    ]
  };

  useEffect(() => {
    getBicontrolAdminView();
  }, []);
  return (
    <div className={styles.cockpit}>
      <div className={styles.cockpitBanner}>
        <h2 className={styles.bannerTitle}>智能驾驶舱</h2>
        <p className={styles.subTitle}>
          <span>掌握数据</span> <span className="ml20">助力决策</span>
        </p>
      </div>
      <div className={styles.cockpitBody}>
        {/* 关键指标 */}
        <div>
          <div className={classNames('flex justify-between', styles.panelHeader)}>
            <h3 className={styles.panelTitle}>关键指标</h3>
            <span className={styles.time}>{bicontrolAdminView?.dayUpdate}</span>
          </div>
          <ul className={classNames(styles.importantTarget, 'flex justify-between')}>
            <li className={classNames(styles.targetItem, 'cell')}>
              <dl>
                <dt className={classNames(styles.targetIcon, styles.targetIcon1)}></dt>
                <dd>今日客户总人数</dd>
                <dd className={styles.count}>{bicontrolAdminView?.totalClientCnt || 0}</dd>
                <dd className="mt14 mr5">
                  较昨日
                  <span
                    className={
                      (bicontrolAdminView?.compareTotalClientCnt || 0) >= 0 ? 'color-success' : 'color-danger '
                    }
                  >
                    {((bicontrolAdminView?.compareTotalClientCnt || 0) >= 0 ? '+' : '') +
                      (bicontrolAdminView?.compareTotalClientCnt || 0)}
                  </span>
                </dd>
              </dl>
            </li>
            <li className={classNames(styles.targetItem, 'cell')}>
              <dl>
                <dt className={classNames(styles.targetIcon, styles.targetIcon2)}></dt>
                <dd>今日新增客户数</dd>
                <dd className={styles.count}>{bicontrolAdminView?.dayAddClientCnt || 0}</dd>
                <dd className="mt14">
                  较昨日
                  <span
                    className={(bicontrolAdminView?.compareAddClientCnt || 0) >= 0 ? 'color-success' : 'color-danger '}
                  >
                    {((bicontrolAdminView?.compareAddClientCnt || 0) >= 0 ? '+' : '') +
                      (bicontrolAdminView?.compareAddClientCnt || 0)}
                  </span>
                </dd>
              </dl>
            </li>
            <li className={classNames(styles.targetItem, 'cell')}>
              <dl>
                <dt className={classNames(styles.targetIcon, styles.targetIcon3)}></dt>
                <dd>今日删除客户数</dd>
                <dd className={styles.count}>{bicontrolAdminView?.dayDelClientCnt || 0}</dd>
                <dd className="mt14">
                  较昨日
                  <span
                    className={(bicontrolAdminView?.compareDelClientCnt || 0) >= 0 ? 'color-success' : 'color-danger '}
                  >
                    {((bicontrolAdminView?.compareDelClientCnt || 0) >= 0 ? '+' : '') +
                      (bicontrolAdminView?.compareDelClientCnt || 0)}
                  </span>
                </dd>
              </dl>
            </li>
            <li className={classNames(styles.targetItem, 'cell')}>
              <dl>
                <dt className={classNames(styles.targetIcon, styles.targetIcon4)}></dt>
                <dd>昨日联系客户数</dd>
                <dd className={styles.count}>{bicontrolAdminView?.chatFriendCount || 0}</dd>
                <dd className="mt14">
                  较昨日
                  <span
                    className={
                      (bicontrolAdminView?.compareChatFriendCount || 0) >= 0 ? 'color-success' : 'color-danger '
                    }
                  >
                    {((bicontrolAdminView?.compareChatFriendCount || 0) >= 0 ? '+' : '') +
                      (bicontrolAdminView?.compareChatFriendCount || 0)}
                  </span>
                </dd>
              </dl>
            </li>
          </ul>
        </div>

        {/* 折线图及分区排名 */}
        <div className="mt40">
          <div className={classNames('flex justify-between', styles.panelHeader)}>
            <h3 className={styles.panelTitle}>关键指标趋势</h3>
          </div>
          <div className={'flex justify-between pt20'}>
            <div className={styles.ngLineChart}>
              <h4 className={styles.ngLineChartTitle}>客户总人数</h4>
              <div className={'pt40'}>
                <NgLineChart options={ngLineChartOptions} />
              </div>
              <div></div>
            </div>
            <div className={styles.ranking}>
              <div className={classNames(styles.titleWrap, 'flex justify-between')}>
                <span>分中心排名</span>
                <span>2022-06-04</span>
              </div>
              <NgTable
                rowKey={'areaName'}
                className={styles.rankingTable}
                scroll={{ x: 'max-content' }}
                columns={tableColumnsSubCenterRangking()}
                dataSource={bicontrolAdminView?.areaRankList}
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
            <div className={styles.mapWrap}>
              <Map data={bicontrolAdminView?.tagDistbList || []} />
              <span className={styles.totalClient}>
                总客户数
                <span className={styles.num}>
                  {((bicontrolAdminView?.totalClientCnt || 0) + '').replace(/\B(?=(\d{3})+\b)/g, ',')}
                </span>
              </span>
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
