import React, { useMemo } from 'react';

import { ECOption, NgBarChart } from 'src/components/BarChart/BarChart';

const Chart: React.FC = () => {
  const options = useMemo<ECOption>(() => {
    return {
      xAxis: {
        data: ['人信息标签覆盖率', '车信息覆盖率', '行为兴趣标签覆盖率', '自定义标签覆盖率']
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
          data: [
            {
              value: 80,
              itemStyle: {
                color: '#052F66'
              }
            },
            {
              value: 24,
              itemStyle: {
                color: '#014EAA'
              }
            },
            {
              value: 24,
              itemStyle: {
                color: '#318CF5'
              }
            },
            {
              value: 24,
              itemStyle: {
                color: '#83BAF9'
              }
            }
          ],
          barWidth: '48px',
          label: {
            show: true,
            position: 'top',
            formatter: ({ value }) => {
              console.log(value);

              return value + '%';
            }
          }
        }
      ]
    };
  }, []);
  return (
    <div>
      <NgBarChart options={options} />
    </div>
  );
};

export default Chart;
