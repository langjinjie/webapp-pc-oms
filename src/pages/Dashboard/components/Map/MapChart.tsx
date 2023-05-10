import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  // VisualMapComponent,
  GeoComponent,
  TooltipComponentOption,
  TitleComponentOption,
  DatasetComponentOption,
  GridComponent,
  LegendComponent
} from 'echarts/components';
// @ignore
import geoJson from './china3.json';
import { MapChart, ScatterChart, EffectScatterChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

export type ECOption = echarts.ComposeOption<TitleComponentOption | TooltipComponentOption | DatasetComponentOption>;

interface NgBarChartProps {
  options: ECOption;
  height?: string;
  width?: string;
}
const defaultOptions = {
  grid: { top: 40, right: 30, bottom: 44, left: 100 },
  backgroundColor: '#1F2183'
};

const NgMapChart: React.FC<NgBarChartProps> = ({ options, height, width }) => {
  const NgMapChartRef: React.LegacyRef<HTMLDivElement> = useRef(null);
  const mapChartDom = useRef<echarts.ECharts>();
  const initChart = () => {
    // 获取echarts 的挂载dom
    mapChartDom.current = echarts.getInstanceByDom(NgMapChartRef.current!);

    if (!mapChartDom.current) {
      echarts.use([
        TitleComponent,
        ToolboxComponent,
        TooltipComponent,
        // VisualMapComponent,
        GeoComponent,
        MapChart,
        GridComponent,
        LegendComponent,
        CanvasRenderer,
        ScatterChart,
        EffectScatterChart
      ]);

      mapChartDom.current = echarts.init(NgMapChartRef.current!);
    }
    geoJson && echarts.registerMap('china', geoJson as any);
    mapChartDom.current?.setOption({
      ...defaultOptions,
      ...options
    });
  };

  const onResizeChange = () => {
    mapChartDom.current?.resize();
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

  return <div ref={NgMapChartRef} style={{ width: width || '100%', height: height || '100%' }}></div>;
};

export default NgMapChart;
