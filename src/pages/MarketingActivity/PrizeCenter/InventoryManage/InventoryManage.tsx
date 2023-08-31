import React, { useState } from 'react';
import { Button, Card, message } from 'antd';
import { BreadCrumbs, ExportModal, NgFormSearch, NgTable } from 'src/components';
import { searchCols, TableColumns } from './Config';
import { requestExportActivityGoodsStock } from 'src/apis/marketingActivity';
import classNames from 'classnames';
import style from './style.module.less';
import qs from 'qs';

const InventoryManage: React.FC = () => {
  const [visible, setVisible] = useState(false);

  // 上传库存
  const addStock = () => {
    setVisible(true);
  };

  // 首先调用统一的上传接口,然后
  const exportOnOk = async (file: File) => {
    const { goodsId } = qs.parse(location.search, { ignoreQueryPrefix: true });
    // 创建一个空对象实例
    const uploadData = new FormData();
    // 调用append()方法来添加数据
    uploadData.append('file', file);
    uploadData.append('goodsId', goodsId as string);
    const res = await requestExportActivityGoodsStock(uploadData);
    if (res) {
      console.log('123');
      message.success('库存新增成功');
      setVisible(false);
    }
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
