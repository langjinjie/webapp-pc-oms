/**
 * @name SeatReport
 * @author Lester
 * @date 2022-04-06 10:14
 */
import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import classNames from 'classnames';
import Dom2Img from 'dom-to-image';
import { Button } from 'lester-ui';
import { setTitle } from 'lester-tools';
import { downloadImage } from 'src/utils/base';
import { queryReportList, queryReportStyle, queryReportDetail, queryReportAreaData } from 'src/apis/seatReport';
import style from './style.module.less';

interface ReportItem {
  reportId?: string;
  reportName?: string;
  updateTime?: string;
  totalWorkDay?: number;
  weekDay?: number;
}

interface IndicatorDesc {
  name: string;
  value: string;
}

interface FooterConfig {
  footTitle: string;
  leftParam: IndicatorDesc[];
  rightParam: IndicatorDesc[];
}

interface ReportConfig {
  headBannUrl?: string;
  headBannColor?: string;
  titleUrl?: string;
  useDesc?: string;
  footBannUrl?: string;
  footDesc?: FooterConfig;
}

interface ReportBaseInfo {
  reportId: string;
  reportName: string;
  updateTime: string;
  totalWorkDay: number;
  weekDay: number;
}

interface AreaItem {
  moduleName: string;
  moduleType: number;
  areaId: string;
  modulLogoUrl: string;
  modulBackColor: string;
  modulLineColor: string;
  modulTextColor: string;
  sort: number;
  areaList?: string[][];
}

interface ReportDetail {
  reportBaseInfo?: ReportBaseInfo;
  bodyList?: AreaItem[];
}

const { Option } = Select;

