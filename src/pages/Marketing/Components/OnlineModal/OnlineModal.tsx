import React, { useContext, useState, useEffect } from 'react';
import { Modal, Checkbox, Col, Row } from 'antd';
import { Context } from 'src/store';

import styles from './style.module.less';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
interface CorpProps {
  corpId: string;
  corpName: string;
  logo: string;
}
interface OnlineModalProps {
  onOk: (corpIds: CheckboxValueType[]) => void;
  onCancel: () => void;
  visible: boolean;
  isCheckAll?: boolean;
}

export const OnlineModal: React.FC<OnlineModalProps> = ({ onOk, onCancel, visible, isCheckAll }) => {
  const { instList: corpList, currentCorpId } = useContext(Context);
  const [corpIds, setCorpIds] = useState<CheckboxValueType[]>([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setCorpIds(e.target.checked ? corpList.map(({ corpId }: { corpId: string }) => corpId) : [currentCorpId]);
    setCheckAll(e.target.checked);
    setIndeterminate(!e.target.checked);
  };

  useEffect(() => {
    if (visible && corpList) {
      const corpIds = corpList.map((item: CorpProps) => item.corpId) || [];
      setCorpIds(corpIds);
      if (isCheckAll) {
        setCheckAll(true);
      }
    }
  }, [visible, corpList]);

  useEffect(() => {
    if (corpIds.length < corpList.length) {
      setCheckAll(false);
      setIndeterminate(true);
    } else {
      setCheckAll(true);
      setIndeterminate(false);
    }
  }, [corpIds]);

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
      <div className="flex">
        {isCheckAll && (
          <Checkbox
            className={styles.checkAll}
            indeterminate={indeterminate}
            onChange={onCheckAllChange}
            checked={checkAll}
          >
            全选
          </Checkbox>
        )}
        <Checkbox.Group onChange={(checkedValues) => setCorpIds(checkedValues)} value={corpIds}>
          {corpList?.map((corp: CorpProps) => {
            return (
              <Row key={corp.corpId} className={'pb10'}>
                <Col>
                  <Checkbox
                    value={corp.corpId}
                    checked={currentCorpId === corp.corpId}
                    disabled={currentCorpId === corp.corpId}
                  >
                    <span className="color-text-primary">{corp.corpName}</span>
                  </Checkbox>
                </Col>
              </Row>
            );
          })}
        </Checkbox.Group>
      </div>
    </Modal>
  );
};
