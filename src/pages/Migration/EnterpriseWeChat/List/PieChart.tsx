import React, { useEffect, useRef } from 'react';
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
// 引入柱状图图表，图表后缀都为 Chart
import { PieChart, PieSeriesOption } from 'echarts/charts';
import {
  TitleComponent,
  TitleComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  LegendComponent,
  LegendComponentOption
} from 'echarts/components';
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
type ECOption = echarts.ComposeOption<
  PieSeriesOption | TitleComponentOption | TooltipComponentOption | LegendComponentOption
>;

const MyPieChart: React.FC = () => {
  const chartRef: React.LegacyRef<HTMLDivElement> = useRef(null);
  useEffect(() => {
    echarts.use([
      TitleComponent,
      TooltipComponent,
      CanvasRenderer,
      LabelLayout,
      UniversalTransition,
      PieChart,
      LegendComponent
    ]);
    const myChart = echarts.init(chartRef.current!);
    const option: ECOption = {
      title: {},
      legend: {
        orient: 'vertical',
        left: 'left',
        show: false
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
        // valueFormatter: (val) => <span>{val}</span>
      },
      series: [
        {
          label: {
            show: false
          },
          name: '全部客户经理迁移进度',
          type: 'pie',
          radius: 50,
          width: 120,
          color: ['#a1cdff', '#bbe7d9'],
          data: [
            { value: 12, name: '迁移成功' },
            { value: 100, name: '待迁移' }
          ]
        }
      ]
    };
    myChart.setOption(option);
  }, []);
  return (
    <div ref={chartRef} style={{ height: '146px', width: '146px' }}>
      饼图
    </div>
  );
};

export default MyPieChart;
