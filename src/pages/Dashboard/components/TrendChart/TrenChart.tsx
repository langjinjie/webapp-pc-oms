import React from 'react';
import * as echarts from 'echarts/core';
import { ECOption, NgLineChart } from 'src/components/LineChart/LineChart';
import './style.module.less';
/**
 * exchart 图标中tooltip自定义样式
 * @param toolTipSource 自定义的参数,header 有传入 表示标题/ body 有传入表示对是数据,数据中的key 有传入 市值说明,value 有传入 表示有对应的值
 * @returns {string}
 */
interface toolTipSourceProps {
  name: string;
  seriesName: string;
  value: string;
}
export function tooltipCustom (
  toolTipSource: toolTipSourceProps,
  data: any[],
  percentage = false,
  isTime = false
): string {
  if (!toolTipSource) {
    return '';
  }
  const item = data.filter((item: any) => item.dataX === toolTipSource.name)[0];

  return `<div class="tooltip">
    <div>${item.dateStr}</div>
    <div class="mt10">${toolTipSource.seriesName} 
    <span class="ml10 count">${toolTipSource.value + (percentage ? '%' : isTime ? '分' : '')}</span></div>
  </div>`;
}

interface TrendChartProps {
  data: any[];
  legend: string[];
  percentage?: boolean;
  isTime?: boolean;
}
export const TrendChart: React.FC<TrendChartProps> = ({ data, legend, percentage, isTime }) => {
  const options: ECOption = {
    legend: {
      data: legend
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map((item) => item.dataX)
    },
    yAxis: {
      axisLine: {
        show: true
      },
      axisLabel: {
        formatter: percentage ? '{value}%' : isTime ? '{value}分' : '{value}'
      }
    },

    tooltip: {
      trigger: 'axis',
      formatter (params: any) {
        return tooltipCustom(params[0], data, percentage, isTime);
      },
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      padding: 0,
      borderRadius: 16,
      extraCssText: 'box-shadow: none; opacity: 0.9'
    },
    series: [
      {
        name: legend[0],
        data: data.map((item) => item.dataY),
        type: 'line',
        smooth: true,
        showSymbol: true, // 是否默认展示圆点
        symbol: 'circle', // 设定为实心点
        symbolSize: 8, // 设定实心点的大小
        animation: true,
        legendHoverLink: true,
        emphasis: {
          focus: 'series'
        },
        itemStyle: {
          color: '#318CF5',
          borderColor: '#fff',
          borderWidth: 2
        },

        lineStyle: {
          width: 4,
          color: '#267EFE'
        },
        areaStyle: {
          opacity: 0.6,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#90BFFF'
            },
            {
              offset: 1,
              color: '#fff'
            }
          ])
        }
      }
    ]
  };
  return <NgLineChart options={options} height={'500px'}></NgLineChart>;
};
