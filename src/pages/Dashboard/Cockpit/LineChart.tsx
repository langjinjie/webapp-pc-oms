import React, { useMemo } from 'react';
import * as echarts from 'echarts/core';
import { ECOption, NgLineChart } from 'src/components/LineChart/LineChart';

interface ILineChartProps {
  lineChartData: { xAxisData: any[]; yAxisData: any[] };
}

const LineChart: React.FC<ILineChartProps> = ({ lineChartData }) => {
  // 折线图数据

  const ngLineChartOptions = useMemo(() => {
    const options: ECOption = {
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: lineChartData.xAxisData
      },
      yAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            color: 'rgba(82, 81, 125, 1)',
            type: 'dashed'
          }
        }
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        formatter (params: any) {
          return `<div class="tooltip">
            <div>${params[0].name}</div>
            <div class="mt10 bold">客户总人数：${params[0].value}</div>
          </div>`;
        },
        textStyle: { color: '#fff' },
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderColor: 'transparent',
        padding: 10,
        borderRadius: 16,
        extraCssText: 'box-shadow: none; opacity: 0.9'
      },
      series: [
        {
          data: lineChartData.yAxisData,
          type: 'line',
          smooth: true,
          symbolSize: 6,
          showSymbol: false,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(255, 134, 46, 0.4)'
              },
              {
                offset: 1,
                color: 'rgba(255, 134, 46, 0)'
              }
            ])
          },
          lineStyle: {
            width: 4,
            color: 'rgba(255, 155, 27, 1)'
          },
          itemStyle: { color: 'rgb(255, 155, 27)' }
        }
      ]
    };
    return options;
  }, [lineChartData]);
  return <NgLineChart options={ngLineChartOptions} />;
};
export default LineChart;
