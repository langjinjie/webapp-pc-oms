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
export function tooltipCustom (toolTipSource: toolTipSourceProps): string {
  if (!toolTipSource) {
    return '';
  }
  return `<div class="tooltip">
    <div>${toolTipSource.name}</div>
    <div class="mt10">${toolTipSource.seriesName} 
    <span class="ml10 count">${toolTipSource.value}</span></div>
  </div>`;
}

export const TrendChart: React.FC = () => {
  const options: ECOption = {
    legend: {
      data: ['日人均客户信息调用数']
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      axisLine: {
        show: true
      }
    },

    tooltip: {
      trigger: 'axis',
      formatter (params: any) {
        return tooltipCustom(params[0]);
      },
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      padding: 0,
      borderRadius: 16,
      extraCssText: 'box-shadow: none; opacity: 0.9'
    },
    series: [
      {
        name: '日人均客户信息调用数',
        data: [820, 932, 901, 934, 1290, 1330, 1320],
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
