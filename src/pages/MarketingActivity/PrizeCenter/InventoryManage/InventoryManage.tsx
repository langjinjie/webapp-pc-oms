import React, { useState } from 'react';
import { Button, Card } from 'antd';
import { BreadCrumbs, ExportModal, NgFormSearch, NgTable } from 'src/components';
import { searchCols, TableColumns } from './Config';
import classNames from 'classnames';
import style from './style.module.less';

const InventoryManage: React.FC = () => {
  const [visible, setVisible] = useState(false);

  // 上传库存
  const addStock = () => {
    setVisible(true);
  };
  const exportOnOk = (file: File) => {
    console.log('file', file);
  };
  const handleDownload = () => {
    console.log('模板下载');
  };

  const onFinish = (values?: any) => {
    console.log('values', values);
  };
  return (
    <Card
      title={
        <>
          <BreadCrumbs
            className={style.breadCrumbs}
            navList={[{ path: '/prizeCenter', name: '奖品中心' }, { name: '库存管理' }]}
          />
          库存管理
        </>
      }
    >
      <div>奖品批次：P52230103268794</div>
      <div>奖品名称：洗车券</div>
      <Button className="mt20" type="primary" shape="round" onClick={addStock}>
        上传库存
      </Button>
      <Button className="ml20" type="link">
        库存模板下载
      </Button>
      <span className={classNames(style.line, 'inline-block')} />
      <Button type="link">下载</Button>
      <NgFormSearch className="mt20" searchCols={searchCols} onSearch={onFinish} />
      <NgTable className="mt20" columns={TableColumns()} scroll={{ x: 740 }} />
      {/* 批量新增 */}
      <ExportModal visible={visible} onOK={exportOnOk} onCancel={() => setVisible(false)} onDownLoad={handleDownload} />
    </Card>
  );
};
export default InventoryManage;
