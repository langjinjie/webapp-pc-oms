/**
 * @name SeatReport2
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
import { setTitle } from 'lester-tools';

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
  percount: number;
  mark: number;
}

interface StatisticsItem {
  id: string;
  order: number;
  teamName: string;
  staffName?: string;
  dayUsedMark: number;
  multiuseMark: number;
  dayAddFriendCount: number;
  totalAddFriendCount: number;
  addFriendRate: string;
  avgCircleCount: number;
  markCarNumRate: string;
  dayMarket: number;
  daySmart: number;
  percount?: number;
  trialStarDate?: string;
}

interface ClientManagerItem {
  teamName: string;
  teamShowName: string;
  staffOrderList: StatisticsItem[];
}

interface RePort {
  areaGroupList?: {
    areaReportList?: areaGroupItem[];
    ageGroupList?: LevelItem[];
    leveGroupList?: LevelItem[];
    corpGroupList?: LevelItem[];
  };
  teamOrderList?: StatisticsItem[];
  teamDetailResVO?: ClientManagerItem[];
}

const SeatReport2: React.FC = () => {
  const [reportList, setReportList] = useState<ReportItem[]>([]);
  const [currentReport, setCurrentReport] = useState<ReportItem>({});
  const [reportData, setReportData] = useState<RePort>({});
  const [reportId, setReportId] = useState<string | undefined>(undefined);

  /**
   * 判断是否显示火的图标
   * @param value
   * @param type
   */
  const isHot = (value: number, type: number) => {
    if (type === 0) {
      return (
        +value ===
        Math.max(
          ...(reportData.areaGroupList!.ageGroupList || [])
            .filter((item) => item.leveName !== '合计')
            .map((item) => item.mark)
        )
      );
    } else {
      const levelData = type === 1 ? reportData.areaGroupList!.leveGroupList : reportData.areaGroupList!.corpGroupList;
      return (levelData || [])
        .map((item) => item.mark)
        .sort((a, b) => b - a)
        .slice(0, 2)
        .includes(value);
    }
  };

  /**
   * 判断是否标红
   * @param value
   * @param data
   * @param key
   */
  const showRed = (value: number, data: any[], key: string) => {
    if (value === 0) {
      return true;
    }
    return Math.min(...(data || []).map((item) => +item[key])) === value;
  };

  const tdRender = (val: number | string, data: any[], key: string) => {
    const value = val || 0;
    return (
      <dt className={showRed(+value, data, key) ? style.red : ''}>
        {['addFriendRate', 'markCarNumRate'].includes(key) ? `${value}%` : value}
      </dt>
    );
  };

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
      render: (value) => tdRender(value, reportData.areaGroupList!.areaReportList!, 'dayAddFriendCount')
    },
    {
      title: '累计加好友',
      dataIndex: 'totalAddFriendCount',
      align: 'center',
      render: (value) => tdRender(value, reportData.areaGroupList!.areaReportList!, 'totalAddFriendCount')
    },
    {
      title: '好友通过率',
      dataIndex: 'addFriendRate',
      align: 'center',
      render: (value) => tdRender(value, reportData.areaGroupList!.areaReportList!, 'addFriendRate')
    },
    {
      title: '人均朋友圈',
      dataIndex: 'avgCircleCount',
      align: 'center',
      render: (value) => tdRender(value, reportData.areaGroupList!.areaReportList!, 'avgCircleCount')
    },
    {
      title: '备注车牌率',
      dataIndex: 'markCarNumRate',
      align: 'center',
      render: (value) => tdRender(value, reportData.areaGroupList!.areaReportList!, 'markCarNumRate')
    },
    {
      title: '营销平台',
      dataIndex: 'market',
      align: 'center',
      render: (value) => tdRender(value, reportData.areaGroupList!.areaReportList!, 'market')
    },
    {
      title: '销售宝典',
      dataIndex: 'smart',
      align: 'center',
      render: (value) => tdRender(value, reportData.areaGroupList!.areaReportList!, 'smart')
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
      align: 'center',
      render: (text: string, record) => text || record.staffName
    },
    {
      title: '当日使用分',
      dataIndex: 'dayUsedMark',
      align: 'center'
    },
    {
      title: '综合使用分',
      dataIndex: 'multiuseMark',
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
          render: (value: number | string) => tdRender(+value, reportData.teamOrderList || [], col.dataIndex as string)
        };
      }
    }),
    {
      title: '团队人力',
      dataIndex: 'percount',
      align: 'center'
    },
    {
      title: '试点日期',
      dataIndex: 'trialStarDate',
      align: 'center'
    }
  ];

  const getStaffColumns = (staffOrderList: StatisticsItem[]): TableColumnType<StatisticsItem>[] =>
    statisticsColumns.map((col, colIndex) => {
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
            render: (value: number | string) => <dt className={+value < 50 ? style.red : ''}>{value || 0}%</dt>
          };
        } else if (col.dataIndex === 'markCarNumRate') {
          return {
            ...col,
            render: (value: number | string) => <dt className={+value < 80 ? style.red : ''}>{value || 0}%</dt>
          };
        } else if (col.dataIndex === 'avgCircleCount') {
          return {
            ...col,
            title: '朋友圈发送',
            dataIndex: 'circleSendCount',
            render: (value: number | string) => tdRender(+value, staffOrderList || [], col.dataIndex as string)
          };
        } else {
          return {
            ...col,
            render: (value: number | string) => tdRender(+value, staffOrderList, col.dataIndex as string)
          };
        }
      }
    });

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
    if (Array.isArray(res) && res.length > 0) {
      setReportList(res);
      setCurrentReport(res[0]);
      getReportDetail(res[0].reportId);
      setReportId(res[0].reportId);
    }
  };

  useEffect(() => {
    getReportList();
    setTitle('座席战报');
  }, []);

  return (
    <div className={style.wrap}>
      <div className={style.row}>
        <div className={style.colLabel}>更新时间:</div>
        <div className={style.colValue}>
          <Select
            placeholder="请选择"
            value={reportId}
            onChange={(val) => {
              setReportId(val);
              setCurrentReport(reportList.find((item) => item.reportId === val) || {});
              getReportDetail(val);
            }}
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
            dataSource={reportData.areaGroupList?.areaReportList || []}
          />
          <div className={style.levelWrap}>
            <ul className={style.levelList}>
              <li className={style.levelItem} key="header">
                <span className={style.levelColOne}>分年龄段</span>
                <span className={style.levelColTwo}>人力</span>
                <span className={style.levelColThree}>使用分</span>
              </li>
              {((reportData.areaGroupList || {}).ageGroupList || []).map((item) => (
                <li key={item.leveName} className={style.levelItem}>
                  <dt className={style.levelColOne}>
                    <div
                      className={classNames(style.hotWrap, {
                        [style.hotImg]: isHot(item.mark, 0)
                      })}
                    >
                      {item.leveName}
                    </div>
                  </dt>
                  <dt className={style.levelColTwo}>{item.percount}</dt>
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
              {((reportData.areaGroupList || {}).leveGroupList || []).map((item) => (
                <li key={item.leveName} className={style.levelItem}>
                  <dt className={style.levelColOne}>
                    <div
                      className={classNames(style.hotWrap, {
                        [style.hotImg]: isHot(item.mark, 1)
                      })}
                    >
                      {item.leveName}
                    </div>
                  </dt>
                  <dt className={style.levelColTwo}>{item.percount}</dt>
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
              {((reportData.areaGroupList || {}).corpGroupList || []).map((item) => (
                <li key={item.leveName} className={style.levelItem}>
                  <dt className={style.levelColOne}>
                    <div
                      className={classNames(style.hotWrap, {
                        [style.hotImg]: isHot(item.mark, 2)
                      })}
                    >
                      {item.leveName}
                    </div>
                  </dt>
                  <dt className={style.levelColTwo}>{item.percount}</dt>
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
            columns={teamColumns}
            pagination={false}
            dataSource={reportData.teamOrderList || []}
          />
        </section>
        <section className={style.sectionWrap}>
          <div className={style.sectionTitle}>
            <img className={style.msgImg} src={require('src/assets/images/statistics/message.png')} alt="" />
            <img className={style.titleImg} src={require('src/assets/images/statistics/title3.png')} alt="" />
          </div>
          {(reportData.teamDetailResVO || []).map((item, index) => (
            <div key={item.teamShowName} className={style.teamItem}>
              <div className={style.teamName}>{item.teamShowName}</div>
              <div className={style.teamTableWrap}>
                <Table
                  bordered={false}
                  rowKey="staffName"
                  columns={getStaffColumns(item.staffOrderList || [])}
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

export default SeatReport2;
