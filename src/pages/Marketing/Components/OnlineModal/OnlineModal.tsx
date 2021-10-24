import React, { useContext, useState, useEffect } from 'react';
import { Modal, Checkbox, Col, Row } from 'antd';
import { Context } from 'src/store';

import styles from './style.module.less';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
interface CorpProps {
  corpId: string;
  corpName: string;
  logo: string;
}
interface OnlineModalProps {
  onOk: (corpIds: CheckboxValueType[]) => void;
  onCancel: () => void;
  visible: boolean;
}

export const OnlineModal: React.FC<OnlineModalProps> = ({ onOk, onCancel, visible }) => {
  const { instList: corpList } = useContext(Context);
  const [corpIds, setCorpIds] = useState<CheckboxValueType[]>([]);
  useEffect(() => {
    if (visible && corpList) {
      const corpIds = corpList.map((item: CorpProps) => item.corpId) || [];
      setCorpIds(corpIds);
    }
  }, [visible, corpList]);

  return (
    <Modal
      className={styles.customModal}
      title={'确认上架机构'}
      okText={'确认'}
      width={480}
      visible={visible}
      onCancel={onCancel}
      onOk={() => onOk(corpIds)}
    >
      <Checkbox.Group onChange={(checkedValues) => setCorpIds(checkedValues)} value={corpIds}>
        {corpList?.map((corp: CorpProps) => {
          return (
            <Row key={corp.corpId} className={'pb10'}>
              <Col>
                <Checkbox value={corp.corpId}>
                  <span className="color-text-primary">{corp.corpName}</span>
                </Checkbox>
              </Col>
            </Row>
          );
        })}
      </Checkbox.Group>
    </Modal>
  );
};
