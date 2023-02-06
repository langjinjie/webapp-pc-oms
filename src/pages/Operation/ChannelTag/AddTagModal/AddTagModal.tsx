import React from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { Icon } from 'src/components';
import style from './style.module.less';
import { PlusOutlined } from '@ant-design/icons';

interface IAddTagModalProps {
  visible: boolean;
  value?: any;
  title?: string;
  onOk?: () => void;
  onCancel?: () => void;
}

const AddTagModal: React.FC<IAddTagModalProps> = ({ visible, onCancel, onOk, title }) => {
  const [form] = Form.useForm();
  const { Item, List } = Form;

  const onCancelHandle = () => {
    onCancel?.();
  };
  const onOkHandle = () => {
    console.log(form.getFieldsValue());
    onOk?.();
  };
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
    >
      <Form form={form}>
        <Item name="groupName" label="标签组名称">
          <Input className={style.input} placeholder="请输入" showCount maxLength={15} />
        </Item>
        <Item label="标签值">
          <List name="tagList" initialValue={[{ tagName: '', tagId: '' }]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <div key={field.key}>
                    <div className={style.item}>
                      <Item name={[field.name, 'tagName']}>
                        <Input className={style.input} placeholder="请输入" showCount maxLength={10} />
                      </Item>
                      <Icon className={style.delIcon} name="shanchu" onClick={() => remove(index)} />
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
