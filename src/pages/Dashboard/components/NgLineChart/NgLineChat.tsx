import React, { useEffect, useRef } from 'react';

import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { useMountedRef } from 'src/utils/use-async';
import { GridComponent, DatasetComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
interface SmallLineChartProps {
  data: number[];
  width?: number;
  height?: number;
}
export const NgLineChart: React.FC<SmallLineChartProps> = ({ data, height, width }) => {
  const isMounted = useMountedRef();
  const lineChartRef: React.LegacyRef<HTMLDivElement> = useRef(null);

  const lineChartInit = () => {
    let lineChartDom = echarts.getInstanceByDom(lineChartRef.current!);
    //  如果没有挂载echartDom
    if (!lineChartDom) {
      if (isMounted && lineChartRef.current) {
        echarts.use([LineChart, GridComponent, DatasetComponent, CanvasRenderer]);
        lineChartDom = echarts.init(lineChartRef.current!);
      }
    }
    const option = {
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
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#318CF5'
              }
            }
          }
        }
      ]
    };
    lineChartDom?.setOption(option);
  };
  useEffect(() => {
    if (data) {
      lineChartInit();
    }
  }, [data]);
  return <div style={{ height: `${height || 40}px`, width: `${width || 100}px` }} ref={lineChartRef}></div>;
};
