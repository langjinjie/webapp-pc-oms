import React, { useEffect, useState } from 'react';
import { Divider } from 'antd';
import classNames from 'classnames';
import TagBarChart from '../../components/TagBarChart/TagBarChart';
import styles from '../../Detail/style.module.less';
import { getTagCoverageRate } from 'src/apis/dashboard';
const ListBarChart: React.FC<{ currentItem: any }> = ({ currentItem }) => {
  const [data, setData] = useState<any[]>([]);
  const getTagData = async () => {
    const res = await getTagCoverageRate({});
    if (res) {
      setData([
        { value: res.clientTagRate, label: res.clientTagRateName, color: '#052F66' },
        { value: res.carTagRate, label: res.carTagRateName, color: '#014EAA' },
        { value: res.behavTagRate, label: res.behavTagRateName, color: '#318CF5' },
        { value: res.specTagRate, label: res.specTagRateName, color: '#83BAF9' }
      ]);
    }
  };
  useEffect(() => {
    getTagData();
  }, []);

  return (
    <div className="container">
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
            <span className="f16 text-primary">全部团队</span>
          </div>
          {/* <Button type="primary" shape="round" ghost className={styles.smallTipBtn}>
            {TimeTypes[stateProps?.dayType as number]}
          </Button> */}
        </div>
        <TagBarChart data={data} />
      </div>
    </div>
  );
};

export default ListBarChart;
