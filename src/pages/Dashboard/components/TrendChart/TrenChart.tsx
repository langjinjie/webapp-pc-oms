import React from 'react';
import { ECOption, NgLineChart } from 'src/components/LineChart/LineChart';

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
    series: [
      {
        name: '日人均客户信息调用数',
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        areaStyle: {}
      }
    ]
  };
  return <NgLineChart options={options}></NgLineChart>;
};
