import React from 'react';
import classNames from 'classnames';

import styles from './style.module.less';
import { Button } from 'antd';
import PieChart from './PieChart';

const EnterPriseWechatList: React.FC = () => {
  return (
    <div className={classNames(styles.migration, 'container')}>
      <header>
        <h2 className={classNames('color-text-regular', styles.page_title)}>
          企微好友迁移，从未如此简单！ <span>（国寿财省分 国寿财总部）</span>
        </h2>
        <section className={classNames(styles.kanban, 'flex')}>
          <div className={classNames(styles.kanbanLeft, 'flex vertical justify-between')}>
            <div className="font16 color-text-primary bold">全部客户经理迁移进度</div>
            <Button type="default" size="large" shape="round" className={styles.btnViewRange}>
              查看可见范围
            </Button>
          </div>

          <div className={classNames(styles.kanbanRight, 'flex cell')}>
            <PieChart></PieChart>
            <div className="flex cell">
              <div className={classNames(styles.pieData, 'flex')}>
                <div>
                  <div className={styles.pieBar}>
                    <i className={classNames(styles.pieTag, styles.pieTag_success)}></i>
                    <span className="font12 color-text-regular">迁移成功</span>
                  </div>
                  <div className="mt10 font16">550（55.0%）</div>
                </div>
                <div className="ml50">
                  <div className={styles.pieBar}>
                    <i className={classNames(styles.pieTag, styles.pieTag_wait)}></i>
                    <span className="font12 color-text-regular">待迁移</span>
                  </div>
                  <div className="mt10 font16">550（55.0%）</div>
                </div>
              </div>
              <div className="mt6 font12 color-text-placeholder">饼状图数据更新于 2022-03-12 17:29:17</div>
            </div>
          </div>
        </section>
      </header>
    </div>
  );
};

export default EnterPriseWechatList;
