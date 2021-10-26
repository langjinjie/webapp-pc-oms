/**
 * @name SeatReport
 * @author Lester
 * @date 2021-10-22 14:03
 */
import React, { useState, useEffect } from 'react';
import { Select, Button, Table, TableColumnType } from 'antd';
import Dom2Img from 'dom-to-image';
import classNames from 'classnames';
import { queryReportList, queryReportDetail } from 'src/apis/seatReport';
import { downloadImage } from 'src/utils/base';
import style from './style.module.less';

const { Option } = Select;

interface ReportItem {
  reportId?: string;
  reportName?: string;
  updateTime?: string;
  totalWorkDay?: number;
  weekDay?: number;
}

interface areaGroupItem {
  id: string;
  areaName: string;
  dayAddFriendCount: number;
  totalAddFriendCount: number;
  addFriendRate: string;
  avgCircleCount: number;
  markCarNumRate: string;
  market: number;
  smart: number;
}

interface LevelItem {
  leveName: string;
  perCount: number;
  mark: number;
}

interface StatisticsItem {
  id: string;
  order: number;
  teamName: string;
  dayUsedMark: number;
  multiUseMark: number;
  dayAddFriendCount: number;
  totalAddFriendCount: number;
  addFriendRate: string;
  avgCircleCount: number;
  markCarNumRate: string;
  dayMarket: number;
  daySmart: number;
  perCount?: number;
  trialStarDate?: string;
}

interface ClientManagerItem {
  teamName: string;
  teamShowName: string;
  staffOrderList: StatisticsItem[];
}

interface RePort {
  areaGroupList?: areaGroupItem[];
  ageGroupList?: LevelItem[];
  leveGroupList?: LevelItem[];
  corpGroupList?: LevelItem[];
  teamOrderList?: StatisticsItem[];
  teamDetailList?: ClientManagerItem[];
}

