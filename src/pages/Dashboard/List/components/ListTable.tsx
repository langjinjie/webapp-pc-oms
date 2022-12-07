import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthBtn, NgTable } from 'src/components';
import { ItemProps, tableColumns1, tableColumns2 } from '../config';
import { Button, Divider, Pagination, PaginationProps, Radio, Select } from 'antd';

import styles from '../../style.module.less';
import { getDashboardItemData, getListTotal, getVideoFinrateData } from 'src/apis/dashboard';
import { exportFile, throttle } from 'src/utils/base';
interface ModalProps {
  businessModel: string;
  staffNum: number;
}

const ListTable: React.FC<{ id: string; currentItem: any; modelList: ModalProps[] }> = ({
  id,
  currentItem,
  modelList
}) => {
  const history = useHistory();

  const [totalItem, setTotalItem] = useState<any>({});
  const [dataSource, setDataSource] = useState<ItemProps[]>([]);
  const [visibleLineChart, setVisibleLineChart] = useState(true);
  const [filterData, setFilterData] = useState({
    businessModel: '',
    dayType: 2,
    dataCode: ''
  });
  const [titleList, setTitleList] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>({
    simple: true,
    current: 1,
    total: 0,
    pageSize: 10
  });
  const toDetailPage = (record: any) => {
    history.push(`/dashboardList/${id}/detail`, {
      leaderName: record.leaderName,
      leaderId: record.leaderId,
      ...filterData,
      businessModel: record?.businessModel,
      dataCodeTitle: currentItem?.subTitle
    });
  };
  const getTotal = async (params: any) => {
    const res = await getListTotal({ ...filterData, ...params });
    if (res) {
      setTotalItem(res);
    }
  };
  const getList = async (dataCode?: any) => {
    const pageNum = dataCode.pageNum || pagination.current;
    const res = await getDashboardItemData({
      dayType: filterData.dayType,
      queryType: 1,
      dataCode: filterData.dataCode,
      businessModel: filterData.businessModel,
      pageSize: 10,
      pageNum,
      ...dataCode
    });
    if (res) {
      let { titleList, list, total } = res;
      titleList = titleList.map((item: string, index: number) => ({
        key: 'data' + (titleList.length - index),
        label: item
      }));
      setTitleList(titleList);
      setPagination((pagination) => ({ ...pagination, current: pageNum, total }));
      setDataSource(list);
    }
  };

  const getVideoTableData = async (params?: any) => {
    const pageNum = params?.pageNum || pagination.current;
    const res = await getVideoFinrateData({
      businessModel: filterData.businessModel,
      ...params,
      pageNum
    });
    if (!res) return;
    const titleArr = res.bodyList[0].slice(3, res.bodyList[0].length);

    const { total } = res;
    const titleList = titleArr.map((item: string, index: number) => ({
      key: 'data' + index,
      label: item
    }));
    const list = res.bodyList.slice(1, res.bodyList.length);
    setTitleList(titleList);
    const resList = list.map((item: string[]) => {
      const obj: any = {};

      item.slice(3, item.length).forEach((child: string, index: number) => {
        obj['data' + index] = child;
        obj.businessModel = item[1];
        obj.id = item[0];
        obj.leaderName = item[2];
      });
      return obj;
    });

    setPagination((pagination) => ({ ...pagination, total, current: pageNum }));
    setDataSource(resList);
  };

  useEffect(() => {
    if (id) {
      setTitleList([]);
      setDataSource([]);
      if (id === 'videofinrate') {
        setVisibleLineChart(false);
        getVideoTableData({ pageNum: 1 });
      } else {
        setVisibleLineChart(true);
        getList({ dataCode: currentItem.key || id, pageNum: 1, dayType: 2 });
        getTotal({ dataCode: currentItem.key || id });
        setFilterData({
          businessModel: '',
          dayType: 2,
          dataCode: currentItem.key || id
        });
      }
    }
  }, [id, currentItem]);

  // 模式切换时
  const handleModelChange = (value: string) => {
    setFilterData((filterData) => ({ ...filterData, businessModel: value }));
    if (id === 'videofinrate') {
      getVideoTableData({ businessModel: value, pageNum: 1 });
    } else {
      getList({ businessModel: value, pageNum: 1 });
      getTotal({ businessModel: value });
    }
  };

  // 时间类型切换时
  const onDayTypeChange = (value: any) => {
    setFilterData((filterData) => ({ ...filterData, dayType: value, businessModel: '' }));
    getList({ dayType: value, businessModel: '', pageNum: 1 });
    getTotal({ dayType: value, businessModel: '' });
  };

  const onPaginationChange = (pageNum: number) => {
    setPagination((pagination) => ({ ...pagination, current: pageNum }));
    if (id === 'videofinrate') {
      getVideoTableData({ pageNum });
    } else {
      getList({ pageNum });
    }
  };

  // 下载表格
  const download = throttle(async () => {
    const { data } = await getDashboardItemData(
      { queryType: 2, ...filterData },
      {
        responseType: 'blob'
      }
    );
    exportFile(data, currentItem?.title || '');
  }, 500);

  return (
    <div className={classNames(styles.addFriend)}>
      <div className="container">
        <div className={classNames(styles.contentWrap, 'pb20')}>
          <div className={classNames(styles.header, 'flex justify-between align-center ml20 mr20')}>
            <div className="flex align-center">
              <h3 className="f18 bold">{currentItem?.subTitle}</h3>
              <Divider
                type="vertical"
                style={{
                  borderColor: '#979797',
                  margin: '0 30px'
                }}
              />
              <span className="f16 text-primary">全部团队</span>
            </div>
            {visibleLineChart && (
              <Radio.Group value={filterData.dayType} size="middle" onChange={(e) => onDayTypeChange(e.target.value)}>
                {/* <Radio.Button value={1}>最近30天</Radio.Button> */}
                <Radio.Button value={2}>最近6周</Radio.Button>
                <Radio.Button value={3}>最近6个月</Radio.Button>
              </Radio.Group>
            )}
          </div>
          <div className={'ml20 mt20 mb20'}>
            业务模式：
            <Select value={filterData.businessModel} style={{ width: 120 }} onChange={handleModelChange}>
              <Select.Option value="">全部</Select.Option>
              {modelList.map((item) => (
                <Select.Option value={item?.businessModel} key={item?.businessModel}>
                  {item?.businessModel}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="ph20 mb20">
            {visibleLineChart
              ? (
              <NgTable
                className={styles.listCustom}
                rowClassName={(record, index) => {
                  if (index === 0) {
                    return 'trHighlight';
                  }
                  return '';
                }}
                columns={tableColumns1({ toDetailPage, titleList, visibleLineChart })}
                dataSource={[totalItem, ...dataSource]}
                rowKey={(record) => record.leaderId + record.id || 'total'}
                loading={false}
              ></NgTable>
                )
              : (
              <NgTable
                className={styles.listCustom}
                columns={tableColumns2({ toDetailPage, titleList, visibleLineChart })}
                dataSource={dataSource}
                rowKey={(record) => record.leaderId + record.id || 'total'}
                loading={false}
              ></NgTable>
                )}

            <div className={styles.paginationWrap}>
              <Pagination {...pagination} onChange={onPaginationChange}></Pagination>
            </div>
          </div>

          <div className="flex justify-center mt40">
            <AuthBtn path="/export">
              <Button type="primary" shape="round" className={styles.confirmBtn} onClick={() => download()}>
                下载
              </Button>
            </AuthBtn>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListTable;
