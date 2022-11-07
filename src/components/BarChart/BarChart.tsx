import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { BarChart, BarSeriesOption } from 'echarts/charts';

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
  BarSeriesOption | TitleComponentOption | TooltipComponentOption | GridComponentOption | DatasetComponentOption
>;

interface NgBarChartProps {
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

export const NgBarChart: React.FC<NgBarChartProps> = ({ options, height, width }) => {
  const NgBarChartRef: React.LegacyRef<HTMLDivElement> = useRef(null);
  const barChartDom = useRef<echarts.ECharts>();
  const initChart = () => {
    // 获取echarts 的挂载dom
    barChartDom.current = echarts.getInstanceByDom(NgBarChartRef.current!);
    if (!barChartDom.current) {
      echarts.use([
        BarChart,
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
      barChartDom.current = echarts.init(NgBarChartRef.current!);
    }
    barChartDom.current?.setOption({ ...defaultOptions, ...options });
  };

  const onResizeChange = () => {
    barChartDom.current?.resize();
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

  return <div ref={NgBarChartRef} style={{ width: width || '100%', height: height || '400px' }}></div>;
};