const SeatReport: React.FC = () => {
  const [reportList, setReportList] = useState<ReportItem[]>([]);
  const [currentReport, setCurrentReport] = useState<ReportItem>({});
  const [reportData, setReportData] = useState<RePort>({});

  const showRed = (value: number, data: any[], key: string) => {
    if (value === 0) {
      return true;
    }
    return Math.min(...data.map((item) => +item[key])) === value;
  };

  const tdRender = (value: number, data: any[], key: string) => (
    <dt className={showRed(value, data, key) ? style.red : ''}>{value}</dt>
  );

  const areaGroupColumns: TableColumnType<areaGroupItem>[] = [
    {
      title: '',
      dataIndex: 'areaName',
      align: 'center'
    },
    {
      title: '当日加好友',
      dataIndex: 'dayAddFriendCount',
      align: 'center',
      render: (value) => tdRender(value, reportData.areaGroupList || [], 'dayAddFriendCount')
    },
    {
      title: '累计加好友',
      dataIndex: 'totalAddFriendCount',
      align: 'center',
      render: (value) => tdRender(value, reportData.areaGroupList || [], 'totalAddFriendCount')
    },
    {
      title: '好友通过率',
      dataIndex: 'addFriendRate',
      align: 'center',
      render: (value) => tdRender(+value, reportData.areaGroupList || [], 'addFriendRate')
    },
    {
      title: '人均朋友圈',
      dataIndex: 'avgCircleCount',
      align: 'center',
      render: (value) => tdRender(value, reportData.areaGroupList || [], 'avgCircleCount')
    },
    {
      title: '备注车牌率',
      dataIndex: 'markCarNumRate',
      align: 'center',
      render: (value) => tdRender(+value, reportData.areaGroupList || [], 'markCarNumRate')
    },
    {
      title: '营销平台',
      dataIndex: 'market',
      align: 'center',
      render: (value) => tdRender(value, reportData.areaGroupList || [], 'market')
    },
    {
      title: '销售宝典',
      dataIndex: 'smart',
      align: 'center',
      render: (value) => tdRender(value, reportData.areaGroupList || [], 'smart')
    }
  ];

  const statisticsColumns: TableColumnType<StatisticsItem>[] = [
    {
      title: '实力排名',
      dataIndex: 'order',
      align: 'center'
    },
    {
      title: '团队经理',
      dataIndex: 'teamName',
      align: 'center'
    },
    {
      title: '当日使用分',
      dataIndex: 'dayUsedMark',
      align: 'center'
    },
    {
      title: '综合使用分',
      dataIndex: 'multiUseMark',
      align: 'center'
    },
    {
      title: '当日加好友',
      dataIndex: 'dayAddFriendCount',
      align: 'center'
    },
    {
      title: '累计加好友',
      dataIndex: 'totalAddFriendCount',
      align: 'center'
    },
    {
      title: '好友通过率',
      dataIndex: 'addFriendRate',
      align: 'center'
    },
    {
      title: '人均朋友圈',
      dataIndex: 'avgCircleCount',
      align: 'center'
    },
    {
      title: '备注车牌率',
      dataIndex: 'markCarNumRate',
      align: 'center'
    },
    {
      title: '日营销平台',
      dataIndex: 'dayMarket',
      align: 'center'
    },
    {
      title: '日销售宝典',
      dataIndex: 'daySmart',
      align: 'center'
    }
  ];

  const teamColumns: TableColumnType<StatisticsItem>[] = [
    {
      title: '团队人力',
      dataIndex: 'perCount',
      align: 'center'
    },
    {
      title: '试点日期',
      dataIndex: 'trialStarDate',
      align: 'center'
    }
  ];

  const imgNames: string[] = ['rocket', 'target', 'earth'];

  /**
   * dom转换成图片
   */
  const domToImage = async () => {
    const postEle = document.getElementsByClassName(style.content)[0];
    const res: any = await Dom2Img.toPng(postEle!);
    downloadImage(res, '战报');
  };

  /**
   * 获取战报详情数据
   * @param reportId
   */
  const getReportDetail = async (reportId: string) => {
    const res: any = await queryReportDetail({ reportId });
    if (res) {
      setReportData(res);
      Array.from(document.getElementsByTagName('td')).forEach((ele) => {
        ele.contentEditable = 'true';
      });
      Array.from(document.getElementsByTagName('dt')).forEach((ele) => {
        ele.contentEditable = 'true';
      });
    }
  };

  /**
   * 获取战报列表
   */
  const getReportList = async () => {
    const res: any = await queryReportList();
    if (res) {
      setReportList(res);
      setCurrentReport(res[0]);
      getReportDetail(res[0].reportId);
    }
  };

  useEffect(() => {
    getReportList();
  }, []);

  return (
    <div className={style.wrap}>
      <div className={style.row}>
        <div className={style.colLabel}>更新时间:</div>
        <div className={style.colValue}>
          <Select
            placeholder="请选择"
            onChange={(val) => setCurrentReport(reportList.find((item) => item.reportId === val) || {})}
          >
            {reportList.map((item) => (
              <Option key={item.reportId} value={item.reportId!}>
                {item.reportName}
              </Option>
            ))}
          </Select>
        </div>
        <Button type="primary" onClick={domToImage}>
          导出图片
        </Button>
      </div>
      <div className={style.content}>
        <header className={style.header}>
          <img className={style.reportImg} src={require('src/assets/images/statistics/report_text.png')} alt="" />
        </header>
        <div className={style.timeInfo}>
          <dt>更新时间：{currentReport.updateTime}</dt>
          <dt>累计试点工作日：{currentReport.totalWorkDay}</dt>
          <dt>本周已过工作日：{currentReport.weekDay}</dt>
        </div>
        <div className={style.reportTitle}>
          <img className={style.titleImg} src={require('src/assets/images/statistics/report_title.png')} alt="" />
          <div className={style.titleTips}>
            说明：使用实力分为加好友量+朋友圈发送情况+累计好友通过率+累计车牌备注率+调用营销平台次数+调用销售宝典次数的综合情况，
            <span className={style.red}>营销平台和销售宝典会放大倍数哦！</span>
          </div>
        </div>
        <section className={style.sectionWrap}>
          <div className={style.sectionTitle}>
            <img className={style.msgImg} src={require('src/assets/images/statistics/message.png')} alt="" />
            <img className={style.titleImg} src={require('src/assets/images/statistics/title1.png')} alt="" />
          </div>
          <Table
            bordered={false}
            rowKey="areaName"
            columns={areaGroupColumns}
            pagination={false}
            dataSource={reportData.areaGroupList || []}
          />
          <div className={style.levelWrap}>
            <ul className={style.levelList}>
              <li className={style.levelItem} key="header">
                <span className={style.levelColOne}>分年龄段</span>
                <span className={style.levelColTwo}>人力</span>
                <span className={style.levelColThree}>使用分</span>
              </li>
              {(reportData.ageGroupList || []).map((item, index) => (
                <li key={item.leveName} className={style.levelItem}>
                  <dt className={style.levelColOne}>
                    <div
                      className={classNames(style.hotWrap, {
                        [style.hotImg]: index === 0
                      })}
                    >
                      {item.leveName}
                    </div>
                  </dt>
                  <dt className={style.levelColTwo}>{item.perCount}</dt>
                  <dt className={style.levelColThree}>{item.mark}</dt>
                </li>
              ))}
            </ul>
            <ul className={style.levelList}>
              <li className={style.levelItem} key="header">
                <span className={style.levelColOne}>分级别</span>
                <span className={style.levelColTwo}>人力</span>
                <span className={style.levelColThree}>使用分</span>
              </li>
              {(reportData.leveGroupList || []).map((item) => (
                <li key={item.leveName} className={style.levelItem}>
                  <dt className={style.levelColOne}>{item.leveName}</dt>
                  <dt className={style.levelColTwo}>{item.perCount}</dt>
                  <dt className={style.levelColThree}>{item.mark}</dt>
                </li>
              ))}
            </ul>
            <ul className={style.levelList}>
              <li className={style.levelItem} key="header">
                <span className={style.levelColOne}>分司龄段</span>
                <span className={style.levelColTwo}>人力</span>
                <span className={style.levelColThree}>使用分</span>
              </li>
              {(reportData.corpGroupList || []).map((item) => (
                <li key={item.leveName} className={style.levelItem}>
                  <dt className={style.levelColOne}>{item.leveName}</dt>
                  <dt className={style.levelColTwo}>{item.perCount}</dt>
                  <dt className={style.levelColThree}>{item.mark}</dt>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className={style.sectionWrap}>
          <div className={style.sectionTitle}>
            <img className={style.msgImg} src={require('src/assets/images/statistics/message.png')} alt="" />
            <img className={style.titleImg} src={require('src/assets/images/statistics/title2.png')} alt="" />
          </div>
          <Table
            bordered={false}
            rowKey="teamName"
            columns={[
              ...statisticsColumns.map((col, index) => {
                if (index === 0) {
                  return {
                    ...col,
                    render: (value: number, record: any, tableIndex: number) => (
                      <div className={style.hotImgWrap}>
                        <div
                          className={classNames(style.hotWrap, {
                            [style.hotImg]: tableIndex === 0
                          })}
                        >
                          {value}
                        </div>
                      </div>
                    )
                  };
                } else if (index === 1) {
                  return col;
                } else {
                  return {
                    ...col,
                    render: (value: number | string) =>
                      tdRender(+value, reportData.teamOrderList || [], col.dataIndex as string)
                  };
                }
              }),
              ...teamColumns
            ]}
            pagination={false}
            dataSource={reportData.teamOrderList || []}
          />
        </section>
        <section className={style.sectionWrap}>
          <div className={style.sectionTitle}>
            <img className={style.msgImg} src={require('src/assets/images/statistics/message.png')} alt="" />
            <img className={style.titleImg} src={require('src/assets/images/statistics/title3.png')} alt="" />
          </div>
          {(reportData.teamDetailList || []).map((item, index) => (
            <div key={item.teamName} className={style.teamItem}>
              <div className={style.teamName}>{item.teamShowName}</div>
              <div className={style.teamTableWrap}>
                <Table
                  bordered={false}
                  rowKey="teamName"
                  columns={statisticsColumns.map((col, colIndex) => {
                    if (colIndex === 0) {
                      return {
                        ...col,
                        render: (value: number, record: any, tableIndex: number) => (
                          <div className={style.hotImgWrap}>
                            <div
                              className={classNames(style.hotWrap, {
                                [style.hotImg]: tableIndex < 3
                              })}
                            >
                              {value}
                            </div>
                          </div>
                        )
                      };
                    } else if (colIndex === 1) {
                      return col;
                    } else {
                      if (col.dataIndex === 'addFriendRate') {
                        return {
                          ...col,
                          render: (value: number | string) => <dt className={+value < 50 ? style.red : ''}>{value}</dt>
                        };
                      } else if (col.dataIndex === 'markCarNumRate') {
                        return {
                          ...col,
                          render: (value: number | string) => <dt className={+value < 80 ? style.red : ''}>{value}</dt>
                        };
                      } else {
                        return {
                          ...col,
                          render: (value: number | string) =>
                            tdRender(+value, item.staffOrderList || [], col.dataIndex as string)
                        };
                      }
                    }
                  })}
                  pagination={false}
                  dataSource={item.staffOrderList || []}
                />
                <img
                  className={style.tableImg}
                  src={require(`src/assets/images/statistics/${imgNames[index % 3]}.png`)}
                  alt=""
                />
              </div>
            </div>
          ))}
        </section>
        <div className={style.footerWrap}>
          <span className={style.footerItem}>做保险专家，和客户交朋友</span>
          <span className={style.footerItem}>出单宝，保出单！</span>
        </div>
      </div>
    </div>
  );
};

export default SeatReport;