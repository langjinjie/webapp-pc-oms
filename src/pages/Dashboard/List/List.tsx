import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { AuthBtn, NgTable } from 'src/components';
import { dataCodeList, ItemProps, tableColumns } from './config';
import { Button, Divider, Pagination, PaginationProps, Radio, Select, Tabs } from 'antd';

import styles from '../style.module.less';
import { getDashboardItemData, getListTotal, getModelList } from 'src/apis/dashboard';
import { exportFile, throttle } from 'src/utils/base';
interface ModalProps {
  businessModel: string;
  staffNum: number;
}

const AddFriend: React.FC<RouteComponentProps<{ id: string }>> = ({ history, match }) => {
  const [currentCode, setCurrentCode] = useState<{
    key: string;
    title: string;
    children: {
      key: string;
      title: string;
      subTitle: string;
    }[];
  }>();
  const [totalItem, setTotalItem] = useState<any>({});
  const [dataSource, setDataSource] = useState<ItemProps[]>([]);
  const [modelList, setModelList] = useState<ModalProps[]>([]);
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
  const [currentItem, setCurrentItem] = useState<{ key: string; title: string; subTitle: string }>();
  const toDetailPage = (record: any) => {
    const { id } = match.params;
    history.push(`/dashboardList/${id}/detail`, {
      leaderName: record.leaderName,
      leaderId: record.leaderId,
      ...filterData,
      businessModel: record.businessModel,
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
      dayType: 2,
      queryType: 1,
      dataCode: filterData.dataCode,
      businessModel: '',
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

  const getModels = async () => {
    const res = (await getModelList({})) || [];
    setModelList(res);
  };
  useEffect(() => {
    getModels();
  }, []);

  useEffect(() => {
    const { id } = match.params;
    const current = dataCodeList.filter((code) => code.key === id)[0];
    const item = current.children.filter((item) => item.key === id)[0];
    setCurrentCode(current);
    setCurrentItem(item);
    getList({ dataCode: id, PageNum: 1 });
    getTotal({ dataCode: id });
    setFilterData({
      businessModel: '',
      dayType: 2,
      dataCode: id
    });
  }, [match.params.id]);

  // 模式切换时
  const handleModelChange = (value: string) => {
    setFilterData((filterData) => ({ ...filterData, businessModel: value }));
    getList({ businessModel: value, pageNum: 1 });
    getTotal({ businessModel: value });
  };

  // tab切换时
  const onTabsChange = (activeKey: string) => {
    const item = currentCode?.children.filter((item) => item.key === activeKey)[0];
    setCurrentItem(item);
    getList({ dataCode: item?.key, pageNum: 1 });
    getTotal({ dataCode: item?.key });
  };

  // 时间类型切换时
  const onDayTypeChange = (value: any) => {
    setFilterData((filterData) => ({ ...filterData, dayType: value }));
    getList({ dayType: value });
    getTotal({ dayType: value });
  };

  const onPaginationChange = (pageNum: number) => {
    setPagination((pagination) => ({ ...pagination, current: pageNum }));
    getList({ pageNum });
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
      <Tabs defaultActiveKey={currentCode?.key} onChange={onTabsChange}>
        {currentCode?.children.map((item) => {
          return <Tabs.TabPane tab={item.title} key={item.key}></Tabs.TabPane>;
        })}
      </Tabs>
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
            <Radio.Group value={filterData.dayType} size="middle" onChange={(e) => onDayTypeChange(e.target.value)}>
              {/* <Radio.Button value={1}>最近30天</Radio.Button> */}
              <Radio.Button value={2}>最近6周</Radio.Button>
              <Radio.Button value={3}>最近6个月</Radio.Button>
            </Radio.Group>
          </div>
          <div className={'ml20 mt20 mb20'}>
            业务模式：
            <Select value={filterData.businessModel} style={{ width: 120 }} onChange={handleModelChange}>
              <Select.Option value="">全部</Select.Option>
              {modelList.map((item) => (
                <Select.Option value={item.businessModel} key={item.businessModel}>
                  {item.businessModel}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="ph20 mb20">
            <NgTable
              className={styles.listCustom}
              rowClassName={(record, index) => {
                if (index === 0) {
                  return 'trHighlight';
                }
                return '';
              }}
              columns={tableColumns({ toDetailPage, titleList })}
              dataSource={[totalItem, ...dataSource]}
              rowKey={(record) => record.leaderId + record.id || 'total'}
              loading={false}
            ></NgTable>
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

export default AddFriend;
