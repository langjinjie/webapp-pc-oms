import React, { useEffect, useState } from 'react';
import { Button, Card, message } from 'antd';
import { BreadCrumbs, ExportModal, NgFormSearch, NgTable } from 'src/components';
import { searchCols, TableColumns, IStockRow } from './Config';
import {
  requestExportActivityGoodsStock,
  requestActivityGoodsStockDownLoad,
  requestActivityGoodsStockList,
  requestDelActivityGoodsStock
} from 'src/apis/marketingActivity';
import { exportFile } from 'src/utils/base';
import { IPagination } from 'src/utils/interface';
import classNames from 'classnames';
import style from './style.module.less';
import qs from 'qs';

const InventoryManage: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [list, setList] = useState<IStockRow[]>([]);
  const [formVal, setFormVal] = useState<{ [key: string]: string }>({});
  const [pagination, setPagination] = useState<IPagination>({ current: 1, pageSize: 10, total: 0 });

  const { goodsId } = qs.parse(location.search, { ignoreQueryPrefix: true });

  // 上传库存
  const addStock = () => {
    setVisible(true);
  };

  // 首先调用统一的上传接口,然后
  const exportOnOk = async (file: File) => {
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
  // 模板链接写S
  const handleDownload = () => {
    console.log('模板下载');
  };

  const downLoad = async () => {
    const res = await requestActivityGoodsStockDownLoad({ goodsId });
    if (res) {
      const fileName = decodeURI(res.headers['content-disposition']?.split('=')[1]) || '商品库存';
      exportFile(res.data, fileName.split('.')[0], fileName.split('.')[1]);
    }
  };

  const getList = async (values?: any) => {
    const { current = 1, pageSize = 10 } = values || {};
    const res = await requestActivityGoodsStockList({ ...values });
    if (res) {
      const { list, total } = res;
      setList(list || []);
      setPagination({ current, pageSize, total });
    }
    setList([{}]);
  };

  const onFinish = async (values?: any) => {
    console.log('values', values);
    await getList();
    setFormVal(values);
  };

  const paginationChange = (current: number, pageSize?: number) => {
    // 如果修改pageSize,需要从第一页重新获取
    const pageNum = pageSize === pagination.pageSize ? current : 1;
    getList({ ...formVal, current: pageNum, pageSize });
  };

  // 删除库存
  const del = async (row: IStockRow) => {
    const { couponNumber } = row;
    const res = await requestDelActivityGoodsStock({ couponNumber, goodsId });
    if (res) {
      console.log('res', res);
    }
  };

  useEffect(() => {
    getList();
  }, []);
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
      <Button type="link" onClick={downLoad}>
        下载
      </Button>
      <NgFormSearch className="mt20" searchCols={searchCols} onSearch={onFinish} />
      <NgTable
        className="mt20"
        columns={TableColumns({ del })}
        scroll={{ x: 740 }}
        dataSource={list}
        pagination={pagination}
        paginationChange={paginationChange}
      />
      {/* 批量新增 */}
      <ExportModal visible={visible} onOK={exportOnOk} onCancel={() => setVisible(false)} onDownLoad={handleDownload} />
    </Card>
  );
};
export default InventoryManage;
