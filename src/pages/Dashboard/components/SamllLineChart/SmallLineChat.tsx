import React from 'react';

import { ECOption, NgLineChart } from 'src/components/LineChart/LineChart';

interface SmallLineChartProps {
  data: number[];
  width?: string;
  height?: string;
}
export const SmallLineChart: React.FC<SmallLineChartProps> = ({ data, width = '100%', height = '40px' }) => {
  const option: ECOption = {
    tooltip: {
      show: false
    },
    grid: { top: 2, right: 2, bottom: 2, left: 2 },
    xAxis: {
      type: 'category',
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisLabel: {
        show: false
      },
      splitLine: {
        show: false
      }
    },

    series: [
      {
        data: data,
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: {
          color: '#318CF5'
        }
      }
    ]
  };
  return <NgLineChart options={option} height={height} width={width} />;
};
