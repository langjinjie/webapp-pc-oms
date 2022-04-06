import { Button, Select } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Icon } from 'src/components';
import styles from './style.module.less';

const EmptyTask: React.FC = () => {
  const [isNext, setIsNext] = useState(false);
  useEffect(() => {
    setIsNext(true);
  }, []);
  return (
    <div className={styles.emptyWrap}>
      {isNext
        ? (
        <div className="flex vertical">
          <h2 className={'f26 color-text-regular'}>企微好友迁移，从未如此简单！</h2>
          <div className={styles.choiceWrap}>
            <div className={classNames('f18', styles.choiceTitle)}>请选择迁移机构：</div>
            <div className="flex">
              <div className="flex vertical">
                <span className={styles.choiceItemLabel}>迁移前机构</span>
                <Select placeholder="请选择" defaultValue={'1'} className="width240">
                  <Select.Option value="1">贵州人保</Select.Option>
                </Select>
              </div>
              <div className="flex align-end">
                <Icon className={styles.arrow} name="jiantou"></Icon>
              </div>

              <div className="flex vertical">
                <span className={styles.choiceItemLabel}>迁移后机构</span>
                <Select placeholder="请选择" className="width240">
                  <Select.Option value="1">贵州人保</Select.Option>
                </Select>
              </div>
            </div>
            <div className="flex justify-center">
              <Button type="primary" shape="round" className={styles.btnConfirm}>
                确定
              </Button>
            </div>
          </div>
        </div>
          )
        : (
        <header className={classNames(styles.emptyWrap, 'flex align-center justify-center')}>
          <h2 className={'f26 color-text-regular'}>企微好友迁移，从未如此简单！</h2>
        </header>
          )}
    </div>
  );
};

export default EmptyTask;
