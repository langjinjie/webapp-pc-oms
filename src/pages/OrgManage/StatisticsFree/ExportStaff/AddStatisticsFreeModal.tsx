import { Form, Input, Select } from 'antd';
import React from 'react';
import { NgModal } from '../NgModal/NgModal';

interface AddStatisticsFreeModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
export const AddStatisticsFreeModal: React.FC<AddStatisticsFreeModalProps> = ({ visible, onConfirm, onCancel }) => {
  const handleOK = () => {
    onConfirm();
  };
  return (
    <NgModal visible={visible} title="新增免统计名单" onOk={handleOK} onCancel={onCancel}>
      <Form layout="vertical">
        <Form.Item label="员工姓名" key={'key2'} name={'key2'}>
          <Input placeholder="请选择" />
        </Form.Item>
        <Form.Item name={'key1'} label="免统计模块">
          <Select>
            <Select.Option value={1}>排行榜</Select.Option>
            <Select.Option value={2}>战报</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </NgModal>
  );
};
