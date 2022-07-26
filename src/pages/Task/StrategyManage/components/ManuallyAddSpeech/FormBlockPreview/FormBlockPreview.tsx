import React from 'react';
import { Timeline } from 'antd';
import styles from './style.module.less';
import { contentTypeList } from '../../RuleActionSetModal/config';
import moment from 'moment';
interface FormBlockPreviewProps {
  value: any[];
}

const DotComponent: React.FC<{ title: string }> = ({ title }) => {
  return <div className={styles.timelineLabel}>{title}</div>;
};
export const FormBlockPreview: React.FC<FormBlockPreviewProps> = ({ value }) => {
  console.log('propValue:', value, '==================');
  return (
    <div className={styles.timelineWrap}>
      <Timeline>
        {value?.map((item) => (
          <Timeline.Item key={item.sceneId} dot={<DotComponent title={item.nodeName} />}>
            <div className="flex">
              {item.nodeRuleList?.map((rule: any, index: number) => {
                // 处理moment数据污染bug
                rule = JSON.parse(JSON.stringify(rule));
                return (
                  <div className={styles.nodeItem} key={rule.actionRuleId + index}>
                    <div className={styles.nodeTitle}>{rule.nodeRuleName}</div>
                    <div className={styles.nodeContent}>
                      {moment(rule.pushTime, 'HH:mm').format('HH:mm')} {rule.wayName}{' '}
                      {contentTypeList?.filter((item) => item.value === rule.actionRuleType)[0]?.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  );
};
