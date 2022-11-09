import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Spin, Table } from 'antd';
import {
  tableColumns1,
  tableColumns2,
  tableColumns3,
  tableColumns4,
  tableColumns5,
  tableColumnsSubCenterRangking
} from './Config';
import { NgTable } from 'src/components';
import {
  requestGetBicontrolAdminView,
  requestGetBicontrolTeamlist,
  requestGetBicontrolStafflist,
  requestGetBicontrolNewstypelist,
  requestGetBicontrolProductlist,
  requestGetBicontrolTagslist
} from 'src/apis/dashboard';
import { IBicontrolAdminView } from 'src/utils/interface';
import LineChart from 'src/pages/Dashboard/Cockpit/LineChart';
import Map from 'src/pages/Dashboard/components/Map/Map';
import styles from './style.module.less';

const Cockpit: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [bicontrolAdminView, setBicontrolAdminView] = useState<IBicontrolAdminView>(); // 总体数据
  const [lineChartData, setLineChatrData] = useState<{ xAxisData: any[]; yAxisData: any[] }>({
    xAxisData: [],
    yAxisData: []
  });
  // 团队排名
  const [teamlistLoading, setTeamlistLoading] = useState(true);
  const [bicontrolTeamlist, setBicontrolTeamlist] = useState<{ day: string; list: any[] }>({ day: '', list: [] });
  const [teamlistPagination, setTeamlistPagination] = useState<{
    total: number;
    pageNum: number;
    sort?: number;
  }>({
    total: 0,
    pageNum: 1
  });
  // 客户经理排名
  const [stafflistLoading, setStafflistLoading] = useState(true);
  const [bicontrolStafflist, setBicontrolStafflist] = useState<{ day: string; list: any[] }>({ day: '', list: [] });
  const [stafflistPagination, setStafflistPagination] = useState<{
    total: number;
    pageNum: number;
    sort?: number;
  }>({
    total: 0,
    pageNum: 1
  });
  // 文章排名列表
  const [newsListLoading, setNewsListLoading] = useState(true);
  const [bicontrolNewsList, setBicontrolNewsList] = useState<{ day: string; list: any[] }>({ day: '', list: [] });
  const [newsListPagination, setNewsListPagination] = useState<{
    total: number;
    pageNum: number;
    sort?: number;
  }>({
    total: 0,
    pageNum: 1
  });
  // 产品排名列表
  const [productlistLoading, setProductlistLoading] = useState(true);
  const [bicontrolProductlist, setBicontrolProductlist] = useState<{ day: string; list: any[]; sumTotalCnt: number }>({
    day: '',
    list: [],
    sumTotalCnt: 0
  });
  const [productlistPagination, setProductlistPagination] = useState<{
    total: number;
    pageNum: number;
    sort?: number;
  }>({
    total: 0,
    pageNum: 1
  });
  // 险种排名
  const [tagslistLoading, setTagslistLoading] = useState(false);
  const [bicontrolTagslist, setBicontrolTagslist] = useState<{ day: string; list: any[] }>({ day: '', list: [] });
  const [tagslistPagination, setTagslistPagination] = useState<{
    total: number;
    pageNum: number;
    sort?: number;
  }>({
    total: 0,
    pageNum: 1
  });

  // 获取总体数据
  const getBicontrolAdminView = async () => {
    setLoading(true);
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
      bicontrolAdminView.tagDistbList =
        bicontrolAdminView?.tagDistbList.map((item) => {
          return {
            ...item,
            name: item.provName,
            value: item.clientCnt,
            tooltip: {
              show: true,
              formatter: `${item.provName}<br/>
          客户数 <b class="italic">${item.clientCnt}</b><br/>
          互动客户数 <b class="italic">${item.interactClientCnt}</b><br/>
          沉默客户数 <b class="italic">${item.silClientCnt}</b>`
            }
          };
        }) || [];
      // 处理地图数据
      setBicontrolAdminView(bicontrolAdminView);
      // 处理折线图数据
      const lineChartData = {
        xAxisData: res.totalClientCntList.map((mapItem) => mapItem.dataX),
        yAxisData: res.totalClientCntList.map((mapItem) => mapItem.dataY)
      };
      setLineChatrData(lineChartData);
    }
    setLoading(false);
  };

  // 获取团队排名
  const getBicontrolTeamlist = async (param?: { sort?: number; pageNum?: number }) => {
    setTeamlistLoading(true);
    const res = await requestGetBicontrolTeamlist({ pageNum: teamlistPagination.pageNum, ...param });
    if (res) {
      const { list, total, day } = res;
      setBicontrolTeamlist({ day, list });
      setTeamlistPagination((param) => ({ ...param, pageNum: param.pageNum, total }));
    }
    setTeamlistLoading(false);
  };
  const teamlistOnChange = (pagination: any, _: any, sorter: any) => {
    console.log('pagination', pagination);
    let sort = teamlistPagination.sort;
    let newTeamlistPagination: any = {};
    if (pagination.current === pagination.pageNum) {
      // 点击筛选
      switch (sorter.field) {
        /**
         * 联系客户数 1=倒序，2=升序;
         * 人均联系客户数 3=倒序，4=升序;
         * 内容发送次数 5=倒序，6=升序
         */
        // 联系客户数
        case 'chatFriendCount':
          if (sorter.order === 'descend') {
            sort = 1;
          } else if (sorter.order === 'ascend') {
            sort = 2;
          }
          break;
        // 人均联系客户数
        case 'perChatFriendCount':
          if (sorter.order === 'descend') {
            sort = 3;
          } else if (sorter.order === 'ascend') {
            sort = 4;
          }
          break;
        // 内容发送次数
        case 'dayMarket':
          if (sorter.order === 'descend') {
            sort = 5;
          } else if (sorter.order === 'ascend') {
            sort = 6;
          }
          break;

        default:
          break;
      }
      newTeamlistPagination = { ...teamlistPagination, pageNum: 1, sort };
    } else {
      // 点击分页
      newTeamlistPagination = { ...teamlistPagination, pageNum: pagination.current };
    }
    setTeamlistPagination(newTeamlistPagination);
    getBicontrolTeamlist({ pageNum: newTeamlistPagination.pageNum, sort });
  };

  // 获取客户经理排名
  const getBicontrolStafflist = async (param?: { sort?: number; pageNum?: number }) => {
    setStafflistLoading(true);
    const res = await requestGetBicontrolStafflist({ ...param });
    if (res) {
      const { list, day, total } = res;
      setBicontrolStafflist({ list, day });
      setStafflistPagination((param) => ({ ...param, pageNum: param.pageNum, total }));
    }
    setStafflistLoading(false);
  };
  const stafflistOnChange = (pagination: any, _: any, sorter: any) => {
    console.log('pagination', pagination);
    let newStafflistPagination: any = {};
    let sort = stafflistPagination.sort;
    if (pagination.current === pagination.pageNum) {
      // 排序

      /**
       * 联系客户数 1=倒序，2=升序;
       * 内容发送次数 5=倒序，6=升序
       */
      switch (sorter.field) {
        // 联系客户数
        case 'chatCnt':
          if (sorter.order === 'descend') {
            sort = 1;
          } else if (sorter.order === 'ascend') {
            sort = 2;
          }
          break;
        // 内容发送次数
        case 'dayMarket':
          if (sorter.order === 'descend') {
            sort = 5;
          } else if (sorter.order === 'ascend') {
            sort = 6;
          }
          break;

        default:
          break;
      }
      newStafflistPagination = { ...stafflistPagination, pageNum: 1, sort };
    } else {
      // 分页
      newStafflistPagination = { ...stafflistPagination, pageNum: pagination.current, sort };
    }
    setStafflistPagination(newStafflistPagination);
    getBicontrolStafflist({ pageNum: newStafflistPagination.pageNum });
  };

  // 文章查看情况
  const getBicontrolNewsList = async (param?: { sort?: number; pageNum?: number }) => {
    setNewsListLoading(true);
    const res = await requestGetBicontrolNewstypelist({ ...param });
    if (res) {
      const { day, list, total } = res;
      setBicontrolNewsList({ day, list });
      setNewsListPagination((param) => ({ ...param, pageNum: param.pageNum, total }));
    }
    setNewsListLoading(false);
  };
  const newsListOnChange = (pagination: any, _: any, sorter: any) => {
    let sort = newsListPagination.sort;
    let newNewsListPagination: any = {};
    if (pagination.current === pagination.pageNum) {
      // 排序
      /**
       * 客户浏览人数 1=倒序，2=升序;
       */
      switch (sorter.field) {
        // 联系客户数
        case 'totalCnt':
          if (sorter.order === 'descend') {
            sort = 1;
          } else if (sorter.order === 'ascend') {
            sort = 2;
          }
          break;
        default:
          break;
      }
      newNewsListPagination = { ...newsListPagination, pageNum: 1, sort };
    } else {
      // 分页
      newNewsListPagination = { ...newsListPagination, pageNum: pagination.current };
    }
    setNewsListPagination(newNewsListPagination);
    getBicontrolNewsList({ sort, pageNum: newNewsListPagination.pageNum });
  };

  // 查看产品排名
  const getBicontrolProductlist = async (param?: { sort?: number; pageNum?: number }) => {
    setProductlistLoading(true);
    const res = await requestGetBicontrolProductlist({ pageNum: productlistPagination.pageNum, ...param });
    if (res) {
      const { day, list, sumTotalCnt, total } = res;
      setBicontrolProductlist({ day, list, sumTotalCnt });
      setProductlistPagination((param) => ({ ...param, pageNum: param.pageNum, total }));
    }
    setProductlistLoading(false);
  };
  const productlistOnChange = (pagination: any, _: any, sorter: any) => {
    let sort = productlistPagination.sort;
    let newProductlistPagination: any = {};
    if (pagination.current === pagination.pageNum) {
      // 排序
      /**
       * 客户浏览人数 1=倒序，2=升序;
       */
      switch (sorter.field) {
        // 客户浏览人数
        case 'totalCnt':
          if (sorter.order === 'descend') {
            sort = 1;
          } else if (sorter.order === 'ascend') {
            sort = 2;
          }
          break;
        default:
          break;
      }
      newProductlistPagination = { ...productlistPagination, pageNum: 1, sort };
    } else {
      // 分页
      newProductlistPagination = { ...productlistPagination, pageNum: pagination.current };
    }
    setProductlistPagination(newProductlistPagination);
    getBicontrolProductlist({ sort, pageNum: newProductlistPagination.pageNum });
  };

  // 险种排名
  const getBicontrolTagslist = async (param?: { sort?: number; pageNum?: number }) => {
    setTagslistLoading(true);
    const res = await requestGetBicontrolTagslist({ ...param, pageNum: tagslistPagination.pageNum });
    if (res) {
      const { day, list, total } = res;
      setBicontrolTagslist({ day, list });
      setTagslistPagination((param) => ({ ...param, pageNum: param.pageNum, total }));
    }
    setTagslistLoading(false);
  };
  const tagslistOnChange = (pagination: any, _: any, sorter: any) => {
    let sort = tagslistPagination.sort;
    let newTagslistPagination: any = {};
    if (pagination.current === pagination.pageNum) {
      // 排序
      /**
       * 浏览客户数 1=倒序，2=升序;
       * 客户占比 3=倒序，4=升序;
       */
      switch (sorter.field) {
        // 浏览客户数
        case 'totalCnt':
          if (sorter.order === 'descend') {
            sort = 1;
          } else if (sorter.order === 'ascend') {
            sort = 2;
          }
          break;
        // 客户占比
        case 'clientRate':
          if (sorter.order === 'descend') {
            sort = 3;
          } else if (sorter.order === 'ascend') {
            sort = 4;
          }
          break;
        // 内容发送次数
        case 'dayMarket':
          if (sorter.order === 'descend') {
            sort = 5;
          } else if (sorter.order === 'ascend') {
            sort = 6;
          }
          break;

        default:
          break;
      }
      newTagslistPagination = { ...tagslistPagination, pageNum: 1, sort };
    } else {
      newTagslistPagination = { ...tagslistPagination, pageNum: pagination.current };
    }
    setTagslistPagination(newTagslistPagination);
    getBicontrolTagslist({ sort, pageNum: newTagslistPagination.pageNum });
  };

  useEffect(() => {
    // 总体数据
    getBicontrolAdminView();
    // 团队排名
    getBicontrolTeamlist();
    // 客户经理
    getBicontrolStafflist();
    // 文章分类
    getBicontrolNewsList();
    // 产品排名
    getBicontrolProductlist();
    // 险种排名
    getBicontrolTagslist();
  }, []);
  return (
    <Spin spinning={loading} tip="加载中...">
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
                  <dd className="mt14">
                    较昨日
                    <span
                      className={classNames(
                        'ml5',
                        (bicontrolAdminView?.compareTotalClientCnt || 0) >= 0 ? 'color-success' : 'color-danger '
                      )}
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
                      className={classNames(
                        'ml5',
                        (bicontrolAdminView?.compareAddClientCnt || 0) >= 0 ? 'color-success' : 'color-danger '
                      )}
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
                      className={classNames(
                        'ml5',
                        (bicontrolAdminView?.compareDelClientCnt || 0) >= 0 ? 'color-success' : 'color-danger '
                      )}
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
                      className={classNames(
                        'ml5',
                        (bicontrolAdminView?.compareChatFriendCount || 0) >= 0 ? 'color-success' : 'color-danger '
                      )}
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
                  <LineChart lineChartData={lineChartData} />
                </div>
                <div></div>
              </div>
              <div className={styles.ranking}>
                <div className={classNames(styles.titleWrap, 'flex justify-between')}>
                  <span>分中心排名</span>
                  <span>{bicontrolAdminView?.areaDay}</span>
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
                <span className={styles.time}>{bicontrolTeamlist.day}</span>
              </div>
              <div className={classNames('flex justify-between', styles.panelHeaderChildren2)}>
                <h3 className={styles.panelTitle}>客户经理排名</h3>
                <span className={styles.time}>{bicontrolStafflist.day}</span>
              </div>
            </div>
            <div className={styles.tableBox}>
              <div className={styles.table}>
                {/* 团队排名 */}
                <Table
                  rowKey={'leaderId'}
                  dataSource={bicontrolTeamlist.list}
                  columns={tableColumns1()}
                  pagination={{
                    ...teamlistPagination,
                    current: teamlistPagination.pageNum,
                    showSizeChanger: false,
                    showTotal: (total: number) => `共${total}条记录`
                  }}
                  onChange={teamlistOnChange}
                  loading={teamlistLoading}
                />
              </div>
              <div className={styles.table}>
                {/* 客户经理排名 */}
                <Table
                  rowKey={'userId'}
                  columns={tableColumns2()}
                  dataSource={bicontrolStafflist.list}
                  pagination={{
                    ...stafflistPagination,
                    current: stafflistPagination.pageNum,
                    showSizeChanger: false,
                    showTotal: (total: number) => `共${total}条记录`
                  }}
                  onChange={stafflistOnChange}
                  loading={stafflistLoading}
                />
              </div>
            </div>
          </div>
          <div className="mt40">
            <div className={classNames('flex justify-between')}>
              <div className={classNames('flex justify-between', styles.panelHeaderChildren1)}>
                <h3 className={styles.panelTitle}>特征标签</h3>
                <span className={styles.time}>{bicontrolAdminView?.tagDay}</span>
              </div>
              <div className={classNames('flex justify-between', styles.panelHeaderChildren2)}>
                <h3 className={styles.panelTitle}>文章查看情况</h3>
                <span className={styles.time}>{bicontrolNewsList.day}</span>
              </div>
            </div>

            <div className={styles.tableBox}>
              <div className={styles.mapWrap}>
                <Map data={bicontrolAdminView?.tagDistbList} />
                <span className={styles.totalClient}>
                  总客户数
                  <span className={styles.num}>
                    {((bicontrolAdminView?.totalClientCnt || 0) + '').replace(/\B(?=(\d{3})+\b)/g, ',')}
                  </span>
                </span>
              </div>
              <div className={styles.table1}>
                <div className={styles.browse}>浏览客户数</div>
                <div className={styles.browseNum}>{}</div>
                {/* 文章查看情况 */}
                <Table
                  rowKey={({ sort, title }: { sort: number; title: string }) => sort + title}
                  columns={tableColumns3()}
                  dataSource={bicontrolNewsList.list}
                  pagination={{
                    ...newsListPagination,
                    current: newsListPagination.pageNum,
                    showSizeChanger: false,
                    showTotal: (total: number) => `共${total}条记录`
                  }}
                  onChange={newsListOnChange}
                  loading={newsListLoading}
                />
              </div>
            </div>
          </div>
          <div className="mt40">
            <div className={classNames('flex justify-between')}>
              <div className={classNames('flex justify-between', styles.panelHeaderChildren1)}>
                <h3 className={styles.panelTitle}>产品偏好</h3>
                <span className={styles.time}>{bicontrolProductlist.day}</span>
              </div>
              <div className={classNames('flex justify-between', styles.panelHeaderChildren2)}>
                <h3 className={styles.panelTitle}>销售概率</h3>
                <span className={styles.time}>{bicontrolTagslist.day}</span>
              </div>
            </div>
            <div className={styles.tableBox}>
              <div className={styles.table2}>
                <div className={styles.browse}>浏览客户数</div>
                <div className={styles.browseNum}>{bicontrolProductlist.sumTotalCnt}</div>
                <Table
                  rowKey={'title'}
                  columns={tableColumns4()}
                  dataSource={bicontrolProductlist.list}
                  pagination={{
                    ...productlistPagination,
                    current: productlistPagination.pageNum,
                    showSizeChanger: false,
                    showTotal: (total: number) => `共${total}条记录`
                  }}
                  onChange={productlistOnChange}
                  loading={productlistLoading}
                />
              </div>
              <div className={styles.table}>
                <Table
                  rowKey={({ sort, title }: { sort: number; title: string }) => sort + title}
                  columns={tableColumns5()}
                  dataSource={bicontrolTagslist.list}
                  pagination={{
                    ...tagslistPagination,
                    current: tagslistPagination.pageNum,
                    showSizeChanger: false,
                    showTotal: (total: number) => `共${total}条记录`
                  }}
                  onChange={tagslistOnChange}
                  loading={tagslistLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default Cockpit;
