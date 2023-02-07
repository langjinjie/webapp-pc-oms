import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { Icon } from 'src/components';
import { PlusOutlined } from '@ant-design/icons';
// import { requestEditChannelGroupIsUse } from 'src/apis/channelTag';
import style from './style.module.less';

interface IAddTagModalProps {
  visible: boolean;
  value?: any;
  title?: string;
  onOk?: (value?: any) => void;
  onCancel?: () => void;
}

const AddTagModal: React.FC<IAddTagModalProps> = ({ visible, value, onCancel, onOk, title }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { Item, List } = Form;

  const onCancelHandle = () => {
    onCancel?.();
  };
  const onOkHandle = async () => {
    setLoading(true);
    await onOk?.({ ...form.getFieldsValue(), groupId: value?.groupId });
    setLoading(false);
  };
  // 删除标签值
  const removeTagHandle = async (remove: (index: number | number[]) => void, index: number) => {
    if (form.getFieldValue('tagList')[index].canDel === 2) {
      Modal.warn({ title: '操作提醒', content: '该数据无法删除' });
    } else {
      remove(index);
    }
  };
  useEffect(() => {
    if (visible) {
      value ? form.setFieldsValue(value) : form.resetFields();
    }
  }, [visible]);
  return (
    <Modal
      width={480}
      visible={visible}
      title={title || '新增标签'}
      onCancel={onCancelHandle}
      onOk={onOkHandle}
      className={style.modalWrap}
      centered
      maskClosable={false}
      okButtonProps={{
        loading
      }}
    >
      <Form form={form}>
        <Item name="groupName" label="标签组名称">
          <Input className={style.input} placeholder="请输入" showCount maxLength={15} />
        </Item>
        <Item label="标签值">
          <List name="tagList" initialValue={[{ tagName: '', tagId: undefined }]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <div key={field.key}>
                    <div className={style.item}>
                      <Item name={[field.name, 'tagName']}>
                        <Input className={style.input} placeholder="请输入" showCount maxLength={10} />
                      </Item>
                      <Icon className={style.delIcon} name="shanchu" onClick={() => removeTagHandle(remove, index)} />
                    </div>
                    <Item className={style.tagId} name={[field.name, 'tagId']}>
                      <Input placeholder="请输入" />
                    </Item>
                  </div>
                ))}
                <Button className={style.addBtn} icon={<PlusOutlined />} onClick={() => add()}>
                  添加标签
                </Button>
              </>
            )}
          </List>
        </Item>
      </Form>
    </Modal>
  );
};
export default AddTagModal;
