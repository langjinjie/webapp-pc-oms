/**
 * @name SeatReport
 * @author Lester
 * @date 2021-10-22 14:03
 */
import React, { useState, useEffect } from 'react';
import { Select, Button, Table } from 'antd';
import Dom2Img from 'dom-to-image';
import { downloadImage } from 'src/utils/base';
import style from './style.module.less';

const { Option } = Select;

interface TimeItem {
  id: string;
  name: string;
}

interface OverallItem {
  id: string;
  name: string;
  dayCount: number;
  total: number;
  passRate: number;
  averageMoment: number;
  carNumRate: number;
  market: number;
  sale: number;
}

interface AgeItem {
  total: number;
  eighty: number;
  ninety: number;
  zero: number;
}

interface LevelItem {
  level: string;
  manpower: string;
  score: string;
}

interface YearItem {
  year: string;
  manpower: string;
  score: string;
}

interface StatisticsItem {
  id: string;
  leaderName: string;
  dayScore: number;
  totalScore: number;
  dayCount: number;
  total: number;
  passRate: number;
  averageMoment: number;
  carNumRate: number;
  market: number;
  sale: number;
  teamManpower?: number;
  date?: string;
}

interface ClientManagerItem {
  id: string;
  name: string;
  statisticsList: StatisticsItem[];
}

interface RePort {
  overallList?: OverallItem[];
  age?: AgeItem;
  level?: LevelItem;
  year?: YearItem;
  teamList?: StatisticsItem[];
  clientManager?: ClientManagerItem[];
}

const SeatReport: React.FC = () => {
  const [timeList, setTimeList] = useState<TimeItem[]>([]);
  const [reportData, setReportData] = useState<RePort>({});

  /**
   * dom转换成图片
   */
  const domToImage = async () => {
    const postEle = document.getElementsByClassName(style.content)[0];
    const res: any = await Dom2Img.toPng(postEle!);
    downloadImage(res, '战报');
  };

  useEffect(() => {
    setTimeList([
      {
        id: '123',
        name: '2021-10-22'
      }
    ]);
    setReportData({});
  }, []);

  return (
    <div className={style.wrap}>
      <div className={style.row}>
        <div className={style.colLabel}>更新时间:</div>
        <div className={style.colValue}>
          <Select placeholder="请选择">
            {timeList.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.name}
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
          <div>更新时间：9月27日 24:00</div>
          <div>累计试点工作日：26</div>
          <div>本周已过工作日：2</div>
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
            <Table dataSource={reportData.overallList || []} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default SeatReport;
