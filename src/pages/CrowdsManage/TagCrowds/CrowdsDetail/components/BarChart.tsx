import React, { useMemo } from 'react';

import { ECOption, NgBarChart } from 'src/components/BarChart/BarChart';

interface toolTipSourceProps {
  name: string;
  seriesName: string;
  value: string;
}
export function tooltipCustom (toolTipSource: toolTipSourceProps): string {
  if (!toolTipSource) {
    return '';
  }
  // const item = data.filter((item: any) => item.dataX === toolTipSource.name)[0];

  return `<div class="tooltip">
    <div>${toolTipSource.name}</div>
    <div class="mt10 bold">${toolTipSource.value}</div> 
  </div>`;
}

const BarChart: React.FC<{ data: any[] }> = ({ data }) => {
  const options = useMemo<ECOption>(() => {
    return {
      legend: {
        data: ['客户数量', '坐席数量']
      },
      xAxis: {
        data: data.map((item) => item.date)
      },
      yAxis: {
        type: 'value'
      },
      tooltip: {
        trigger: 'axis'
        // formatter (params: any) {
        //   return tooltipCustom(params[0]);
        // },
        // backgroundColor: 'transparent',
        // borderColor: 'transparent',
        // padding: 0,
        // borderRadius: 16,
        // extraCssText: 'box-shadow: none; opacity: 0.9'
      },
      series: [
        {
          name: '客户数量',
          type: 'bar',
          data: data.map((item) => ({
            value: item.clientNum
            // itemStyle: {
            //   color: '#318CF5'
            // }
          })),

          barWidth: '48px',
          label: {
            show: true,
            position: 'top',
            formatter: ({ value }) => {
              return value;
            }
          }
        },
        {
          name: '坐席数量',
          type: 'bar',
          data: data.map((item) => ({
            value: item.staffNum
            // itemStyle: {
            //   color: '#318CF5'
            // }
          })),

          barWidth: '48px',
          label: {
            show: true,
            position: 'top',
            formatter: ({ value }) => {
              return value;
            }
          }
        }
      ]
    };
  }, [data]);
  return (
    <div>
      <NgBarChart options={options} />
    </div>
  );
};

export default BarChart;
