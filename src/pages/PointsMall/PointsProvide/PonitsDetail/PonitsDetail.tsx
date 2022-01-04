import React from 'react';
import { Drawer } from 'antd';
// import style from './style.module.less'

interface IPonitsParam {
  visible: boolean;
  ponitsRow: any;
}

interface IPonitsDetail {
  ponitsParam: IPonitsParam;
  setPonitsParam: (param: IPonitsParam) => void;
}

const PonitsDetail: React.FC<IPonitsDetail> = ({ ponitsParam, setPonitsParam }) => {
  const { ponitsRow, visible } = ponitsParam;
  // 关闭抽屉
  const onCloseHandle = () => {
    setPonitsParam({ ...ponitsParam, visible: false });
  };
  return (
    <>
      <Drawer
        title={ponitsRow.staffName + ponitsRow.time + '的积分奖励明细'}
        placement="right"
        onClose={onCloseHandle}
        visible={visible}
        width={'90%'}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </>
  );
};
export default PonitsDetail;
