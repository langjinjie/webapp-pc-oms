import React, { useEffect } from 'react';
import { Modal } from 'src/components';
import style from './style.module.less';
import { Form, Radio, Space } from 'antd';

interface IDownArticleLinkProps {
  visible: boolean;
  onOk?: (value: string) => void;
  onCancel: () => void;
  title?: string;
}

const { Item } = Form;

const ChannelModal: React.FC<IDownArticleLinkProps> = ({ title, visible, onCancel, onOk }) => {
  const [form] = Form.useForm();

  // 获取列表
  const getList = () => {
    console.log('getList');
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleOk = async () => {
    const { channelId } = await form.validateFields();
    onOk?.(channelId);
  };

  useEffect(() => {
    if (visible) {
      getList();
    }
  }, [visible]);

  return (
    <Modal
      className={style.wrap}
      title={title || '下载文章链接'}
      visible={visible}
      centered
      onClose={handleCancel}
      onOk={handleOk}
    >
      <Form form={form}>
        <Item name="channelId">
          <Radio.Group>
            <Space direction="vertical">
              <Radio value={1}>公有云文章</Radio>
              <Radio value={2}>江西人保</Radio>
              <Radio value={3}>河北人保</Radio>
            </Space>
          </Radio.Group>
        </Item>
      </Form>
    </Modal>
  );
};
export default ChannelModal;
