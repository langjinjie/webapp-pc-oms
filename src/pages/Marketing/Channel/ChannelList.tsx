import React from 'react';
import { NgTable } from 'src/components';
import { tableColumnsFun } from './config';
const ChannelList: React.FC = () => {
  const onOperate = () => {
    console.log('操作');
  };
  return (
    <div>
      <NgTable columns={tableColumnsFun(onOperate)}></NgTable>
    </div>
  );
};

export default ChannelList;
