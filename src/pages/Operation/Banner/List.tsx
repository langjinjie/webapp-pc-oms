import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Image } from 'antd';
import { PaginationProps } from 'antd/es/pagination';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { changeHotStatus, getHotList, sortTopHot } from 'src/apis/marketing';
import { NgTable } from 'src/components';
import { OperateType } from 'src/utils/interface';
import { Icon } from 'tenacity-ui';
import CreateSpecial from './components/CreateSpecial';
import { HotColumns, tableColumnsFun } from './ListConfig';
import style from './style.module.less';

type QueryParamsType = Partial<{
  name: string;
  status: string;
}>;
const BannerList: React.FC<RouteComponentProps> = ({ history }) => {
  const [queryParams, setQueryParams] = useState<QueryParamsType>({});
  const [tableSource, setTableSource] = useState<HotColumns[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 100,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });

  const [visible, setVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<HotColumns>();
  const [visibleImg, setVisibleImg] = useState(false);
  const getList = async (params?: any) => {
    const pageNum = params?.pageNum || pagination.current;
    const pageSize = params?.pageSize || pagination.pageSize;
    const res = await getHotList({
      ...queryParams,
      ...params,
      pageNum,
      pageSize
    });
    if (res) {
      const { list, total } = res;
      setTableSource(list);
      setPagination((pagination) => ({ ...pagination, total, pageSize, current: pageNum }));
    }
  };

  useEffect(() => {
    getList();
  }, []);

  const onSearch = (values: any) => {
    setQueryParams(values);
    getList({ ...values, pageNum: 1 });
  };

  const paginationChange = (pageNum: number, pageSize?: number) => {
    getList({ pageNum, pageSize });
  };

  const changeItemStatus = async (record: HotColumns, index: number) => {
    if (record.contentNum === 0) return message.warning('请配置内容信息');
    const res = await changeHotStatus({ topicId: record.topicId, status: record.status === 0 ? 1 : 0 });
    if (res) {
      const recordRes = { ...record, status: record.status === 0 ? 1 : 0 };
      const copyData = [...tableSource];
      copyData.splice(index, 1, recordRes);
      setTableSource(copyData);
      message.success(record.status === 1 ? '下架成功' : '上架成功');
    }
  };

  const operateItem = async (operateType: OperateType, record: HotColumns, index: number) => {
    if (operateType === 'add') {
      history.push('/marketingHot/edit?topicId=' + record.topicId);
    } else if (operateType === 'edit') {
      setVisible(true);
      setCurrentItem(record);
    } else if (operateType === 'putAway' || operateType === 'outline') {
      changeItemStatus(record, index);
    } else if (operateType === 'other') {
      // 置顶操作
      const res = await sortTopHot({ topicId: record.topicId });
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
            console.log(111);
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
          pagination={pagination}
          paginationChange={paginationChange}
          setRowKey={(record: HotColumns) => {
            return record.topicId;
          }}
        />
      </div>

      <CreateSpecial
        onSuccess={() =>
          onSearch({
            name: '',
            status: undefined
          })
        }
        visible={visible}
        value={currentItem}
        onClose={() => {
          setVisible(false);
        }}
      />
      <Image
        width={200}
        style={{ display: 'none' }}
        src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Flmg.jj20.com%2Fup%2Fallimg%2F1114%2F041621122252%2F210416122252-1-1200.jpg&refer=http%3A%2F%2Flmg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1668837016&t=1dbd430a4bb76c73975152fe1be2bc12"
        preview={{
          visible: visibleImg,
          // visible,
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
