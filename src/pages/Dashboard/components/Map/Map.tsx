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
      series: [
        {
          name: '客户数',
          type: 'map',
          map: 'china',
          roam: false,
          zoom: 1.23,
          center: [105, 36],
          showLegendSymbol: true, // 存在legend时显示
          emphasis: {
            show: true, // 高亮状态下的多边形和标签样式。
            label: {
              show: true,
              color: '#fff'
              // position: 'inside'
              // formatter: (value: any) => value.name + ':' + (value.value || 0)
            },
            itemStyle: {
              areaColor: 'rgba(29, 77, 214, 0.3)'
            }
          },
          label: {
            show: true,
            color: '#fff'
            // position: 'inside'
            // formatter: (value: any) => value.name + ':' + (value.value || 0)
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
