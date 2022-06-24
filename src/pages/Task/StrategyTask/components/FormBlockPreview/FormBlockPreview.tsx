import React from 'react';
import { Timeline } from 'antd';
import styles from './style.module.less';
interface FormBlockPreviewProps {
  value: any[];
}

const DotComponent: React.FC<{ title: string }> = ({ title }) => {
  return <div className={styles.timelineLabel}>{title}</div>;
};
export const FormBlockPreview: React.FC<FormBlockPreviewProps> = () => {
  return (
    <div className={styles.timelineWrap}>
      <Timeline>
        <Timeline.Item dot={<DotComponent title="保险到期日" />}>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((item) => {
              return (
                <div className={styles.nodeItem} key={item}>
                  <div className={styles.nodeTitle}>保险到期日前14天</div>
                  <div className={styles.nodeContent}>09:00 群发消息 发送文章</div>
                  <div className={styles.nodeContent}>09:00 群发消息 发送文章</div>
                </div>
              );
            })}
          </div>
        </Timeline.Item>
        <Timeline.Item dot={<DotComponent title="国庆节" />}>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((item) => {
              return (
                <div className={styles.nodeItem} key={item}>
                  <div className={styles.nodeTitle}>保险到期日前14天</div>
                  <div className={styles.nodeContent}>09:00 群发消息 发送文章</div>
                  <div className={styles.nodeContent}>09:00 群发消息 发送文章</div>
                </div>
              );
            })}
          </div>
        </Timeline.Item>
        <Timeline.Item dot={<DotComponent title="端午节" />}>
          <div className="flex">
            {[1, 5].map((item) => {
              return (
                <div className={styles.nodeItem} key={item}>
                  <div className={styles.nodeTitle}>保险到期日前14天</div>
                  <div className={styles.nodeContent}>09:00 群发消息 发送文章</div>
                  <div className={styles.nodeContent}>09:00 群发消息 发送文章</div>
                </div>
              );
            })}
          </div>
        </Timeline.Item>
        <Timeline.Item dot={<DotComponent title="中秋节" />}>
          <div className="flex">
            {[1, 2, 5].map((item) => {
              return (
                <div className={styles.nodeItem} key={item}>
                  <div className={styles.nodeTitle}>保险到期日前14天</div>
                  <div className={styles.nodeContent}>09:00 群发消息 发送文章</div>
                  <div className={styles.nodeContent}>09:00 群发消息 发送文章</div>
                </div>
              );
            })}
          </div>
        </Timeline.Item>
      </Timeline>
    </div>
  );
};
