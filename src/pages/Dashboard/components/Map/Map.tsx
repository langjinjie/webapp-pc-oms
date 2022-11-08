import React from 'react';
import NgMapChart from './MapChart';

interface IMapProps {
  data: { name?: string; value?: number }[];
}

const Map: React.FC<IMapProps> = ({ data }) => {
  const options: any = {
    // legend: {
    //   orient: 'horizontal',
    //   textStyle: { color: '#fff' },
    //   x: 'left',
    //   y: '20',
    //   data: ['客户数', '互动客户数']
    // },
    title: {
      text: '全国数据',
      textStyle: {
        color: '#fff'
      }
    },
    tooltip: {
      trigger: 'item'
      // formatter: (param: any) => {
      //   return '加好友数量' + param.value;
      // }
      // show: false
    },
    series: [
      {
        name: '客户数',
        type: 'map',
        map: 'china',
        roam: false,
        zoom: 1.23,
        center: [105, 36],
        showLegendSymbol: false, // 存在legend时显示
        emphasis: {
          show: true,
          label: {
            show: true,
            color: '#fff',
            position: 'inside'
          }
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
  return <NgMapChart options={options} />;
};

export default Map;