const SeatReport: React.FC = () => {
  const [reportList, setReportList] = useState<ReportItem[]>([]);
  const [reportId, setReportId] = useState<string>('');
  const [reportConfig, setReportConfig] = useState<ReportConfig>({});
  const [reportDetail, setReportDetail] = useState<ReportDetail>({});

  /**
   * dom转换成图片
   */
  const domToImage = async () => {
    const postEle = document.getElementsByClassName(style.content)[0];
    const res: any = await Dom2Img.toPng(postEle!);
    downloadImage(res, '战报');
  };

  /**
   * 获取战报样式数据
   * @param reportId
   */
  const getReportStyle = async (reportId: string) => {
    const res: any = await queryReportStyle({ reportId });
    if (res) {
      setReportConfig(res);
    }
  };

  /**
   * 获取周报详情数据
   * @param reportId
   */
  const getReportDetail = async (reportId: string) => {
    const res: any = await queryReportDetail({ reportId });
    if (res) {
      setReportDetail(res);
      const promiseList: Promise<any>[] = [];
      const areaIndexes: number[] = [];
      const moduleList: AreaItem[] = res.bodyList || [];
      moduleList.forEach((item: AreaItem, index: number) => {
        if ([3, 4, 5].includes(item.moduleType)) {
          areaIndexes.push(index);
          promiseList.push(queryReportAreaData({ reportId, areaId: item.areaId }));
        }
      });
      const allSettledPromise = Promise.all(promiseList);
      const allRes: any = await allSettledPromise;
      allRes.forEach((item: any, index: number) => {
        if (item) {
          moduleList[areaIndexes[index]].areaList = item.bodyList || [];
        }
      });
      setReportDetail({
        reportBaseInfo: res.reportBaseInfo,
        bodyList: moduleList
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
      const id = res[0].reportId;
      setReportId(id);
      getReportDetail(id);
      getReportStyle(id);
    }
  };

  /**
   * 获取列宽
   * @param count
   */
  const getColWidth = (count: number) => {
    const fonSize = 12;
    return {
      width: fonSize * count
    };
  };

  /**
   * 渲染行列
   * @param areaList
   */
  const renderCommonRow = (areaList: string[][]) => {
    return (
      <ul className={style.areaData}>
        {areaList.map((area: string[], index) => (
          <li key={index} className={style.areaRow}>
            {area.map((val, i) => (
              <dt
                key={i}
                className={classNames(style.areaCol, {
                  [style.hot]: areaList.length > 2 && index === 1 && i === 0
                  // [style.grey]: i === area.length - 1 && areaList[0][areaList[0]?.length - 1] === '团队人力'
                })}
                style={getColWidth(areaList[0][i].length)}
              >
                {val}
              </dt>
            ))}
          </li>
        ))}
      </ul>
    );
  };

  /**
   * 渲染区域
   * @param item
   */
  const renderArea = (item: AreaItem) => {
    switch (item.moduleType) {
      case 1:
        return (
          <div
            key={item.sort}
            style={{
              color: item.modulTextColor,
              backgroundColor: item.modulBackColor,
              borderBottom: `4px solid ${item.modulLineColor}`
            }}
            className={style.areaTitle}
          >
            <img className={style.areaLogo} src={item.modulLogoUrl} crossOrigin="anonymous" alt="" />
            <span>{item.moduleName}</span>
          </div>
        );
      case 2:
        return (
          <div key={item.sort} className={style.areaLineWrap}>
            <div className={style.areaLine} style={{ backgroundColor: item.modulLineColor }} />
          </div>
        );
      case 3:
        return (
          <div key={item.sort} className={style.areaItem}>
            <dt className={style.areaMark}>{item.moduleName}</dt>
            {renderCommonRow(item.areaList || [])}
          </div>
        );
      case 4:
        return (
          <div key={item.sort} className={style.areaItem}>
            <dt className={style.areaMark} />
            {renderCommonRow(item.areaList || [])}
          </div>
        );
      case 5:
        return (
          <div key={item.sort} className={style.teamArea}>
            <div className={style.teamName} style={{ backgroundImage: `url(${item.modulLogoUrl})` }}>
              {item.moduleName}
            </div>
            <div className={style.areaItem}>
              <dt className={style.areaMark} />
              {renderCommonRow(item.areaList || [])}
            </div>
          </div>
        );
      default:
        return null;
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
              getReportDetail(val);
              getReportStyle(val);
            }}
          >
            {reportList.map((item) => (
              <Option key={item.reportId} value={item.reportId!}>
                {item.reportName}
              </Option>
            ))}
          </Select>
        </div>
        {/* <Button className={style.btn} type="primary" onClick={domToImage}>
          下载数据源
        </Button> */}
        <Button className={style.btn} type="primary" onClick={domToImage}>
          导出图片
        </Button>
      </div>
      <div className={style.content}>
        <img className={style.headerImg} src={reportConfig?.headBannUrl} crossOrigin="anonymous" alt="" />
        <div className={style.timeInfo} style={{ backgroundColor: reportConfig?.headBannColor }}>
          <dt>更新时间：{reportDetail?.reportBaseInfo?.updateTime}</dt>
          <dt>累计试点工作日：{reportDetail?.reportBaseInfo?.totalWorkDay}</dt>
          <dt>本周已过工作日：{reportDetail?.reportBaseInfo?.weekDay}</dt>
        </div>
        <div className={style.reportTitle}>
          <img className={style.titleImg} src={reportConfig?.titleUrl} crossOrigin="anonymous" alt="" />
          <div className={style.titleTips} dangerouslySetInnerHTML={{ __html: reportConfig?.useDesc || '' }} />
        </div>
        <div className={style.areaWrap}>{(reportDetail.bodyList || []).map((item) => renderArea(item))}</div>
        <img className={style.footerImg} src={reportConfig?.footBannUrl} crossOrigin="anonymous" alt="" />
        <div className={style.indicatorWrap}>
          <div className={style.indicatorTitle}>【{reportConfig?.footDesc?.footTitle}】</div>
          <div className={style.indicatorContent}>
            <ul className={style.indicatorList}>
              {(reportConfig?.footDesc?.leftParam || []).map((item) => (
                <li className={style.indicatorItem} key={item.name}>
                  <span className={style.indicatorName}>{item.name}：</span>
                  <span className={style.indicatorValue}>{item.value}</span>
                </li>
              ))}
            </ul>
            <ul className={style.indicatorList}>
              {(reportConfig?.footDesc?.rightParam || []).map((item) => (
                <li className={style.indicatorItem} key={item.name}>
                  <span className={style.indicatorName}>{item.name}：</span>
                  <span className={style.indicatorValue}>{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatReport;
