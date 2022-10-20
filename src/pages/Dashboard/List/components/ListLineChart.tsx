import { Button, Divider, Select, Space } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
import { TrendChart } from '../../components/TrendChart/TrenChart';

import styles from '../../Detail/style.module.less';
import { getTeamLineChartData } from 'src/apis/dashboard';

interface ModalProps {
  businessModel: string;
  staffNum: number;
}
const ListLineChart: React.FC<{ currentItem: any; modelList: ModalProps[] }> = ({ currentItem, modelList }) => {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [queryParams, setQueryParams] = useState({
    businessModel: ''
  });
  const [activeCode, setActiveCode] = useState('');
  const subTitleList = useMemo(() => {
    setActiveCode(currentItem.key);
    return currentItem.children || [];
  }, [currentItem]);
  const getDetail = async (params?: any) => {
    const res = await getTeamLineChartData({
      dayType: 1,
      owner: 2,
      dataCode: activeCode || currentItem.key,
      leaderId: null,
      ...params
    });
    if (res) {
      setQueryParams({ businessModel: params?.businessModel || '' });
      setDataSource(res);
    }
  };

  const handleModelChange = (businessModel: string) => {
    setQueryParams((queryParams) => ({ ...queryParams, businessModel }));
    getDetail({ businessModel });
  };
  useEffect(() => {
    if (currentItem) {
      getDetail({ businessModel: '' });
    }
  }, [currentItem]);

  const radioGroupChange = (value: string) => {
    setActiveCode(value);

    getDetail({ dataCode: value, businessModel: '' });
  };

  return (
    <div className="container">
      <Space className={styles.subTitleWrap}>
        {subTitleList.map((item: any) => (
          <Button
            shape="round"
            key={item.key}
            type={activeCode === item.key ? 'primary' : 'default'}
            onClick={() => radioGroupChange(item.key)}
          >
            {item.title}
          </Button>
        ))}
      </Space>
      <div className={styles.contentWrap}>
        <div className={classNames(styles.header, 'flex justify-between align-center ph20')}>
          <div className="flex align-center">
            <h3 className="f18 bold">{currentItem?.subTitle}</h3>
            <Divider
              type="vertical"
              style={{
                borderColor: '#979797',
                margin: '0 30px'
              }}
            />
            <span className="f16 text-primary">{'全部团队'}</span>
          </div>
          {/* <Button type="primary" shape="round" ghost className={styles.smallTipBtn}>
            {TimeTypes[stateProps?.dayType as number]}
          </Button> */}
        </div>
        <div className={'ml20'}>
          业务模式：
          <span className="ml10">
            <Select value={queryParams?.businessModel} style={{ width: 120 }} onChange={handleModelChange}>
              <Select.Option value="">全部</Select.Option>
              {modelList.map((item) => (
                <Select.Option value={item?.businessModel} key={item?.businessModel}>
                  {item?.businessModel}
                </Select.Option>
              ))}
            </Select>
          </span>
        </div>
        <TrendChart data={dataSource} legend={[currentItem?.subTitle as string]} />
      </div>
    </div>
  );
};

export default ListLineChart;
