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
    <div class="mt10 bold">${toolTipSource.value}%</div> 
  </div>`;
}

const TagBarChart: React.FC<{ data: any[] }> = ({ data }) => {
  const options = useMemo<ECOption>(() => {
    return {
      xAxis: {
        data: data.map((item) => item.label)
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} %'
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
          type: 'bar',
          data: data.map((item) => ({
            value: item.value,
            itemStyle: {
              color: item.color
            }
          })),

          // [
          //   {
          //     value: 80,
          //     itemStyle: {
          //       color: '#052F66'
          //     }
          //   },
          //   {
          //     value: 24,
          //     itemStyle: {
          //       color: '#014EAA'
          //     }
          //   },
          //   {
          //     value: 24,
          //     itemStyle: {
          //       color: '#318CF5'
          //     }
          //   },
          //   {
          //     value: 24,
          //     itemStyle: {
          //       color: '#83BAF9'
          //     }
          //   }
          // ],
          barWidth: '48px',
          label: {
            show: true,
            position: 'top',
            formatter: ({ value }) => {
              return value + '%';
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

export default TagBarChart;
