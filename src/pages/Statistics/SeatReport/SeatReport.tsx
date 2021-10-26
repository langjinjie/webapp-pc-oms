/**
 * @name SeatReport
 * @author Lester
 * @date 2021-10-22 14:03
 */
import React, { useState, useEffect } from 'react';
import { Select, Button, Table } from 'antd';
import Dom2Img from 'dom-to-image';
import { queryReportList } from 'src/apis/seatReport';
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

  /**
   * dom转换成图片
   */
  const domToImage = async () => {
    const postEle = document.getElementsByClassName(style.content)[0];
    const res: any = await Dom2Img.toPng(postEle!);
    downloadImage(res, '战报');
  };

  const getReportList = async () => {
    const res: any = await queryReportList();
    if (res) {
      setReportList(res);
      setCurrentReport(res[0]);
    }
  };

  useEffect(() => {
    getReportList();
    setReportData({});
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
          <div>更新时间：{currentReport.updateTime}</div>
          <div>累计试点工作日：{currentReport.totalWorkDay}</div>
          <div>本周已过工作日：{currentReport.weekDay}</div>
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
          <div>
            <Table dataSource={reportData.areaGroupList || []} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default SeatReport;
