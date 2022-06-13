import { Button, message, Modal, Select } from 'antd';
import classNames from 'classnames';
import React, { useContext, useEffect, useState } from 'react';
import { setTransferCorp } from 'src/apis/migration';
import { Icon } from 'src/components';
import { Context } from 'src/store';
import styles from './style.module.less';

interface EmptyTaskProps {
  createdSuccess: () => void;
}
const EmptyTask: React.FC<EmptyTaskProps> = ({ createdSuccess }) => {
  const [isNext, setIsNext] = useState(false);
  const { instList, currentCorpId } = useContext(Context);
  const [targetCorp, setTargetCorp] = useState<undefined | string>();

  const [targetCorpStatus, setTargetCorpStatus] = useState<any>(undefined);
  useEffect(() => {
    setIsNext(true);
  }, []);

  const onSubmit = async () => {
    if (!targetCorp) {
      setTargetCorpStatus('error');
      return false;
    }
    Modal.confirm({
      title: '温馨提示',
      content: '本次选择关系到机构客户数据安全，确定后不可更改，请核对迁移机构是否无误',
      onOk: async () => {
        const res = await setTransferCorp({
          targetCorpId: targetCorp
        });
        if (res) {
          message.success('设置成功');
          // 刷新页面
          createdSuccess();
        }
      }
    });
  };

  const selectChange = (value: string) => {
    setTargetCorpStatus('');
    setTargetCorp(value);
  };
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
                <div className={styles.currentCorp}>
                  {instList?.filter((item: any) => item.corpId === currentCorpId)[0].corpName}
                </div>
              </div>
              <div className={styles.arrowWrap}>
                <Icon className={styles.arrow} name="jiantou"></Icon>
              </div>

              <div className="flex vertical">
                <span className={styles.choiceItemLabel}>迁移后机构</span>
                <Select
                  placeholder="请选择"
                  className="width240"
                  value={targetCorp}
                  onChange={selectChange}
                  status={targetCorpStatus}
                  allowClear
                >
                  {instList.map((option: any) => {
                    if (option.corpId !== currentCorpId) {
                      return (
                        <Select.Option value={option.corpId} key={option.corpId}>
                          {option.corpName}
                        </Select.Option>
                      );
                    } else {
                      return null;
                    }
                  })}
                </Select>
                {targetCorpStatus === 'error' && <p className="color-danger">请选择迁移后的机构</p>}
              </div>
            </div>
            <div className="flex justify-center">
              <Button type="primary" shape="round" className={styles.btnConfirm} onClick={onSubmit}>
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
