import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { LineChart, LineSeriesOption } from 'echarts/charts';
import {
  GridComponent,
  DatasetComponent,
  TooltipComponent,
  LegendComponent,
  TransformComponent,
  TitleComponentOption,
  GridComponentOption,
  DatasetComponentOption,
  TitleComponent
} from 'echarts/components';
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { TooltipComponentOption } from 'echarts';

export type ECOption = echarts.ComposeOption<
  LineSeriesOption | TitleComponentOption | TooltipComponentOption | GridComponentOption | DatasetComponentOption
>;
interface NgLineChartProps {
  options: ECOption;
  height?: string;
  width?: string;
}

const defaultOptions = {
  grid: { top: 40, right: 30, bottom: 44, left: 100 },
  tooltip: {
    trigger: 'axis'
  },
  yAxis: {
    type: 'value',
    minInterval: 1
  },
  xAxis: {
    type: 'category'
  }
};

export const NgLineChart: React.FC<NgLineChartProps> = ({ options, height, width }) => {
  const NgLineChartRef: React.LegacyRef<HTMLDivElement> = useRef(null);
  const lineChartDom = useRef<echarts.ECharts>();
  const initChart = () => {
    // 获取echarts 的挂载dom
    lineChartDom.current = echarts.getInstanceByDom(NgLineChartRef.current!);
    if (!lineChartDom.current) {
      echarts.use([
        LineChart,
        GridComponent,
        DatasetComponent,
        CanvasRenderer,
        TooltipComponent,
        LegendComponent,
        LabelLayout,
        UniversalTransition,
        TransformComponent,
        TitleComponent
      ]);
      lineChartDom.current = echarts.init(NgLineChartRef.current!);
    }
    lineChartDom.current?.setOption({ ...defaultOptions, ...options });
  };

  const onResizeChange = () => {
    lineChartDom.current?.resize();
  };

  useEffect(() => {
    if (options) {
      initChart();
    }
  }, [options]);
  useEffect(() => {
    window.addEventListener('resize', onResizeChange);
    return () => {
      window.removeEventListener('resize', onResizeChange);
    };
  }, []);

  return <div ref={NgLineChartRef} style={{ width: width || '100%', height: height || '400px' }}></div>;
};
