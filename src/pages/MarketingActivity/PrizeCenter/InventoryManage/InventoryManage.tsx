import React, { useEffect, useState } from 'react';
import { Button, Card, message } from 'antd';
import { BreadCrumbs, ExportModal, NgFormSearch, NgTable } from 'src/components';
import { searchCols, TableColumns, IStockRow } from './Config';
import {
  requestExportActivityGoodsStock,
  // requestActivityGoodsStockDownLoad,
  requestActivityGoodsStockList,
  requestDelActivityGoodsStock
} from 'src/apis/marketingActivity';
// import { exportFile } from 'src/utils/base';
import { IPagination } from 'src/utils/interface';
import classNames from 'classnames';
import style from './style.module.less';
import qs from 'qs';

const InventoryManage: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [list, setList] = useState<IStockRow[]>([]);
  const [formVal, setFormVal] = useState<{ [key: string]: string }>({});
  const [pagination, setPagination] = useState<IPagination>({ current: 1, pageSize: 10, total: 0 });
  const [loading, setLoading] = useState(true);

  const { goodsId, goodsName } = qs.parse(location.search, { ignoreQueryPrefix: true });

  const getList = async (values?: any) => {
    setLoading(true);
    const { pageNum = 1, pageSize = 10 } = values || {};
    const res = await requestActivityGoodsStockList({ goodsId, ...values }).finally(() => setLoading(false));
    if (res) {
      const { list, total } = res;
      setList(list || []);
      setPagination({ current: pageNum, pageSize, total });
    }
  };

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
      getList({ ...formVal, pageNum: pagination.current, pageSize: pagination.pageSize });
      setVisible(false);
      message.success('库存新增成功');
    }
  };
  const handleDownload = () => {
    // 模板链接固定
    window.location.href =
      'https://insure-prod-server-1305111576.cos.ap-guangzhou.myqcloud.com/file/activity/cardtepl.xlsx';
  };

  // 暂时不做下载功能
  // const downLoad = async () => {
  //   const res = await requestActivityGoodsStockDownLoad({ goodsId });
  //   if (res) {
  //     const fileName = decodeURI(res.headers['content-disposition']?.split('=')[1]) || '商品库存';
  //     exportFile(res.data, fileName.split('.')[0], fileName.split('.')[1]);
  //   }
  // };

  const onFinish = async (values?: any) => {
    await getList(values);
    setFormVal(values);
  };

  const paginationChange = (current: number, pageSize?: number) => {
    // 如果修改pageSize,需要从第一页重新获取
    const pageNum = pageSize === pagination.pageSize ? current : 1;
    getList({ ...formVal, pageNum, pageSize });
  };

  // 删除库存
  const del = async (row: IStockRow) => {
    const { couponNumber } = row;
    const res = await requestDelActivityGoodsStock({ couponNumber, goodsId });
    if (res) {
      getList({
        ...formVal,
        pageNum: list.length > 1 ? pagination.current : pagination.current - 1,
        pageSize: pagination.pageSize
      });
      message.success('库存删除成功');
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
      <div>奖品批次：{goodsId}</div>
      <div>奖品名称：{goodsName}</div>
      <Button className="mt20" type="primary" shape="round" onClick={addStock}>
        上传库存
      </Button>
      <Button
        className="ml20"
        type="link"
        href="https://insure-prod-server-1305111576.cos.ap-guangzhou.myqcloud.com/file/activity/cardtepl.xlsx"
      >
        库存模板下载
      </Button>
      <span className={classNames(style.line, 'inline-block')} />
      {/* <Button type="link" onClick={downLoad}>
        下载
      </Button> */}
      <NgFormSearch className="mt20" searchCols={searchCols} onSearch={onFinish} />
      <NgTable
        className="mt20"
        rowKey="couponNumber"
        columns={TableColumns({ del })}
        scroll={{ x: 740 }}
        loading={loading}
        dataSource={list}
        pagination={pagination}
        paginationChange={paginationChange}
      />
      {/* 上传库存 */}
      <ExportModal
        title="上传库存"
        visible={visible}
        onOK={exportOnOk}
        onCancel={() => setVisible(false)}
        onDownLoad={handleDownload}
      />
    </Card>
  );
};
export default InventoryManage;
