import React from 'react';
import NgMapChart from './MapChart';

const MapDemo: React.FC = () => {
  const options = {
    legend: {
      orient: 'horizontal',
      textStyle: { color: '#fff' },
      x: 'left',
      y: '20',
      data: ['全国数据']
    }
  };
  return <NgMapChart options={options} />;
};

export default MapDemo;
