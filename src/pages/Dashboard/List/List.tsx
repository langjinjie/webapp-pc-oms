import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { NgTable } from 'src/components';
import { dataCodeList, tableColumns } from './config';
import { Button, Divider, PaginationProps, Radio, Select, Tabs } from 'antd';

import styles from '../style.module.less';
import { getDashboardItemData } from 'src/apis/dashboard';

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
  const [dayType, setDayType] = useState('2');
  const [pagination, setPagination] = useState<PaginationProps>({
    simple: true,
    current: 1,
    total: 100,
    pageSize: 10
  });
  const [currentItem, setCurrentItem] = useState<{ key: string; title: string; subTitle: string }>();
  const toDetailPage = (record: any) => {
    console.log(history, match, record);
    const { id } = match.params;
    history.push(`/dashboardList/${id}/detail`);
  };
  const getList = async (dataCode?: any) => {
    const res = await getDashboardItemData({
      dayType: 2,
      queryType: 1,
      dataCode: '',
      ...dataCode
    });
    console.log(res);
  };

  useEffect(() => {
    const { id } = match.params;
    const current = dataCodeList.filter((code) => code.key === id)[0];
    const item = current.children.filter((item) => item.key === id)[0];
    setCurrentCode(current);
    setCurrentItem(item);
    getList({ dataCode: id });
    setDayType('2');
    setPagination((pagination) => ({ ...pagination, current: 1 }));
  }, [match]);
  const handleModelChange = () => {
    console.log('change');
  };
  const onTabsChange = (activeKey: string) => {
    const item = currentCode?.children.filter((item) => item.key === activeKey)[0];
    setCurrentItem(item);
    getList({ dataCode: item?.key });
  };

  const onDayTypeChange = (value: any) => {
    console.log(value);
    setDayType(value);
    getList({ datType: value });
  };

  const onPaginationChange = (pageNum: number) => {
    console.log(pageNum);
    setPagination((pagination) => ({ ...pagination, current: pageNum }));
  };
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
            <Radio.Group value={dayType} size="middle" onChange={(e) => onDayTypeChange(e.target.value)}>
              <Radio.Button value="2">最近6周</Radio.Button>
              <Radio.Button value="3">最近6个月</Radio.Button>
            </Radio.Group>
          </div>
          <div className={'ml20 mt20 mb20'}>
            业务模式：
            <Select defaultValue="lucy" style={{ width: 120 }} onChange={handleModelChange}>
              <Select.Option value="jack">Jack</Select.Option>
              <Select.Option value="lucy">Lucy</Select.Option>
            </Select>
          </div>
          <div className="ph20 mb20">
            <NgTable
              rowClassName={(record, index) => {
                if (index === 0) {
                  return 'trHighlight';
                }
                return '';
              }}
              columns={tableColumns({ toDetailPage })}
              pagination={pagination}
              paginationChange={onPaginationChange}
              dataSource={[
                {
                  taskName1: '测试',
                  id: 1,
                  taskName2: '广东'
                },
                {
                  taskName1: '开发',
                  taskName2: '广东',
                  id: 2
                },
                {
                  taskName1: '产品',
                  taskName2: '广东',
                  id: 3
                }
              ]}
              rowKey="id"
              loading={false}
            ></NgTable>
          </div>

          <div className="flex justify-center mt40">
            <Button type="primary" shape="round" className={styles.confirmBtn}>
              下载
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFriend;
