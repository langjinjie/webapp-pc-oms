import React from 'react';
import { Timeline } from 'antd';
import styles from './style.module.less';
import { contentTypeList } from '../../RuleActionSetModal/config';
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
        {value.map((item) => (
          <Timeline.Item key={item.sceneId} dot={<DotComponent title={item.nodeName} />}>
            <div className="flex">
              {item.nodeRuleList?.map((rule: any, index: number) => {
                console.log(rule.pushTime);

                return (
                  <div className={styles.nodeItem} key={rule.actionRuleId + index}>
                    <div className={styles.nodeTitle}>{rule.nodeRuleName}</div>
                    <div className={styles.nodeContent}>
                      {rule.pushTime} {rule.wayName}{' '}
                      {contentTypeList.filter((item) => item.value === rule.actionRuleType)[0].label}
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
