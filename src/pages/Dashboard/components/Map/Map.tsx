import React, { useMemo } from 'react';
import NgMapChart from './MapChart';

interface IMapProps {
  data?: { name?: string; value?: number }[];
}

const Map: React.FC<IMapProps> = ({ data }) => {
  const options = useMemo(() => {
    const options: any = {
      // legend: {
      //   orient: 'horizontal',
      //   textStyle: { color: '#fff' },
      //   x: 'left',
      //   y: '20',
      //   data: ['客户数', '互动客户数']
      // },
      // title: {
      //   text: '全国数据',
      //   textStyle: {
      //     color: '#fff'
      //   }
      // },
      tooltip: {
        show: true,
        backgroundColor: 'rgba(29, 77, 214, 0.6)',
        textStyle: {
          color: '#fff'
        }
      },
      geo: {
        map: 'china',
        roam: false, // 一定要关闭拖拽
        zoom: 0.95,
        center: [105, 36], // 调整地图位置
        itemStyle: {
          areaColor: '#1F2183',
          borderColor: '#389dff',
          borderWidth: 1, // 设置外层边框
          shadowBlur: 5,
          shadowOffsetY: 8,
          shadowOffsetX: 0,
          shadowColor: '#01012a'
        }
      },
      series: [
        {
          name: '客户数',
          type: 'map',
          map: 'china',
          roam: false,
          zoom: 0.95,
          center: [105, 36],
          showLegendSymbol: false, // 存在legend时显示
          emphasis: {
            show: true, // 高亮状态下的多边形和标签样式。
            label: {
              show: true,
              color: '#fff'
            },
            itemStyle: {
              areaColor: 'rgba(29, 77, 214, 0.3)'
            }
          },
          label: {
            show: true,
            color: '#fff'
          },
          data,
          itemStyle: {
            areaColor: '#1F2183',
            borderColor: '#389dff'
          },
          select: {
            disabled: true
          }
        }
      ]
    };
    return options;
  }, [data]);
  return <NgMapChart options={options} />;
};

export default Map;
