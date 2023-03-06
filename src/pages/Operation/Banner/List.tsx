import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Image } from 'antd';
import React, { useEffect, useState } from 'react';
import { getBannerList, changeStatus, setTop } from 'src/apis/marquee';
import { NgTable } from 'src/components';
import { OperateType } from 'src/utils/interface';
import { Icon } from 'tenacity-ui';
import CreateModal from './components/CreateModal';
import { IBanner, tableColumnsFun } from './ListConfig';
import style from './style.module.less';

type QueryParamsType = Partial<{
  name: string;
  status: string;
}>;
const BannerList: React.FC = () => {
  const [queryParams, setQueryParams] = useState<QueryParamsType>({});
  const [tableSource, setTableSource] = useState<IBanner[]>([]);

  const [visible, setVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<IBanner>();
  const [visibleImg, setVisibleImg] = useState(false);
  const getList = async (params?: any) => {
    const res = await getBannerList({
      ...queryParams,
      ...params
    });
    if (res) {
      setTableSource(res || []);
    }
  };

  useEffect(() => {
    getList();
  }, []);

  const onSearch = (values: any) => {
    setQueryParams(values);
    getList({ ...values, pageNum: 1 });
  };

  const changeItemStatus = async (record: IBanner, index: number) => {
    const res = await changeStatus({ bannerId: record.bannerId, opType: record.status === '1' ? 2 : 1 });
    if (res) {
      const recordRes = { ...record, status: record.status === '1' ? '2' : '1' };
      const copyData = [...tableSource];
      copyData.splice(index, 1, recordRes);
      setTableSource(copyData);
      message.success(record.status === '1' ? '上架成功' : '下架成功');
    }
  };

  const operateItem = async (operateType: OperateType, record: IBanner, index: number) => {
    if (operateType === 'edit') {
      setVisible(true);
      setCurrentItem(record);
    } else if (operateType === 'putAway' || operateType === 'outline') {
      changeItemStatus(record, index);
    } else if (operateType === 'other') {
      // 置顶操作
      const res = await setTop({ bannerId: record.bannerId });
      if (res) {
        message.success('置顶成功');
        getList({ pageNum: 1 });
      }
    }
  };

  return (
    <div className="container">
      <div className={style.warpBtn}>
        <Button
          type="primary"
          shape="round"
          icon={<PlusOutlined />}
          onClick={() => {
            setVisible(true);
            setCurrentItem(undefined);
          }}
          size="large"
        >
          新增
        </Button>
        <Button
          type="primary"
          shape="round"
          onClick={() => {
            setVisibleImg(true);
          }}
          size="large"
        >
          <Icon name="yulan" />
          &nbsp; 预览
        </Button>
      </div>
      <div className="mt20">
        <NgTable
          columns={tableColumnsFun({
            onOperate: operateItem
          })}
          dataSource={tableSource}
          setRowKey={(record: IBanner) => {
            return record.bannerId;
          }}
        />
      </div>

      <CreateModal
        onSuccess={() =>
          onSearch({
            name: '',
            status: undefined
          })
        }
        visible={visible}
        value={currentItem}
        onClose={() => {
          setCurrentItem(undefined);
          setVisible(false);
        }}
      />
      <Image
        width={200}
        style={{ display: 'none' }}
        src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Flmg.jj20.com%2Fup%2Fallimg%2F1114%2F041621122252%2F210416122252-1-1200.jpg&refer=http%3A%2F%2Flmg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1668837016&t=1dbd430a4bb76c73975152fe1be2bc12"
        preview={{
          visible: visibleImg,
          src: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Flmg.jj20.com%2Fup%2Fallimg%2F1114%2F041621122252%2F210416122252-1-1200.jpg&refer=http%3A%2F%2Flmg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1668837016&t=1dbd430a4bb76c73975152fe1be2bc12',
          onVisibleChange: (value) => {
            setVisibleImg(value);
          }
        }}
      />
    </div>
  );
};

export default BannerList;
