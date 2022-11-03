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
import geoJson from './china2.json';
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

    const dealWithData = () => {
      const geoCoordMap = {
        海门: [121.15, 31.89],
        北京: [116.405285, 39.904989],
        招远: [120.38, 37.35],
        舟山: [122.207216, 29.985295],
        齐齐哈尔: [123.97, 47.33],

        潮州: [116.63, 23.68],

        连云港: [119.16, 34.59],
        葫芦岛: [120.836932, 40.711052],
        常熟: [120.74, 31.64],

        惠州: [114.4, 23.09],
        江阴: [120.26, 31.91],
        蓬莱: [120.75, 37.8],
        韶关: [113.62, 24.84],
        嘉峪关: [98.289152, 39.77313],

        太原: [112.53, 37.87],
        清远: [113.01, 23.7],
        中山: [113.38, 22.52],
        昆明: [102.73, 25.04],

        长春: [125.35, 43.88],

        西安: [108.95, 34.27],
        金坛: [119.56, 31.74],

        合肥: [117.27, 31.86],
        武汉: [114.31, 30.52],
        大庆: [125.03, 46.58]
      };
      const data = [];
      for (const key in geoCoordMap) {
        data.push({ name: key, value: geoCoordMap[key] });
      }
      return data;
    };
    const dataValue = dealWithData();
    const data1 = dataValue.splice(0, 6);
    mapChartDom.current?.setOption({
      ...defaultOptions,
      ...options,
      tooltip: {
        show: false
      },
      geo: {
        map: 'china',
        roam: false, // 一定要关闭拖拽
        zoom: 1.23,
        center: [105, 36], // 调整地图位置
        label: {
          show: false, // 关闭省份名展示
          fontSize: '10',
          color: 'rgba(0,0,0,0.7)',
          emphasis: {
            show: false
          }
        },
        itemStyle: {
          areaColor: '#1F2183',
          borderColor: '#389dff',
          borderWidth: 1, // 设置外层边框
          shadowBlur: 5,
          shadowOffsetY: 8,
          shadowOffsetX: 0,
          shadowColor: '#01012a',
          emphasis: {
            areaColor: '#184cff',
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowBlur: 5,
            borderWidth: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      },

      series: [
        {
          type: 'map',
          map: 'china',
          roam: false,
          zoom: 1.23,
          center: [105, 36],

          showLegendSymbol: false, // 存在legend时显示
          label: {
            show: false,
            emphasis: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              areaColor: '#1F2183',
              borderColor: '#389dff',
              borderWidth: 0.5
            },
            emphasis: {
              areaColor: '#17008d',
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 5,
              borderWidth: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        },
        {
          name: '测试',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: dataValue,
          symbolSize: function (val: any) {
            return val[0] / 10;
          },
          symbol: 'circle',
          tooltip: {
            formatter (value: any) {
              console.log(value);

              return value.data.name + '<br/>' + '设备数：' + '22';
            },
            show: true
          },
          encode: {
            value: 2
          },
          label: {
            formatter: '{b}',
            position: 'right'
          },
          itemStyle: {
            color: '#07E8FF'
          },
          emphasis: {
            label: {
              show: true
            }
          }
        },
        {
          name: 'Top 5',
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data: data1,
          symbolSize: 15,
          tooltip: {
            show: true
          },
          encode: {
            value: 2
          },
          showEffectOn: 'render',
          hoverAnimation: true,
          rippleEffect: {
            brushType: 'stroke',
            color: '#0efacc',
            period: 9,
            scale: 5
          },

          label: {
            formatter: '{b}',
            position: 'right',
            show: true
          },
          itemStyle: {
            color: '#0efacc',
            shadowBlur: 2,
            shadowColor: '#333'
          },
          zlevel: 3
        }
      ]
    });
  };

  const onResizeChange = () => {
    mapChartDom.current?.resize();
  };

  useEffect(() => {
    if (options) {
      console.log(options);

      initChart();
    }
  }, [options]);
  useEffect(() => {
    window.addEventListener('resize', onResizeChange);
    return () => {
      window.removeEventListener('resize', onResizeChange);
    };
  }, []);

  return <div ref={NgMapChartRef} style={{ width: width || '100%', height: height || '600px' }}></div>;
};

export default NgMapChart;
