import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { getBannerList, changeStatus, setTop } from 'src/apis/marquee';
import { AuthBtn, NgTable } from 'src/components';
import { OperateType } from 'src/utils/interface';
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
        <AuthBtn path="/add">
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
        </AuthBtn>
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
    </div>
  );
};

export default BannerList;
