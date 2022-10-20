import React, { useMemo } from 'react';

import { ECOption, NgBarChart } from 'src/components/BarChart/BarChart';

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
